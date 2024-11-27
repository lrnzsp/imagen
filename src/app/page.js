
'use client';

import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageWeight, setImageWeight] = useState(50);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [aspectRatio, setAspectRatio] = useState('ASPECT_1_1');
  const [colorPalette, setColorPalette] = useState('');

  const aspectRatioOptions = {
    'ASPECT_1_1': '1:1 Quadrato',
    'ASPECT_10_16': '10:16 Verticale',
    'ASPECT_16_10': '16:10 Panoramico',
    'ASPECT_9_16': '9:16 Mobile',
    'ASPECT_16_9': '16:9 Widescreen',
    'ASPECT_3_2': '3:2 Fotografia',
    'ASPECT_2_3': '2:3 Ritratto',
    'ASPECT_4_3': '4:3 Standard',
    'ASPECT_3_4': '3:4 Verticale',
    'ASPECT_1_3': '1:3 Banner Verticale',
    'ASPECT_3_1': '3:1 Banner Orizzontale'
  };

  const colorPalettes = {
    '': 'Nessuna palette',
    'EMBER': 'Ember',
    'FRESH': 'Fresh',
    'JUNGLE': 'Jungle',
    'MAGIC': 'Magic',
    'MELON': 'Melon',
    'MOSAIC': 'Mosaic',
    'PASTEL': 'Pastel',
    'ULTRAMARINE': 'Ultramarine'
  };

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  }

  function clearImage() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setImageFile(null);
    setPreviewUrl(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let res;

      if (imageFile) {
        const formData = new FormData();
        formData.append('image_file', imageFile);
        formData.append('prompt', prompt);
        formData.append('image_weight', imageWeight.toString());
        formData.append('aspectRatio', aspectRatio);

        res = await fetch('/api/remix', {
          method: 'POST',
          body: formData
        });
      } else {
        res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            prompt,
            aspectRatio,
            colorPalette
          })
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Errore durante l'elaborazione');
      setImageUrl(data.data[0].url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl title-font mb-12 text-center">
          AI Image Generator
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-black rounded-2xl p-6 shadow-xl">
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-2 text-white">
              Immagine di riferimento (opzionale)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept="image/*"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-white px-4 py-2 border border-white rounded-lg hover:bg-black hover:text-white transition-all duration-300"
              >
                Carica immagine
              </label>
              {imageFile && (
                <button
                  type="button"
                  onClick={clearImage}
                  className="px-3 py-2 text-white bg-black border border-white rounded-lg hover:bg-white hover:text-black transition-all duration-300"
                >
                  Rimuovi
                </button>
              )}
            </div>
            {previewUrl && (
              <div className="mt-4">
                <img
                  src={previewUrl}
                  alt="Anteprima"
                  className="w-full max-h-48 object-contain rounded-xl border border-white shadow-lg"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black p-4 rounded-lg font-medium 
                      disabled:opacity-50 disabled:cursor-not-allowed
                      hover:bg-black hover:text-white transition-all duration-300"
          >
            {loading ? 'Generazione in corso...' : 'Genera Immagine'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500 text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {imageUrl && (
          <div className="mt-8 bg-black rounded-2xl p-6 shadow-xl border border-white">
            <img 
              src={imageUrl} 
              alt="Immagine generata"
              className="w-full rounded-lg shadow-2xl" 
            />
          </div>
        )}
      </div>
    </main>
  );
}
