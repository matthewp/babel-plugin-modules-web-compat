const assert = require('assert');
const babel = require('babel-core');
const webify = require('../index.js');

const testCases = [
  {
    before: "import foo from './test/tests/proj1/foo'",
    after: "import foo from './test/tests/proj1/foo.js';"
  },
  {
    before: "import foo from 'example'",
    after: "import foo from './node_modules/example/github.js';"
  }
]

testCases.forEach(testCase => {
  const result = babel.transform(testCase.before, {
    plugins: [ webify ]
  });

  assert.equal(result.code, testCase.after);
});