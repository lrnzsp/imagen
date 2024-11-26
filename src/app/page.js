import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt, aspectRatio = 'ASPECT_1_1' } = body;

    console.log('Ricevuta richiesta di generazione per prompt:', prompt);

    const response = await fetch('https://api.ideogram.ai/generate', {
      method: 'POST',
      headers: {
        'Api-Key': 'cTwZUoIc3Pse-EImC28fix8cWUWtB6CBdbRBRUny5KXjC00REAircBryE7r30G2fUxyk--vDBksFyB0BwnSAUg',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_request: {
          prompt,
          aspect_ratio: aspectRatio,
          model: "V_2",
          magic_prompt_option: "AUTO"
        }
      })
    });

    if (!response.ok) {
      throw new Error('Errore nella risposta da Ideogram');
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Errore durante la generazione:', error);
    return NextResponse.json(
      { error: 'Errore durante la generazione dell\'immagine' },
      { status: 500 }
    );
  }
}
