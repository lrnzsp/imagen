export async function POST(request) {
  try {
    const { prompt } = await request.json();

    const response = await fetch('https://api.ideogram.ai/generate', {
      method: 'POST',
      headers: {
        'Api-Key': 'cTwZUoIc3Pse-EImC28fix8cWUWtB6CBdbRBRUny5KXjC00REAircBryE7r30G2fUxyk--vDBksFyB0BwnSAUg',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_request: {
          prompt,
          aspect_ratio: "ASPECT_1_1",
          model: "V_2",
          magic_prompt_option: "AUTO"
        }
      }),
      cache: 'no-store'
    });

    const responseText = await response.text();
    console.log('Raw response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response:', e);
      return new Response(
        JSON.stringify({ error: 'Invalid response from Ideogram API' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(data),
      { headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
