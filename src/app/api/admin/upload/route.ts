import { NextRequest, NextResponse } from 'next/server'
import { isServerAdminAuthenticated } from '@/lib/admin-auth'

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(req: NextRequest) {
  try {
    // 1. Admin Authentication Check
    const isAuth = await isServerAdminAuthenticated()
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required.' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // 2. Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.' },
        { status: 400 }
      )
    }

    // 3. Validate file size (max 5MB)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Image must be smaller than 5MB' }, { status: 400 })
    }

    // Convert to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')

    // Read ImgBB API Key securely from environment variables
    const apiKey = process.env.IMGBB_API_KEY

    // Try uploading to ImgBB if key is configured
    if (apiKey) {
      try {
        const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50)
        const imgbbForm = new FormData()
        imgbbForm.append('image', base64)
        imgbbForm.append('name', sanitizedFilename)

        const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`, {
          method: 'POST',
          body: imgbbForm,
        })

        if (imgbbRes.ok) {
          const imgbbData = await imgbbRes.json()
          if (imgbbData?.success && imgbbData?.data?.display_url) {
            return NextResponse.json({
              url: imgbbData.data.display_url,
              thumb: imgbbData.data.thumb?.url,
              provider: 'imgbb',
            })
          }
        }
      } catch (imgbbErr) {
        console.error('ImgBB upload error:', imgbbErr)
      }
    }

    // Secure Data URL fallback
    const mimeType = file.type || 'image/jpeg'
    const dataUrl = `data:${mimeType};base64,${base64}`

    return NextResponse.json({
      url: dataUrl,
      provider: 'base64',
    })
  } catch (err) {
    console.error('Image upload error:', err)
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }
}
