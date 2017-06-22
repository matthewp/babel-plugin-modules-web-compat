# babel-plugin-modules-web-compat

A Babel plugin that rewrites module specifiers to be web compatible.

For example, this code:

```js
import { Component } from 'preact';
import * as util from './util';
```

Will be transformed into:

```js
import { Component } from './node_modules/preact/dist/preact.js';
import * as util from './util/index.js';
```

Making it possible to load in browsers that support `<script type="module">`.

## Install

```
yarn add babel-plugin-modules-web-compat --dev
```

## Usage

In your `.babelrc` add:

```json
{
  "plugins": [
    "modules-web-compat"
  ]
}
```

To prepare your modules for distribution to npm, it will need to resolve npm dependencies to the parent folder. Use `packageResolutionStrategy` to turn on this behavior:

```json
{
  "plugins": [
    ["modules-web-compat", {
      "packageResolutionStrategy": "npm"
    }]
  ]
}
```

Which will add an addition `../` to your npm dependency specifiers.

## License

BSD 2 Clause
