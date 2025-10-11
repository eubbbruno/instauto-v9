import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const errorData = await request.json()
    
    // Log do erro
    console.error('Frontend Error:', {
      timestamp: errorData.timestamp,
      message: errorData.message,
      url: errorData.url,
      userAgent: errorData.userAgent,
      stack: errorData.stack,
      componentStack: errorData.componentStack
    })

    // Em produção, você enviaria para um serviço como Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === 'production') {
      // Exemplo: await sendToSentry(errorData)
      // Exemplo: await sendToLogRocket(errorData)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error logging failed:', error)
    return NextResponse.json(
      { error: 'Failed to log error' },
      { status: 500 }
    )
  }
}
