const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const SUPABASE_URL = 'https://skrpkxvptqnkuewjpdrx.supabase.co';
const SUPABASE_KEY = 'sb_publishable_nIXcOirLK8OHAor6JA-wEQ_RBLFKKYk';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const TABLA = 'menu';

app.get('/api/productos', async (req, res) => {
  const { data, error } = await supabase.from(TABLA).select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/productos', async (req, res) => {
  const { nombre, categoria, precio, desc } = req.body;
  const { data, error } = await supabase.from(TABLA).insert([{ nombre, categoria, precio, desc }]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

app.delete('/api/productos/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from(TABLA).delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ mensaje: 'Producto eliminado con éxito' });
});

app.post('/api/pedidos', async (req, res) => {
  const { nombre, email, mensaje } = req.body;
  const { data, error } = await supabase.from('pedidos').insert([{ nombre, email, mensaje }]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
