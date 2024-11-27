import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req) {
  try {
    const { prompt, aspectRatio, negativePrompt, colorPalette } = await req.json();

    const imageRequest = {
      prompt,
      aspect_ratio: aspectRatio || "ASPECT_1_1",
      model: "V_2",
      magic_prompt_option: "ON",
      style_type: "REALISTIC"
    };

    // Aggiungi parametri opzionali se presenti
    if (negativePrompt) imageRequest.negative_prompt = negativePrompt;
    if (colorPalette && colorPalette !== '') {
      imageRequest.color_palette = { name: colorPalette };
    }

    const requestBody = {
      image_request: imageRequest
    };

    const res = await fetch('https://api.ideogram.ai/generate', {
      method: 'POST',
      headers: {
        'Api-Key': 'cTwZUoIc3Pse-EImC28fix8cWUWtB6CBdbRBRUny5KXjC00REAircBryE7r30G2fUxyk--vDBksFyB0BwnSAUg',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error('API Error:', errorData);
      throw new Error('Errore nella risposta da Ideogram');
    }

    const data = await res.json();
    return NextResponse.json(data);
    
  } catch (e) {
    console.error('Generate error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
