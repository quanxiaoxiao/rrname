const fs = require('fs');
const path = require('path');

const getFileList = (filePath) => {
  const stat = fs.statSync(filePath);
  let fileList = [];
  if (stat.isDirectory()) {
    const list = fs.readdirSync(filePath);
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      fileList = [...fileList, ...getFileList(path.join(filePath, item))];
    }
  } else if (!/\.swp$/.test(filePath) && /\.(js|css)$/.test(filePath)) {
    fileList = [...fileList, filePath];
  }
  return fileList;
};

module.exports = getFileList;
