# Modules In TypeScript

- What? Why? Where?
- Creating and using modules
- Module formats
- Default exports
- Wildcard imports
- Re-exporting

## What? Why? Where?

TypeScript “modules” are just JavaScript ES modules plus TypeScript’s type system layered on top. The core idea: a file becomes a module if it has a top-level import or export; otherwise it’s treated like a global “script” file.

### What?

- A module is a file with `import / export`. Its declarations are scoped to that file unless exported.
- There are also older “internal modules” in TS history (`namespace / module keyword`), but in modern TS/Angular you almost always mean ES modules.

### Why?

Modules exist to make code:

- Composable: explicit dependencies (import) and explicit API surface (export).
- Statically analyzable: tooling/bundlers can analyze imports at build time (tree-shaking, refactoring, type-checking).
- Non-global by default: avoids accidental name collisions and spooky action at a distance.

### Where?

Think in three layers (this clears up 90% of “module” confusion):

- In code

```ts
// math.ts  <-- this is a module because it exports
export function add(a: number, b: number) {
  return a + b;
}

// app.ts
import { add } from "./math";
console.log(add(1, 2));
```

A file with no top-level `import/export` is a “script” and leaks declarations into the global scope. [Docs](https://www.typescriptlang.org/docs/handbook/2/modules.html?utm_source=chatgpt.com)

- In tsconfig.json (how TS emits JS):

  - "compilerOptions.module" controls what module format TS outputs (ESM vs CommonJS vs preserve for bundlers).
  - "compilerOptions.moduleResolution" controls how TS finds imports on disk (node, nodenext, bundler, etc.).

- In the Runtime (how Node/browser interprets .js)
  - In Node.js, `package.json "type": "module"` makes Node treat .js files as ES modules (otherwise CommonJS by default).

More explanation:

```text
https://www.typescriptlang.org/docs/handbook/2/modules.html
https://www.typescriptlang.org/tsconfig/module
https://www.typescriptlang.org/tsconfig/moduleResolution.html
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
https://nodejs.org/api/esm.html
https://nodejs.org/api/packages.html
```

## Creating and using modules

```ts
// file1.ts

export class Circle {
  constructor(public radius: number) {}
}

export class Square {
  constructor(public width: number) {}
}
```

In Index File:

```ts
// index.ts
import { Circle, Square } from "./file1";
import { Circle as MyCircle, Square } from "./file1";
```

## Module formats

Javascript has a lot of ways for supporting Module formats:

- AMD
- UMD
- CommonJS
- Es2015/ ES6

### AMD

browser loaders like RequireJS

```ts
// math.amd.js
define([], function () {
  function add(a, b) {
    return a + b;
  }
  return { add };
});

// main.amd.js
require(["./math.amd"], function (math) {
  console.log(math.add(1, 2));
});
```

### UMD

UMD is a pattern, not a language standard: it detects AMD vs CommonJS vs “global” and exports accordingly.

```ts
// math.amd.js
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory); // AMD
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory(); // CommonJS / Node
  } else {
    root.math = factory(); // Global (browser)
  }
})(typeof self !== "undefined" ? self : this, function () {
  function add(a, b) {
    return a + b;
  }
  return { add };
});
```

Usage:

- In AMD: `require(['./math.umd'], m => m.add(1,2))`
- In Node: `const math = require('./math.umd');`
- In browser global: `<script src="math.umd.js"></script>` then ...

### CommonJS

classic Node.js (require, module.exports)

```ts
// math.js
function add(a, b) {
  return a + b;
}
module.exports = { add };

// main.js

const math = require("./math.cjs");
console.log(math.add(1, 2));
```

### ES2015 / ES6 Modules (ESM)

modern standard (import / export)

```ts
// math.js
export function add(a, b) {
  return a + b;
}

// main.js
import { add } from "./math.mjs";
console.log(add(1, 2));
```

ES modules use export and import and are statically analyzable

> [!NOTE]  
> We can set the Module format in ts.config module config.
> Best item is `module: "es6"`

## Default Exports

```ts
// math.ts
export default class User{}

export class Other1

class Other2

// main.ts

import User, {Other1} from './math';

```
