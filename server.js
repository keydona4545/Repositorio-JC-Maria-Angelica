const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// 1. REEMPLAZA ESTOS DOS VALORES CON TUS LLAVES DE SUPABASE:
const SUPABASE_URL = 'AQUÍ_PEGA_TU_PROJECT_URL';
const SUPABASE_KEY = 'AQUÍ_PEGA_TU_ANON_KEY';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. NOMBRE DE TU TABLA (Si en Supabase la llamaste 'menu' o 'productos'):
const TABLA = 'menu'; 

// --- RUTAS DE LA API ---

// GET: Consultar los postres para enviarlos a la página web
app.get('/api/productos', async (req, res) => {
  const { data, error } = await supabase.from(TABLA).select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST: Recibir un postre nuevo desde el panel admin y guardarlo en Supabase
app.post('/api/productos', async (req, res) => {
  const { nombre, categoria, precio, desc } = req.body;
  const { data, error } = await supabase.from(TABLA).insert([{ nombre, categoria, precio, desc }]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// DELETE: Eliminar un postre por su ID
app.delete('/api/productos/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from(TABLA).delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ mensaje: 'Producto eliminado con éxito' });
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
