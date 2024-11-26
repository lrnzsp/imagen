export async function POST(request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image_file');
    const prompt = formData.get('prompt');
    const imageWeight = formData.get('image_weight');

    // Creiamo un nuovo FormData per la richiesta a Ideogram
    const ideogramFormData = new FormData();
    ideogramFormData.append('image_file', imageFile);
    ideogramFormData.append('image_request', JSON.stringify({
      prompt,
      aspect_ratio: "ASPECT_1_1",
      model: "V_2",
      magic_prompt_option: "AUTO",
      image_weight: parseInt(imageWeight)
    }));

    const response = await fetch('https://api.ideogram.ai/remix', {
      method: 'POST',
      headers: {
        'Api-Key': 'cTwZUoIc3Pse-EImC28fix8cWUWtB6CBdbRBRUny5KXjC00REAircBryE7r30G2fUxyk--vDBksFyB0BwnSAUg'
      },
      body: ideogramFormData
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Remix error:', error);
    return Response.json(
      { error: 'Errore durante il remix dell\'immagine' },
      { status: 500 }
    );
  }
}
