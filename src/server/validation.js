import { z } from 'zod';

const optionalText = z.preprocess(
  (value) => value == null ? '' : value,
  z.string().trim().max(10000)
).default('');

export const newsSchema = z.object({
  title: z.string().trim().min(2).max(300),
  text: z.string().max(100000).optional().default(''),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
  coverImage: optionalText,
  publishedAt: z.coerce.date(),
  gallery: z.array(z.string().trim().min(1)).max(50).default([]),
});

export const crewSchema = z.object({
  fullname: z.string().trim().min(2).max(300),
  vacancy: z.string().trim().min(2).max(1000),
  subVacancy: optionalText,
  education: optionalText,
  experience: optionalText,
  achievements: optionalText,
  position: z.coerce.number().int().min(0).default(0),
  photoImage: optionalText,
  bannerImage: optionalText,
  active: z.boolean().default(true),
  gallery: z.array(z.string().trim().min(1)).max(50).default([]),
});

export const applicationSchema = z.object({
  fullname_applicant: z.string().trim().min(2).max(300),
  fullname_student: z.string().trim().min(2).max(300),
  age_student: z.coerce.number().int().min(3).max(99),
  contact: z.string().trim().min(5).max(300),
  place: z.string().trim().min(2).max(1000),
});

export const slideSchema = z.object({
  title: optionalText,
  alt: optionalText,
  image: z.string().trim().min(1).max(1000),
  position: z.coerce.number().int().min(0).default(0),
  active: z.boolean().default(true),
});

export const reviewSchema = z.object({
  text: z.string().trim().min(2).max(10000),
  fullname: z.string().trim().min(2).max(300),
  vacancy: z.string().trim().min(2).max(1000),
  photoImage: optionalText,
  position: z.coerce.number().int().min(0).default(0),
  active: z.boolean().default(true),
});

export function validationMessage(error) {
  return error?.issues?.map((issue) => issue.message).join(', ') || 'Некорректные данные';
}
