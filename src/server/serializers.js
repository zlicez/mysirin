const publicImagePath = (filename) => {
  if (!filename) return '';
  if (filename.startsWith('uploads/')) return `api/media/${filename.slice('uploads/'.length)}`;
  return filename;
};

const imageArray = (filename) => (filename ? [{ filename: publicImagePath(filename) }] : []);

export function serializeNews(news) {
  return {
    id: news.id,
    title: news.title,
    text: news.text,
    createdAt: news.publishedAt.toISOString(),
    pre_images: imageArray(news.coverImage),
    images: (news.gallery || []).map((image) => ({ filename: publicImagePath(image.filename) })),
  };
}

export function serializeAdminNews(news) {
  return {
    id: news.id,
    title: news.title,
    text: news.text,
    status: news.status,
    coverImage: publicImagePath(news.coverImage),
    publishedAt: news.publishedAt.toISOString(),
    gallery: (news.gallery || []).map((image) => publicImagePath(image.filename)),
    createdAt: news.createdAt.toISOString(),
    updatedAt: news.updatedAt.toISOString(),
  };
}

export function serializeCrew(member) {
  return {
    id: member.id,
    fullname: member.fullname,
    vacancy: member.vacancy,
    sub_vacancy: member.subVacancy || '',
    education: member.education || '',
    experience: member.experience || '',
    achievements: member.achievements || '',
    position: member.position,
    photo: imageArray(member.photoImage),
    banner: imageArray(member.bannerImage),
    images: (member.gallery || []).map((image) => ({ filename: publicImagePath(image.filename) })),
  };
}

export function serializeAdminCrew(member) {
  return {
    id: member.id,
    fullname: member.fullname,
    vacancy: member.vacancy,
    subVacancy: member.subVacancy || '',
    education: member.education || '',
    experience: member.experience || '',
    achievements: member.achievements || '',
    position: member.position,
    photoImage: publicImagePath(member.photoImage),
    bannerImage: publicImagePath(member.bannerImage),
    active: member.active,
    gallery: (member.gallery || []).map((image) => publicImagePath(image.filename)),
  };
}

export function serializeAdminReview(review) {
  return {
    id: review.id,
    text: review.text,
    fullname: review.fullname,
    vacancy: review.vacancy,
    photoImage: publicImagePath(review.photoImage),
    position: review.position,
    active: review.active,
  };
}
