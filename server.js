const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
// Usa el ID real de tu estación en Zeno.fm (de tu URL)
const ZENO_MOUNT_ID = 'radio-12-pm-punta-arenas-chile';

app.get('/', (req, res) => res.send('API Radio 12 PM funcionando (modo API Zeno)'));

app.get('/nowplaying', async (req, res) => {
  try {
    const apiUrl = `https://zeno.fm/api/stations/${ZENO_MOUNT_ID}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    let titulo = data?.now_playing?.song || 'Desconocido';
    res.json({ title: titulo });
  } catch (err) {
    res.json({ title: 'Error obteniendo canción' });
  }
});

app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
