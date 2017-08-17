const assert = require('assert');
const babel = require('babel-core');
const webify = require('../index.js');

const testCases = [
  {
    before: "import foo from './test/tests/proj1/foo'",
    after: "import foo from './test/tests/proj1/foo.js';",
  },
  {
    before: "import foo from 'example'",
    after: "import foo from './node_modules/example/github.js';",
    after2: "import foo from '../example/github.js';",
    after3: "import foo from '../../example/github.js';"
  }
]

// Default options
testCases.forEach(testCase => {
  const result = babel.transform(testCase.before, {
    plugins: [ webify ]
  });

  assert.equal(result.code, testCase.after);
});

// npm package resolution strategy
testCases.filter(testCase => testCase.after2)
.forEach(testCase => {
  const result = babel.transform(testCase.before, {
    plugins: [ [webify, {
      packageResolutionStrategy: 'npm'
    }] ]
  });

  assert.equal(result.code, testCase.after2);
});

// npm package resolution strategy in an org
testCases.filter(testCase => testCase.after3)
.forEach(testCase => {
  const result = babel.transform(testCase.before, {
    plugins: [ [webify, {
      packageResolutionStrategy: 'npm',
      isOrganization: true
    }] ]
  });

  assert.equal(result.code, testCase.after3);
});
