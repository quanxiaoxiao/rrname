const yargs = require('yargs');
const fs = require('fs');
const { resolve, join } = require('path');
const renameScene = require('./renameScene');
const renameComponent = require('./renameComponent');
const renameContainer = require('./renameContainer');
const pkg = require('../package.json');

const {
  argv: {
    _: [oldName, newName],
    type,
    scene,
  },
} = yargs
  .option('type', {
    alias: 't',
    default: 'component',
    choices: ['component', 'scene'],
    description: 'change a type',
  })
  .option('scene', {
    alias: 's',
    description: 'scene name, component in scene',
  })
  .version(pkg.version);

if (!oldName || !newName) {
  process.exit(1);
}

if (type === 'component') {
  const baseDir = scene
    ? resolve(process.cwd(), 'src', 'scenes', scene, 'components')
    : resolve(process.cwd(), 'src', 'components');
  renameComponent(oldName, newName, baseDir);
  if (fs.existsSync(join(baseDir, '..', 'containers'))
  && fs.existsSync(join(baseDir, '..', 'containers', oldName))) {
    renameContainer(oldName, newName, join(baseDir, '..', 'containers'));
  }
} else if (type === 'scene') {
  renameScene(oldName, newName);
}
