import { NextRequest, NextResponse } from 'next/server'

// Free image upload using ImgBB API (free tier, no sign-up needed for basic uploads)
// Alternative: we Base64 encode and store the image data URL directly
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image must be smaller than 10MB' }, { status: 400 })
    }

    // Convert to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')

    // Try uploading to ImgBB (free image hosting)
    try {
      const imgbbForm = new FormData()
      imgbbForm.append('image', base64)
      imgbbForm.append('name', file.name.replace(/\.[^.]+$/, ''))

      // Using ImgBB free API (no key needed for basic uploads, but with key for reliability)
      const imgbbRes = await fetch('https://api.imgbb.com/1/upload?key=5e7b8eae7f12882a3c4a0c58c5349e97', {
        method: 'POST',
        body: imgbbForm,
      })

      if (imgbbRes.ok) {
        const imgbbData = await imgbbRes.json()
        if (imgbbData.success) {
          return NextResponse.json({
            url: imgbbData.data.display_url,
            thumb: imgbbData.data.thumb?.url,
            delete_url: imgbbData.data.delete_url,
            provider: 'imgbb',
          })
        }
      }
    } catch (imgbbErr) {
      console.error('ImgBB upload failed, falling back to data URL:', imgbbErr)
    }

    // Fallback: return as data URL (works but heavy on the database)
    const mimeType = file.type || 'image/jpeg'
    const dataUrl = `data:${mimeType};base64,${base64}`

    return NextResponse.json({
      url: dataUrl,
      provider: 'base64',
      warning: 'Using base64 fallback. Images may load slowly.',
    })
  } catch (err) {
    console.error('Image upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
