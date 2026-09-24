import { getTranscript } from 'youtube-transcript'

export async function POST(request) {
  try {
    const { url } = await request.json()
    const urlObj = new URL(url)
    let videoId = urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop()
    const transcript = await getTranscript(videoId)
    const fullTranscript = transcript.map(e => e.text).join(' ')
    return Response.json({ transcript: fullTranscript })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
