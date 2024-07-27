import React, { useState } from 'react';
import OpenAI from 'openai';
import './App.css';

// Inicializar OpenAI con la clave de API
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_MY_API_KEY,
  dangerouslyAllowBrowser: true,
});

function App() {
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");

  async function fetchData() {
    if (!prompt) {
      setError("Prompt is required.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // Llamada a la API de DALL-E para generar una imagen
      const response = await openai.images.generate({
        model: "dall-e-3", // Asegúrate de usar el modelo correcto
        prompt: prompt,
        n: 1,
        size: "1024x1024", // Ajusta el tamaño de la imagen aquí
      });

      // Configura la URL de la imagen en el estado
      setImage(response.data[0].url);
    } catch (e) {
      console.error(e);
      setError("Error generating image.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <h1>Image Generator</h1>
      <div>
        <input
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt..."
          type="text"
        />
        <button onClick={fetchData}>Generate</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      <div>
        {isLoading ? (
          <>
            <p>Loading</p>
            <p>Please wait until your image is ready...</p>
          </>
        ) : (
          image && <img src={image} alt="Generated" />
        )}
      </div>
    </div>
  );
}

export default App;
