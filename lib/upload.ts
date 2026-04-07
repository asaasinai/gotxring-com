import { put } from '@vercel/blob';

export async function uploadImageFromFormData(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) {
    return null;
  }

  const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
  if (!allowedTypes.has(file.type)) {
    throw new Error('Only jpg, png, and webp files are allowed.');
  }

  const extension = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
  const safeName = file.name.replace(/\s+/g, '-').toLowerCase();
  const pathname = `uploads/${Date.now()}-${safeName || `image.${extension}`}`;

  const blob = await put(pathname, file, {
    access: 'public',
    addRandomSuffix: true,
    token: process.env.BLOB_READ_WRITE_TOKEN
  });

  return blob.url;
}
