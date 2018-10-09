const fs = require('fs');

const checkDirExist = (dirPath) => {
  const stat = fs.statSync(dirPath);
  if (!stat.isDirectory()) {
    process.exit(1);
  }
};

module.exports = checkDirExist;
