```javascript
'use client';

import { useState, useRef } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageWeight, setImageWeight] = useState(0.5); // Default image weight
  const [referenceImage, setReferenceImage] = useState(null);
  const fileInputRef = useRef(null);


  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('image_weight', imageWeight); 
      if (referenceImage) {
        formData.append('reference_image', referenceImage);
      }

      const res = await fetch('/api/generate', {
        method: 'POST',
        body: formData, // Send FormData directly
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Errore durante la generazione');
      }

      setImageUrl(data.data[0].url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleImageChange = (event) => {
    setReferenceImage(event.target.files[0]);
  };


  return (
    <main className="p-8">
      <div className="max-w-xl mx-auto">
        {/* ... (rest of the code) */}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ... (input and button) */}

           {/* Reference Image Upload */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*" 
              className="mt-2"
            />
            {referenceImage && (
              <p className="text-sm mt-1">
                File selezionato: {referenceImage.name}
              </p>
            )}
            <button type="button" onClick={() => {setReferenceImage(null); if(fileInputRef.current) fileInputRef.current.value = null;}} className="mt-2 text-red-500 text-sm hover:underline">Rimuovi Immagine</button> {/* Clear button */}


          </div>

           {/* Image Weight Slider */}
          <div className="flex items-center space-x-2">
            <label htmlFor="imageWeight" className="text-sm">Image Weight:</label>
            <input
              type="range"
              id="imageWeight"
              name="imageWeight"
              min="0"
              max="1"
              step="0.1"
              value={imageWeight}
              onChange={(e) => setImageWeight(parseFloat(e.target.value))}
              className="w-full" 
            />
            <span className="text-sm">{imageWeight}</span>
          </div>


          {/* ... (rest of the form) */}
        </form>

        {/* ... (rest of the code) */}
      </div>
    </main>
  );
}
