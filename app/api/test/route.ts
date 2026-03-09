export async function GET() {
  return new Response(JSON.stringify({ 
    status: 'ok', 
    message: 'API is reachable',
    env_key_exists: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY 
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
