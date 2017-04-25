const nodePath = require('path');
const resolve = require('resolve');

function webify(path) {
  const specifier = path.node.source.value;
  const filename = this.file.opts.filename;
  const base = nodePath.dirname(
    nodePath.join(process.cwd(), filename)
  );

  const pth = resolve.sync(specifier, {
    basedir: base
  });
  const rel = nodePath.relative(base, pth);
  const res = rel[0] === '.' ? rel : `./${rel}`;

  path.node.source.value = res;
}

module.exports = {
  visitor: {
    ImportDeclaration: webify,
    ExportAllDeclaration: webify
  }
};