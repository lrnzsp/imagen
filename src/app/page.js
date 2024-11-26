'use client';

import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  // Nuovi stati per la gestione del file
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Errore durante la generazione');
      
      setImageUrl(data.data[0].url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Nuova funzione per gestire il caricamento del file
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  // Nuova funzione per rimuovere il file
  function clearImage() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setImageFile(null);
    setPreviewUrl(null);
  }

  return (
    <main className="p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-center">
          Generatore di Immagini
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nuovo componente per l'upload del file */}
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
                className="cursor-pointer bg-white px-4 py-2 border rounded hover:bg-gray-50"
              >
                Carica immagine
              </label>
              {imageFile && (
                <button
                  type="button"
                  onClick={clearImage}
                  className="px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                >
                  Rimuovi
                </button>
              )}
            </div>
            {previewUrl && (
              <div className="mt-2">
                <img
                  src={previewUrl}
                  alt="Anteprima"
                  className="w-full max-h-48 object-contain rounded border"
                />
              </div>
            )}
          </div>

          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Descrivi l'immagine..."
            className="w-full p-2 border rounded"
            required
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-gray-400"
          >
            {loading ? 'Generazione...' : 'Genera Immagine'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {imageUrl && (
          <div className="mt-8">
            <img 
              src={imageUrl} 
              alt="Immagine generata"
              className="w-full rounded shadow-lg" 
            />
          </div>
        )}
      </div>
    </main>
  );
}
