const fs = require('fs');
const path = require('path');
const testFolder = path.dirname(require.main.filename)


fs.readdirSync(testFolder).forEach(file => {
  console.log(file);
});