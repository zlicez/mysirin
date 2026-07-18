import crypto from 'crypto';
import path from 'path';
import fs from 'fs/promises';
import formidable from 'formidable';
import sharp from 'sharp';
import { withAdmin } from '../../../src/server/auth';
import { apiError, methodNotAllowed } from '../../../src/server/api';

export const config = { api: { bodyParser: false } };

const variants = {
  cover: { width: 1230, height: 692, fit: 'cover' },
  hero: { width: 1920, height: 848, fit: 'cover' },
  banner: { width: 1920, height: 736, fit: 'cover' },
  profile: { width: 1600, height: 1200, fit: 'cover', position: 'attention' },
  avatar: { width: 600, height: 600, fit: 'cover', position: 'attention' },
  gallery: { width: 2400, height: 2400, fit: 'inside' },
};

export default withAdmin(async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
  try {
    const maxFileSize = Number(process.env.MAX_UPLOAD_MB || 12) * 1024 * 1024;
    const form = formidable({ multiples: false, maxFileSize, allowEmptyFiles: false });
    const [fields, files] = await form.parse(req);
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const kindValue = Array.isArray(fields.kind) ? fields.kind[0] : fields.kind;
    const kind = variants[kindValue] ? kindValue : 'gallery';
    if (!file || !String(file.mimetype || '').startsWith('image/')) {
      return res.status(400).json({ message: 'Выберите изображение' });
    }

    const absoluteDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(absoluteDir, { recursive: true });
    const filename = `${Date.now()}-${crypto.randomUUID()}.webp`;
    const target = path.join(absoluteDir, filename);
    const variant = variants[kind];

    const pipeline = sharp(file.filepath).rotate().resize({
      width: variant.width,
      height: variant.height,
      fit: variant.fit,
      position: variant.position || 'centre',
      withoutEnlargement: kind !== 'cover' && kind !== 'hero' && kind !== 'banner',
    });
    await pipeline.webp({ quality: 88 }).toFile(target);
    const metadata = await sharp(target).metadata();
    return res.status(201).json({
      filename: `api/media/${filename}`,
      width: metadata.width,
      height: metadata.height,
    });
  } catch (error) {
    if (error.code === 1009 || String(error.message).includes('maxFileSize')) {
      return res.status(413).json({ message: 'Файл слишком большой' });
    }
    return apiError(res, error);
  }
});
