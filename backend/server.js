const express = require('express');
const cors = require('cors');
const path = require('path');
const uniqid = require('uniqid');
//const { NodePowerShell } = require('node-powershell');
//const NodePowerShell = require('node-powershell').PowerShell;
const NodePowerShell = require('node-powershell');
const storage = require('./storage');
const pm = require('./processManager');

const app = express();
const PORT = 2354;

app.use(cors());
app.use(express.json());

// Serve frontend build
app.use('/', express.static(path.join(__dirname, '..', 'frontend', 'build')));

// GET apps
app.get('/api/apps', (req, res) => {
  res.json(storage.read());
});

// Add app - opens native file picker on server machine
app.post('/api/apps/add', async (req, res) => {
  try {
    const ps = new NodePowerShell({
      executionPolicy: 'Bypass',
      noProfile: true
    });
    
    const scriptPath = path.join(__dirname, 'fileDialogHelper.ps1');
    //await ps.addCommand(`powershell -ExecutionPolicy Bypass -File "${scriptPath}"`);
    await ps.addCommand(`& "${scriptPath}"`);
    
    const result = await ps.invoke();
    ps.dispose();
    
    const exePath = (result || '').trim();
    if (!exePath) return res.status(400).json({ msg: 'No file selected' });

    const apps = storage.read();
    const newApp = {
      id: uniqid(),
      name: req.body.name || path.basename(exePath),
      exePath,
      args: req.body.args || ''
    };
    
    apps.push(newApp);
    storage.write(apps);
    res.json(newApp);

  } catch (e) {
    console.error('Add app error', e);
    res.status(500).json({ msg: 'error' });
  }
});

// Delete app
app.delete('/api/apps/:id', (req, res) => {
  let apps = storage.read();
  apps = apps.filter(a => a.id !== req.params.id);
  storage.write(apps);
  res.json({ status: 'deleted' });
});

// Update app
app.put('/api/apps/:id', (req, res) => {
  const apps = storage.read();
  const idx = apps.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ msg: 'not found' });
  
  apps[idx] = { ...apps[idx], ...req.body };
  storage.write(apps);
  res.json(apps[idx]);
});

// Launch
app.post('/api/launch', (req, res) => {
  const { id } = req.body;
  const apps = storage.read();
  const a = apps.find(x => x.id === id);
  if (!a) return res.status(404).json({ msg: 'app not found' });
  
  const pid = pm.launch(a.exePath, a.args);
  res.json({ status: 'ok', pid, name: a.name });
});

// Quit
app.post('/api/quit', (req, res) => {
  const { pid } = req.body;
  pm.kill(pid);
  res.json({ status: 'killed' });
});

// Settings - allow only local to open native file dialog
app.use('/settings', (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  if (ip === '::1' || ip === '127.0.0.1' || ip === '::ffff:127.0.0.1') return next();
  return res.status(403).send('Settings available only on server machine');
});

// Serve frontend index for any other route
app.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Launcher running on http://<your-ip>:${PORT}`);
});