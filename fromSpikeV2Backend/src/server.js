const express = require('express');
const path = require('path');
const fs = require('fs');

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

// Backward-compat stub
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

// New parametric config endpoint
app.get('/api/config/:formType/:configName', (req, res) => {
  const { formType, configName } = req.params;

  // Try loading from configs folder first
  const safe = (s) => String(s || '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '');
  const formTypeSafe = safe(formType);
  const configSafe = safe(configName);
  const configPath = path.join(__dirname, '..', 'configs', formTypeSafe, `${configSafe}.js`);

  try {
    if (fs.existsSync(configPath)) {
      // Clear require cache to allow live edits during dev
      delete require.cache[require.resolve(configPath)];
      const fileConfig = require(configPath);
      return res.json(fileConfig);
    }
  } catch (e) {
    return res.status(500).json({ error: 'Failed to load config', details: e instanceof Error ? e.message : String(e) });
  }

  // Not found: no file-based config exists and fallback is disabled per requirements
  return res.status(404).json({ error: 'Config not found', formType: formTypeSafe, config: configSafe });
});

// Submit route with controller dispatch
const controllers = {
  tanstack: require('./controllers/tanstackController'),
};

app.post('/api/submit/:formType', (req, res) => {
  const formType = String(req.params.formType || '').toLowerCase();
  const controller = controllers[formType];
  if (!controller || typeof controller.submit !== 'function') {
    return res.status(404).json({ error: 'Submit handler not found for formType', formType });
  }
  return controller.submit(req, res);
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
