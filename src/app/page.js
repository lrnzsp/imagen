'use client';

import { useState } from 'react';

// Prefisso fisso per tutti i prompt
const FIXED_PREFIX = "a fashion photograph of";

export default function Home() {
  // ... tutto il tuo codice degli stati rimane uguale ...

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let res;
      const enhancedPrompt = `${FIXED_PREFIX} ${prompt}`.trim();
      
      if (imageFile) {
        const formData = new FormData();
        formData.append('image_file', imageFile);
        formData.append('prompt', enhancedPrompt);
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
            image_request: {
              prompt: enhancedPrompt,
              aspect_ratio: aspectRatio,
              model: "V_2",
              magic_prompt_option: "ON",
              style_type: "REALISTIC",
              color_palette: colorPalette ? { name: colorPalette } : undefined
            }
          })
        });
      }

      const data = await res.json();
      console.log('API Response:', data);
      
      if (!res.ok) throw new Error(data.error || 'Errore durante l\'elaborazione');
      
      if (!data || !data.data || !data.data[0] || !data.data[0].url) {
        throw new Error('Risposta API non valida: formato inatteso');
      }
      
      setImageUrl(data.data[0].url);
    } catch (err) {
      console.error('Error details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ... il resto del tuo codice rimane uguale ...
