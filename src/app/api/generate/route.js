import { NextResponse } from 'next/server';
import { fetch } from 'node-fetch'; // o altro client HTTP

export async function POST(req) {
  try {
    const formData = await req.formData();
    const imageRequest = JSON.parse(formData.get('image_request'));
    const imageFile = formData.get('image_file');


    const res = await fetch('https://api.ideogram.ai/remix', {
      method: 'POST',
      headers: {
        'Api-Key': process.env.IDEOGRAM_API_KEY, // Imposta la tua API key
        'Content-Type': 'multipart/form-data;boundary=<calculated boundary>', // fetch aggiungerà il boundary automaticamente
      },
      body: formData // Invia direttamente il formData
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Errore durante il remix');

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
