import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;
const ZENO_API = 'https://api.zeno.fm/mounts/metadata/616ax0ypt5quv';

app.get('/nowplaying', async (req, res) => {
  try {
    const response = await fetch(ZENO_API);
    const json = await response.json();

    // Intentar extraer título de la canción
    const title = json?.now_playing?.song?.title?.trim() || 'Radio 12 PM - Punta Arenas 🎶';

    res.json({ title });
  } catch (error) {
    res.json({ title: 'Radio 12 PM - Punta Arenas 🎶' });
  }
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
