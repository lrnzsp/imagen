'use client';

import { useState } from 'react';

export default function Home() {
  // Stati per l'applicazione
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageWeight, setImageWeight] = useState(50);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [aspectRatio, setAspectRatio] = useState('ASPECT_1_1');
  const [colorPalette, setColorPalette] = useState('');

  // Costanti per i selettori
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
        // Se c'è un'immagine, usa il remix
        const formData = new FormData();
        formData.append('image_file', imageFile);
        formData.append('prompt', prompt);
        formData.append('image_weight', imageWeight.toString());

        res = await fetch('/api/remix', {
          method: 'POST',
          body: formData
        });
      } else {
        // Altrimenti usa la generazione normale
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
      if (!res.ok) throw new Error(data.error || 'Errore durante l\'elaborazione');
      setImageUrl(data.data[0].url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          AI Image Generator
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 backdrop-blur-lg bg-white/5 rounded-2xl p-6 shadow-xl">
          {/* Area upload immagine */}
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-2 text-gray-300">
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
                className="cursor-pointer bg-white/10 px-4 py-2 border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                Carica immagine
              </label>
              {imageFile && (
                <button
                  type="button"
                  onClick={clearImage}
                  className="px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300"
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
                  className="w-full max-h-48 object-contain rounded-xl border border-white/10 shadow-lg"
                />
              </div>
            )}
          </div>

          {/* Slider peso immagine */}
          {imageFile && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Peso dell&apos;immagine: {imageWeight}%
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={imageWeight}
                onChange={(e) => setImageWeight(parseInt(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>
          )}

          {/* Opzioni di generazione */}
          {!imageFile && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">
                    Formato
                  </label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    {Object.entries(aspectRatioOptions).map(([value, label]) => (
                      <option key={value} value={value} className="bg-gray-800">{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">
                    Palette
                  </label>
                  <select
                    value={colorPalette}
                    onChange={(e) => setColorPalette(e.target.value)}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    {Object.entries(colorPalettes).map(([value, label]) => (
                      <option key={value} value={value} className="bg-gray-800">{label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Prompt input */}
          <div className="space-y-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Descrivi l'immagine che vuoi generare..."
              className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg font-medium 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:from-blue-600 hover:to-purple-700 
                     transform transition-all duration-300 hover:scale-[1.02]"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {imageUrl && (
          <div className="mt-8 backdrop-blur-lg bg-white/5 rounded-2xl p-6 shadow-xl border border-white/10">
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
