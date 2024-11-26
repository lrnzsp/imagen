import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs/promises';  // Import fs/promises

export const runtime = 'edge';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js's body parser
  },
};

export async function POST(req) {
  try {
    const form = new formidable.IncomingForm();


    const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve({ fields, files });
        });
      });





    const prompt = fields.prompt;
    const image_weight = parseFloat(fields.image_weight || 0.5);



    let image_request = {
      prompt,
      aspect_ratio: "ASPECT_1_1",
      model: "V_2",
      magic_prompt_option: "AUTO",


    };




    if (files.reference_image) {
        try {

          const imageBuffer = await fs.readFile(files.reference_image.filepath);
          const imageBase64 = imageBuffer.toString('base64');

          image_request = {
            ...image_request,
            image: imageBase64,
            image_weight: image_weight
          };





        } catch (readError) {
          console.error("Error reading or encoding image:", readError);
          return NextResponse.json({ error: "Failed to process image file." }, { status: 500 });

        }
      }





    const res = await fetch('https://api.ideogram.ai/generate', {
      method: 'POST',
      headers: {
        'Api-Key': 'YOUR_IDEOGRAM_API_KEY', // Replace!
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image_request }),
    });



    const data = await res.json();
    return NextResponse.json(data);


  } catch (e) {

    console.error("API request error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
Key changes and explanations:

