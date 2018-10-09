const path = require('path');
const fs = require('fs');
const getFileList = require('./getFileList');
const fileRewrite = require('./fileRewrite');
const checkDirExist = require('./checkDirExist');

const baseDir = path.resolve(process.cwd(), 'src', 'scenes');

const renameScene = (oldName, newName) => {
  checkDirExist(path.join(baseDir, oldName));
  fs.renameSync(path.join(baseDir, oldName), path.join(baseDir, newName));

  const sceneIndexPathName = path.join(baseDir, newName, 'index.js');

  fileRewrite(sceneIndexPathName, body => body
    .replace(new RegExp(`^(const )${oldName}`, 'm'), `$1${newName}`)
    .replace(new RegExp(`^(export default )${oldName}`, 'm'), `$1${newName}`));


  getFileList(path.join(baseDir, newName))
    .filter(pathname => /actions.js$/.test(pathname) || /\/containers\//.test(pathname))
    .forEach((pathname) => {
      fileRewrite(pathname, body => body.replace(new RegExp(`\\b${oldName}\\b`, 'mg'), newName));
    });

  const viewIndexPathName = path.join(baseDir, 'View', 'index.js');
  fileRewrite(viewIndexPathName, body => body
    .replace(new RegExp(`^(import )${oldName}( from '../)${oldName}`, 'm'),
      `$1${newName}$2${newName}`)
    .replace(new RegExp(`component={${oldName}}`, 'm'), `component={${newName}}`));

  const rootReducerPathName = path.join(baseDir, '..', 'data', 'reducer.js');
  fileRewrite(rootReducerPathName, body => body
    .replace(
      new RegExp(`^import.+scenes\\/${oldName}\\/`, 'm'),
      `import ${newName.replace(/^[A-Z]/, a => a.toLowerCase())}Reducer from 'scenes/${newName}/`,
    )
    .replace(
      new RegExp(`\\b${oldName}:[^,]+,`, 'm'),
      `${newName}: ${newName.replace(/^[A-Z]/, a => a.toLowerCase())}Reducer,`,
    ));
};

module.exports = renameScene;
