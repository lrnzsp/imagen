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
  // Temporaneamente rimosso - da riabilitare in futuro
  // const [colorPalette, setColorPalette] = useState('');

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

  // Temporaneamente rimosso - da riabilitare in futuro
  // const colorPalettes = {
  //   '': 'Nessuna palette',
  //   'EMBER': 'Ember',
  //   'FRESH': 'Fresh',
  //   'JUNGLE': 'Jungle',
  //   'MAGIC': 'Magic',
  //   'MELON': 'Melon',
  //   'MOSAIC': 'Mosaic',
  //   'PASTEL': 'Pastel',
  //   'ULTRAMARINE': 'Ultramarine'
  // };

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
            aspectRatio
            // colorPalette // Temporaneamente rimosso
          })
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Errore durante l\'elaborazione');
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
        <h1 className="text-4xl font-bold mb-12 text-center title-font">
          AI Image Generator
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-black border border-white/20 rounded-2xl p-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-2">
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
                className="cursor-pointer bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-all duration-300"
              >
                Carica immagine
              </label>
              {imageFile && (
                <button
                  type="button"
                  onClick={clearImage}
                  className="px-3 py-2 text-white border border-white rounded-lg hover:bg-white/10 transition-all duration-300"
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
                  className="w-full max-h-48 object-contain rounded-xl border border-white/20"
                />
              </div>
            )}
          </div>

          {imageFile && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Peso dell&apos;immagine: {imageWeight}%
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={imageWeight}
                  onChange={(e) => setImageWeight(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Formato Output
                </label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full p-2 bg-black border border-white rounded-lg text-white focus:ring-2 focus:ring-white transition-all duration-300"
                >
                  {Object.entries(aspectRatioOptions).map(([value, label]) => (
                    <option key={value} value={value} className="bg-black">{label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {!imageFile && (
            <div className="space-y-4">
           </select>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Descrivi l'immagine che vuoi generare..."
              className="w-full p-4 bg-black border border-white rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-white transition-all duration-300"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black p-4 rounded-lg font-medium 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:bg-gray-200 
                     transform transition-all duration-300"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generazione in corso...
              </span>
            ) : (
              imageFile ? 'Remix Immagine' : 'Genera Immagine'
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 border border-red-500 text-red-500 rounded-lg">
            {error}
          </div>
        )}

        {imageUrl && (
          <div className="mt-8 bg-black border border-white/20 rounded-2xl p-6">
            <img 
              src={imageUrl} 
              alt="Immagine generata"
              className="w-full rounded-lg" 
            />
          </div>
        )}
      </div>
    </main>
  );
}
