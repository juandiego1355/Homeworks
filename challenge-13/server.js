
require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const publicDirectory = path.join(__dirname, "public");

app.use(express.static(publicDirectory));

app.get("/api/gifs/search", async (req, res) => {
  const query = typeof req.query.q === "string"
    ? req.query.q.trim()
    : "";

  if (!query) {
    return res.status(400).json({
      error: "Escribe algo para buscar."
    });
  }

  if (query.length > 50) {
    return res.status(400).json({
      error: "La búsqueda no puede superar los 50 caracteres."
    });
  }

  const apiKey = process.env.GIPHY_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "No se encontró la API Key de GIPHY."
    });
  }

  try {
    const params = new URLSearchParams({
      api_key: apiKey,
      q: query,
      limit: "12",
      rating: "g",
      lang: "es"
    });

    const url = `https://api.giphy.com/v1/gifs/search?${params}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error("Error de GIPHY:", data.meta);
      return res.status(response.status).json({
        error: "GIPHY no pudo completar la búsqueda."
      });
    }

    const gifs = data.data.map((gif) => ({
      id: gif.id,
      title: gif.title || "GIF sin título",
      url: gif.images.fixed_height.url,
      originalUrl: gif.images.original.url
    }));

    return res.json({
      query,
      gifs,
      source: "giphy"
    });

  } catch (error) {
    console.error("Error al consultar GIPHY:", error);

    return res.status(500).json({
      error: "No fue posible conectar con GIPHY."
    });
  }
});

app.use("/api", (req, res) => {
  res.status(404).json({
    error: "No se encontró esa ruta de la API."
  });
});

app.listen(PORT, () => {
  console.log(`GIF Finder disponible en http://localhost:${PORT}`);
});
