const fs = require('fs');
const path = require('path');
const fileRewrite = require('./fileRewrite');

const renameComponent = (oldName, newName, baseDir) => {
  fs.renameSync(path.join(baseDir, oldName), path.join(baseDir, newName));
  fs.renameSync(path.join(baseDir, newName, `${oldName}.js`), path.join(baseDir, newName, `${newName}.js`));
  fileRewrite(path.join(baseDir, newName, 'index.js'), body => body.replace(new RegExp(`\\b${oldName}\\b`, 'g'), newName));
};

module.exports = renameComponent;
