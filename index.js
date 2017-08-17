const nodePath = require('path');
const resolve = require('resolve');
const nmExp = /node_modules\//;

function isPackageName(str){
  const c = str[0];
  return c !== '/' && c !== '.';
}

function isCurrentInOrg() {
  const cwd = process.cwd();
  try {
    const pkg = resolve.sync(cwd + '/package.json');
    return pkg.name[0] === '@';
  } catch (err) {
    return false;
  }
}

function webify(path, state) {
  const opts = state.opts || {};
  const strategy = opts.packageResolutionStrategy || '';
  const isOrg = opts.isOrganization || isCurrentInOrg();

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

  if(isPackageName(specifier) && strategy === 'npm') {
    const dots = res.substr(0, 2);
    if(dots === '..') {
      res = '../' + res;
    } else {
      res = '.' + res;
    }
    if(isOrg) {
      res = '../' + res;
    }
    res = res.replace(nmExp, '');
  }

  path.node.source.value = res;
}

module.exports = {
  visitor: {
    ImportDeclaration: webify,
    ExportAllDeclaration: webify
  }
};
