import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { prompt, aspectRatio, negativePrompt, colorPalette } = await req.json();

    // Log dei parametri ricevuti
    console.log('Received parameters:', {
      prompt,
      aspectRatio,
      negativePrompt,
      colorPalette
    });

    const imageRequest = {
      prompt,
      aspect_ratio: aspectRatio,
      model: "V_2",
      magic_prompt_option: "ON",
      style_type: "REALISTIC"
    };

    if (negativePrompt) {
      imageRequest.negative_prompt = negativePrompt;
    }

    if (colorPalette && colorPalette !== '') {
      imageRequest.color_palette = { name: colorPalette };
    }

    // Log della richiesta finale
    console.log('Final request to Ideogram:', {
      image_request: imageRequest
    });

    const response = await fetch('https://api.ideogram.ai/generate', {
      method: 'POST',
      headers: {
        'Api-Key': 'cTwZUoIc3Pse-EImC28fix8cWUWtB6CBdbRBRUny5KXjC00REAircBryE7r30G2fUxyk--vDBksFyB0BwnSAUg',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_request: imageRequest
      })
    });

    const data = await response.json();

    // Log della risposta
    console.log('Ideogram response:', data);

    return NextResponse.json(data);
    
  } catch (e) {
    console.error('Error in generate endpoint:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
