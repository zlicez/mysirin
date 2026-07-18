import path from 'path';
import fs from 'fs/promises';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).end();
  }

  const filename = Array.isArray(req.query.filename) ? req.query.filename[0] : req.query.filename;
  if (!filename || path.basename(filename) !== filename || !filename.endsWith('.webp')) {
    return res.status(404).end();
  }

  try {
    const image = await fs.readFile(path.join(process.cwd(), 'public', 'uploads', filename));
    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Content-Length', image.length);
    if (req.method === 'HEAD') return res.status(200).end();
    return res.status(200).send(image);
  } catch (error) {
    if (error.code === 'ENOENT') return res.status(404).end();
    throw error;
  }
}
