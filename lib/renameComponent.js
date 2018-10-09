const path = require('path');
const fs = require('fs');
const checkDirExist = require('./checkDirExist');
const getFileList = require('./getFileList');
const fileRewrite = require('./fileRewrite');

const renameComponent = (oldName, newName, baseDir) => {
  checkDirExist(path.join(baseDir, oldName));
  fs.renameSync(path.join(baseDir, oldName), path.join(baseDir, newName));
  getFileList(path.join(baseDir, newName))
    .filter(pathname => new RegExp(`(${oldName}|index)\\.(js|css)$`).test(pathname))
    .forEach((pathname) => {
      if (/\.css$/.test(pathname)) {
        fs.renameSync(pathname, path.join(baseDir, newName, `${newName}.css`));
        return;
      }
      if (!/index\.js$/.test(pathname)) {
        fs.renameSync(pathname, path.resolve(pathname, '..', `${newName}.js`));
        pathname = path.resolve(pathname, '..', `${newName}.js`); // eslint-disable-line
      }
      fileRewrite(pathname, body => body.replace(new RegExp(`\\b${oldName}\\b`, 'g'), newName));
    });

  getFileList(path.join(baseDir))
    .filter(pathname => !new RegExp(`\\/${newName}\\/`).test(pathname)
      && /\.js$/.test(pathname)
      && !/index\.js$/.test(pathname))
    .forEach((pathname) => {
      fileRewrite(pathname, (body) => {
        if (/\/scenes\//.test(pathname)) {
          if (new RegExp(`^import[^']+'\\.\\.\\/${oldName}\\b`, 'm').test(body)) {
            return body.replace(new RegExp(`\\b${oldName}\\b`, 'g'), newName);
          }
        } else if (!new RegExp(`from '\\.\\/${oldName}\\b`, 'm').test(body)) {
          return body.replace(new RegExp(`\\b${oldName}\\b`, 'g'), newName);
        }
        return body;
      });
    });

  if (!/\/scenes\//.test(baseDir) && fs.existsSync(path.join(baseDir, '..', 'scenes'))) {
    getFileList(path.join(baseDir, '..', 'scenes'))
      .filter(pathname => /\.js$/.test(pathname))
      .forEach((pathname) => {
        fileRewrite(pathname, (body) => {
          if (new RegExp(`^import[^']+'components\\/${oldName}\\b`, 'm').test(body)) {
            return body.replace(new RegExp(`\\b${oldName}\\b`, 'g'), newName);
          }
          return body;
        });
      });
  }
  if (fs.existsSync(path.join(baseDir, '..', 'containers'))) {
    getFileList(path.join(baseDir, '..', 'containers'))
      .filter(pathname => !/index\.js$/.test(pathname))
      .forEach((pathname) => {
        fileRewrite(pathname, (body) => {
          if (new RegExp(`^import[^']+'(\\.\\.\\/){2}components\\/${oldName}\\b`, 'm').test(body)) {
            return body.replace(new RegExp(`\\b${oldName}\\b`, 'g'), newName);
          }
          return body;
        });
      });
  }
};

module.exports = renameComponent;
