import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req) {
  try {
    const { prompt, editing, imageUrl } = await req.json(); // Receive editing flag and imageUrl
    let requestBody;

    if (editing && imageUrl) {
      requestBody = {
        image_request: {
          prompt,
          aspect_ratio: "ASPECT_1_1",
          model: "V_2",
          magic_prompt_option: "AUTO",
          use_image_strength: true, // Enable image strength for remix
          image_strength: 0.4, // You may tweak this value
          init_image: imageUrl // Initial image for remix
        }
      };

    } else {
      requestBody = {
        image_request: {
          prompt,
          aspect_ratio: "ASPECT_1_1",
          model: "V_2",
          magic_prompt_option: "AUTO"

        }
      };
    }





    const res = await fetch('https://api.ideogram.ai/generate', {
      method: 'POST',
      headers: {
        'Api-Key': 'cTwZUoIc3Pse-EImC28fix8cWUWtB6CBdbRBRUny5KXjC00REAircBryE7r30G2fUxyk--vDBksFyB0BwnSAUg',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    const data = await res.json();
    return NextResponse.json(data);

  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
