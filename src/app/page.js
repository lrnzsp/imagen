'use client';

import React, { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt) {
      setError('Inserisci un prompt per generare l\'immagine');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedImage('');

    try {
      console.log('Invio richiesta con prompt:', prompt);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();
      console.log('Risposta ricevuta:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Errore durante la generazione dell\'immagine');
      }

      if (!data?.data?.[0]) {
        throw new Error('Formato risposta non valido');
      }

      setGeneratedImage(data.data[0].url);
    } catch (err) {
      console.error('Errore durante la generazione:', err);
      setError(err.message);
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="prompt" className="sr-only">
              Prompt
            </label>
            <input
              id="prompt"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Descrivi l'immagine che vuoi generare..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span>Generazione in corso...</span>
            ) : (
              <span>Genera Immagine</span>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
            {error}
          </div>
        )}

        {generatedImage && (
          <div className="mt-8">
            <img
              src={generatedImage}
              alt="Immagine generata"
              className="w-full h-auto rounded-lg shadow-lg"
              onError={(e) => {
                console.error('Errore caricamento immagine');
                setError('Errore nel caricamento dell\'immagine generata');
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
