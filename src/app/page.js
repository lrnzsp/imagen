'use client';

import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [editing, setEditing] = useState(false); // Add editing state

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, editing }) // Send editing flag
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Errore durante la generazione');

      setImageUrl(data.data[0].url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setEditing(false); // Reset editing after submission
    }
  }


  const handleRemix = async () => {
    if (!imageUrl) return;

    setEditing(true); // Set editing mode before sending remix request


    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, editing: true, imageUrl }) // Send editing flag and image URL
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Errore durante la generazione');
      setImageUrl(data.data[0].url);
    } catch (err) {

      setError(err.message);
    } finally {
      setLoading(false);
      setEditing(false);

    }
  };



  return (
    <main className="p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-center">
          Generatore di Immagini
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {imageUrl && (
            <button
              onClick={handleRemix}
              disabled={loading}
              className="w-full bg-green-500 text-white p-2 rounded disabled:bg-gray-400 mt-2"
            >
              {loading ? 'Remixing...' : 'Remix'}
            </button>
          )}
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
