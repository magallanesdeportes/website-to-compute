const express = require('express');
const icy = require('icy');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
const RADIO_STREAM = 'https://stream.zeno.fm/616ax0ypt5quv';

app.get('/', (req, res) => res.send('API Radio 12 PM funcionando'));

app.get('/nowplaying', (req, res) => {
  icy.get(RADIO_STREAM, (stream) => {
    stream.on('metadata', (metadata) => {
      const parsed = icy.parse(metadata);
      res.json({ title: parsed.StreamTitle || 'Desconocido' });
      stream.destroy();
    });
  }).on('error', () => res.json({ title: 'Error obteniendo canción' }));
});

app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
