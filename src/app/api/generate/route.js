import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt non fornito' },
        { status: 400 }
      );
    }

    const apiUrl = 'https://api.ideogram.ai/generate';
    const requestData = {
      image_request: {
        prompt,
        aspect_ratio: "ASPECT_1_1",
        model: "V_2",
        magic_prompt_option: "AUTO"
      }
    };

    console.log('Invio richiesta a Ideogram:', requestData);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Api-Key': 'cTwZUoIc3Pse-EImC28fix8cWUWtB6CBdbRBRUny5KXjC00REAircBryE7r30G2fUxyk--vDBksFyB0BwnSAUg',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    console.log('Status risposta Ideogram:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Errore Ideogram:', errorText);
      return NextResponse.json(
        { error: 'Errore nella risposta da Ideogram' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Risposta da Ideogram:', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Errore durante la generazione:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
