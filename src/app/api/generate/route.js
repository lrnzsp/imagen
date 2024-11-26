// src/app/api/remix/route.js
export const runtime = 'edge';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get('image_file');
    const prompt = formData.get('prompt');
    const imageWeight = parseInt(formData.get('image_weight')) || 50;

    const remixFormData = new FormData();
    remixFormData.append('image_file', imageFile);
    remixFormData.append('image_request', JSON.stringify({
      prompt,
      aspect_ratio: "ASPECT_1_1",
      model: "V_2",
      magic_prompt_option: "AUTO",
      image_weight: imageWeight
    }));

    const response = await fetch('https://api.ideogram.ai/remix', {
      method: 'POST',
      headers: {
        'Api-Key': 'cTwZUoIc3Pse-EImC28fix8cWUWtB6CBdbRBRUny5KXjC00REAircBryE7r30G2fUxyk--vDBksFyB0BwnSAUg',
      },
      body: remixFormData
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e.message }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
