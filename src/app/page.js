'use client';
import { useState, useRef } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageWeight, setImageWeight] = useState(50);
  const fileInputRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const file = fileInputRef.current.files[0];
    if (!file) {
      setError("Seleziona un'immagine di riferimento.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image_file', file);
      formData.append(
        'image_request',
        JSON.stringify({
          prompt,
          aspect_ratio: 'ASPECT_1_1', // Puoi cambiare l'aspect ratio qui
          image_weight: imageWeight,
          magic_prompt_option: 'ON', // o OFF
          model: 'V_2', // o V_1, etc.
        })
      );

      const res = await fetch('/api/remix', { // Chiama la nuova route /api/remix
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Errore durante il remix');
      setImageUrl(data.data[0].url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-center">
          Remix di Immagini
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Descrivi le modifiche..."
            className="w-full p-2 border rounded"
            required
          />
          <div>
            <label htmlFor="imageWeight">Image Weight: {imageWeight}</label>
            <input
              type="range"
              id="imageWeight"
              name="imageWeight"
              min="1"
              max="100"
              value={imageWeight}
              onChange={(e) => setImageWeight(parseInt(e.target.value, 10))}
              className="w-full"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-gray-400"
          >
            {loading ? 'Remix in corso...' : 'Remix'}
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
              alt="Immagine remixata"
              className="w-full rounded shadow-lg"
            />
          </div>
        )}
      </div>
    </main>
  );
}
