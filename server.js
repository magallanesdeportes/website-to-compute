import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;
const STREAM_URL = 'https://stream.zeno.fm/616ax0ypt5quv';
const ZENO_PUBLIC_URL = 'https://zeno.fm/player/radio-12-pm-punta-arenas-chile/';

// Función para intentar obtener metadatos ICY
async function getIcyMetadata() {
  try {
    const response = await fetch(STREAM_URL, { headers: { 'Icy-MetaData': '1' } });
    const icyMetaInt = parseInt(response.headers.get('icy-metaint'), 10);

    if (!icyMetaInt) return null;

    const reader = response.body.getReader();
    const { value } = await reader.read();

    if (!value) return null;

    const metadataOffset = icyMetaInt;
    const metadataLength = value[metadataOffset] * 16;
    const metadata = Buffer.from(value.slice(metadataOffset + 1, metadataOffset + 1 + metadataLength)).toString();
    const match = /StreamTitle='([^']*)'/.exec(metadata);

    return match && match[1] ? match[1] : null;
  } catch {
    return null;
  }
}

// Función para intentar obtener datos desde la página pública de Zeno
async function getZenoPageMetadata() {
  try {
    const html = await fetch(ZENO_PUBLIC_URL).then(r => r.text());
    const match = html.match(/<title>(.*?)<\/title>/i);
    if (match && match[1]) {
      return match[1].replace(' - Zeno.FM', '').trim();
    }
    return null;
  } catch {
    return null;
  }
}

app.get('/nowplaying', async (req, res) => {
  let title = await getIcyMetadata();

  // Si ICY falla, intentar extraer del HTML público de Zeno
  if (!title) {
    title = await getZenoPageMetadata();
  }

  // Si todo falla, usar fallback
  if (!title || title.toLowerCase() === 'desconocido') {
    title = 'Radio 12 PM - Punta Arenas 🎶';
  }

  res.json({ title });
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
