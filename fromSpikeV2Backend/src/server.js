const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;

// Minimal CORS to allow Vite dev server (and others)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Temporary stub endpoint; we'll wire to real config later
app.get('/api/config', (req, res) => {
  res.json({
    version: 1,
    form: {
      title: 'Demo Form (Stub)',
      fields: [
        { name: 'firstName', label: 'First Name', type: 'text', required: false },
        { name: 'email', label: 'Email', type: 'email', required: false }
      ]
    }
  });
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});

