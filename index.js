const nodePath = require('path');
const resolve = require('resolve');

function isBare(str){
  const c = str[0];
  return c !== '/' && c !== '.';
}

function webify(path, state) {
  const strategy = state.opts ? 
    state.opts.packageResolutionStrategy : '';

  const specifier = path.node.source.value;
  const filename = this.file.opts.filename;
  const base = nodePath.dirname(
    nodePath.join(process.cwd(), filename)
  );

  const pth = resolve.sync(specifier, {
    basedir: base
  });
  const rel = nodePath.relative(base, pth);
  let res = rel[0] === '.' ? rel : `./${rel}`;

  if(isBare(specifier) && strategy === 'npm') {
    const dots = res.substr(0, 2);
    if(dots === '..') {
      res = '../' + res;
    } else {
      res = '.' + res;
    }
  }

  path.node.source.value = res;
}

module.exports = {
  visitor: {
    ImportDeclaration: webify,
    ExportAllDeclaration: webify
  }
};
