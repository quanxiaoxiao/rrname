const fs = require('fs');

const fileRewrite = (pathname, handler) => {
  const body = fs.readFileSync(pathname, 'utf-8');
  fs.writeFileSync(pathname, handler(body));
};

module.exports = fileRewrite;
