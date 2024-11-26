'use client';

import React, { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');

  const generateImage = async () => {
    if (!prompt) {
      setError('Per favore, inserisci un prompt testuale.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Errore durante la generazione dell\'immagine');
      }

      setGeneratedImage(data.data[0].url);
    } catch (error) {
      console.error('Error details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Generatore di Immagini
        </h1>

        <div className="space-y-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Descrivi l'immagine che vuoi generare..."
              className="flex-1 p-3 border border-gray-300 rounded-md shadow-sm"
            />
            <button 
              onClick={generateImage}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-sm disabled:bg-gray-400"
            >
              {loading ? 'Generazione...' : 'Genera'}
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {generatedImage && (
            <div className="mt-8">
              <img
                src={generatedImage}
                alt="Immagine generata"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
