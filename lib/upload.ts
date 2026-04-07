import { put } from '@vercel/blob';

export async function uploadImageFromFormData(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) {
    return null;
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error('Image storage is not configured. Set BLOB_READ_WRITE_TOKEN in environment variables.');
  }

  const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
  if (!allowedTypes.has(file.type)) {
    throw new Error('Only jpg, png, webp, and gif files are allowed.');
  }

  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : file.type === 'image/gif' ? 'gif' : 'jpg';
  const safeName = file.name.replace(/\s+/g, '-').replace(/[^a-z0-9._-]/gi, '').toLowerCase() || `image.${ext}`;
  const pathname = `uploads/${Date.now()}-${safeName}`;

  const blob = await put(pathname, file, {
    access: 'public',
    addRandomSuffix: true,
    token,
  });

  return blob.url;
}
