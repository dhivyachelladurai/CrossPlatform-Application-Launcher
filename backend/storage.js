const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'apps.json');

module.exports = {
  read() {
    try {
      return JSON.parse(fs.readFileSync(file, 'utf8')) || [];
    } catch (e) {
      return [];
    }
  },
  write(data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  }
};