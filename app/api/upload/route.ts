import { NextResponse } from 'next/server';

import { getAdminSession } from '@/lib/auth';
import { uploadImageFromFormData } from '@/lib/upload';

export async function POST(request: Request) {
  const session = getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'File is required.' }, { status: 400 });
  }

  try {
    const url = await uploadImageFromFormData(file);
    if (!url) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }
    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
