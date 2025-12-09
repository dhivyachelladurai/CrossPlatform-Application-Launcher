const { spawn, exec } = require('child_process');

module.exports = {
  launch(exePath, args = '') {
    // naive args split that keeps quoted pieces together
    const argsArray = args ? args.match(/(?:".*?"|[^\s]+)+/g).map(s => s.replace(/^"|"$/g, '')) : [];
    
    try {
      const child = spawn(exePath, argsArray, {
        detached: true,
        stdio: 'ignore'
      });
      child.unref();
      return child.pid;
    } catch (e) {
      // Fallback: use Windows start command (may not return pid)
      try {
        const cmd = `start "" "${exePath}" ${args}`;
        exec(cmd);
        return null;
      } catch (err) {
        return null;
      }
    }
  },
  kill(pid) {
    if (!pid) return;
    try {
      exec(`taskkill /PID ${pid} /T /F`, (err, stdout, stderr) => {
        // ignore result
      });
    } catch (e) {
      // ignore
    }
  }
};