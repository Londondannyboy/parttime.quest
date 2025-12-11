import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  const path = request.nextUrl.searchParams.get('path')

  // Verify secret token
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid revalidation token' }, { status: 401 })
  }

  try {
    if (path) {
      // Revalidate specific path
      revalidatePath(path)
      return NextResponse.json({
        revalidated: true,
        path,
        timestamp: new Date().toISOString(),
      })
    }

    // Revalidate all job and article pages
    revalidatePath('/fractionaljobsuk')
    revalidatePath('/job')
    revalidatePath('/articles')
    revalidatePath('/sitemap.xml')

    return NextResponse.json({
      revalidated: true,
      paths: ['/fractionaljobsuk', '/job', '/articles', '/sitemap.xml'],
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Revalidation failed', details: String(error) },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  // Allow health check without secret
  if (!secret) {
    return NextResponse.json({
      status: 'ok',
      message: 'ISR revalidation endpoint ready',
      usage:
        'POST /api/revalidate?secret=YOUR_SECRET&path=/path/to/revalidate (or omit path to revalidate all)',
    })
  }

  // Verify secret for status check
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  return NextResponse.json({
    status: 'authenticated',
    timestamp: new Date().toISOString(),
  })
}
