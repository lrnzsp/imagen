import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req) {
  try {
    const { prompt, aspectRatio, negativePrompt, colorPalette } = await req.json();

    // Costruisci il corpo della richiesta
    const imageRequest = {
      prompt,
      model: "V_2",
      magic_prompt_option: "ON",
      style_type: "REALISTIC",
      aspect_ratio: aspectRatio
    };

    // Aggiungi i parametri opzionali se presenti
    if (negativePrompt) {
      imageRequest.negative_prompt = negativePrompt;
    }
    if (colorPalette && colorPalette !== '') {
      imageRequest.color_palette = { name: colorPalette };
    }

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
    return NextResponse.json(data);
    
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
