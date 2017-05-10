const nodePath = require('path');
const regexIsCompat = /\.js$/;
const regexIsRelative = /^\./;

function webify(path) {
  const { source } = path.node;
  const { value } = source;
  const isRelative = regexIsRelative.test(value);

  // If it's module compatible, we simply let it pass through.
  if (regexIsCompat.test(value)) {
    return;
  }

  const { filename } = this.file.opts;
  const dir = nodePath.dirname(filename);

  // If the module is specified as a relative path, we resolve it relative to
  // the current module, otherwise we just pass it through. Otherwise, the name
  // is just passed through. This assumes no absolute paths will be used.
  const mod = isRelative ? nodePath.resolve(dir, value) : value;

  // We then resolve the module using the standard method. The node-resolve
  // package didn't seem to work and would always error out. No idea why, but
  // it just kept saying it couldn't resolve the module relative to the path.
  // I tried everything, even specifying odd values for options, but in the end
  // it turns out that it's almost just as much code to do it with the standard
  // Node API.
  const pth = require.resolve(mod);

  // We now have to transform it back to a relative path.
  const rel = nodePath.relative(dir, pth);

  // Modules that were originally specified as relative paths end up having the
  // relative specifier knocked off of them. This is okay for web-only modules,
  // but it could confuse bundlers if they use the ES source, so we make it
  // work for both by prepending "./".
  //
  // Non-relative paths are considered paths to external libs. We implicitly
  // require that these external libs have the same path, relative to the
  // current module as a sibling.
  source.value = isRelative ? `./${rel}` : `../${rel}`;
}

module.exports = {
  visitor: {
    ImportDeclaration: webify,
    ExportAllDeclaration: webify
  }
};