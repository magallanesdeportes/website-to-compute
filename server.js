import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

// URL de tu stream
const STREAM_URL = 'https://stream.zeno.fm/616ax0ypt5quv';

app.get('/nowplaying', async (req, res) => {
  try {
    const response = await fetch(STREAM_URL, { headers: { 'Icy-MetaData': '1' } });
    const icyMetaInt = parseInt(response.headers.get('icy-metaint'), 10);

    if (!icyMetaInt) return res.json({ title: 'No se pudo obtener metadatos' });

    const reader = response.body.getReader();
    const { value } = await reader.read();

    if (!value) return res.json({ title: 'Sin datos del stream' });

    const metadataOffset = icyMetaInt;
    const metadataLength = value[metadataOffset] * 16;
    const metadata = Buffer.from(value.slice(metadataOffset + 1, metadataOffset + 1 + metadataLength)).toString();

    const match = /StreamTitle='([^']*)'/.exec(metadata);
    const title = match && match[1] ? match[1] : 'desconocido';

    res.json({ title });
  } catch (error) {
    res.json({ title: 'Error obteniendo canción' });
  }
});

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
