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
# math.ts  <-- this is a module because it exports
export function add(a: number, b: number) {
  return a + b;
}

# app.ts
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
# file1.ts

export class Circle {
  constructor(public radius: number) {}
}

export class Square {
  constructor(public width: number) {}
}
```

In Index File:

```ts
# index.ts
import { Circle, Square } from "./file1";
import { Circle as MyCircle, Square } from "./file1";
```

## Module formats

JavaScript has several module formats and historical patterns:

- AMD
- UMD
- CommonJS
- ES2015 / ES6 (ESM)

### AMD

browser loaders like RequireJS

```ts
# math.amd.js
define([], function () {
  function add(a, b) {
    return a + b;
  }
  return { add };
});

# main.amd.js
require(["./math.amd"], function (math) {
  console.log(math.add(1, 2));
});
```

### UMD

UMD is a pattern, not a language standard: it detects AMD vs CommonJS vs “global” and exports accordingly.

```ts
# math.amd.js
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory); # AMD
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory(); # CommonJS / Node
  } else {
    root.math = factory(); # Global (browser)
  }
})(typeof self !== "undefined" ? self : this, function () {
  function add(a, b) {
    return a + b;
  }
  return { add };
});
```

Usage:

- In AMD: `require(['./math.umd'], (m) => m.add(1, 2))`
- In Node: `const math = require('./math.umd');`
- In a browser global: `<script src="math.umd.js"></script>` then access `window.math`

### CommonJS

classic Node.js (require, module.exports)

```ts
# math.js
function add(a, b) {
  return a + b;
}
module.exports = { add };

# main.js

const math = require("./math.cjs");
console.log(math.add(1, 2));
```

### ES2015 / ES6 Modules (ESM)

modern standard (import / export)

```ts
# math.js
export function add(a, b) {
  return a + b;
}

# main.js
import { add } from "./math.mjs";
console.log(add(1, 2));
```

ES modules use export and import and are statically analyzable

> [!NOTE]
> Set the module format via `compilerOptions.module` in `tsconfig.json` (examples: `"es6"`, `"es2022"`, or `"esnext"`).

## Default Exports

```ts
# math.ts
export default class User {}

export class Other1 {}

class Other2 {}

# main.ts
import User, { Other1 } from "./math";
```

## Wildcard imports

You can import an entire module namespace (all its exports) into a single object.

### Namespace import (`import * as X from "…"`)

This is the closest thing TypeScript has to a “wildcard import”.

```ts
import * as math from "./math";

math.add(1, 2);
math.mul(2, 3);
```

What you get is the module’s namespace object (basically “all exports as properties”).
Dynamic import() returns the same kind of namespace object.

When it’s a good idea

- You truly want “the whole module as an API surface” (plugin registries, polyfills, utilities).
- You’re dealing with CommonJS interop edge-cases and need the namespace form.

> [!CAUTION]
> In many cases this makes dependencies less explicit and can hurt tree-shaking, because you import the entire namespace even if you only use a single export.

### Re-export wildcard (`export * from "…"`) a.k.a. barrel files

This is not an import into the current file’s scope — it’s “re-export everything from another module”.

```ts
# index.ts
export * from "./math";
export * from "./strings";
```

> [!CAUTION]
> Downside: can create dependency hairballs and circular deps if overused (especially in large Nx monorepos).

### Real filesystem globs (“import everything in this folder”)

TypeScript/ESM does not support import "./dir/\*.ts" by itself.

> [!NOTE]
> If you see this, it’s a bundler feature, e.g. Vite’s import.meta.glob:
>
> ```ts
> const modules = import.meta.glob("./plugins/*.ts");
> ```

## Re-exporting

When a module grows, a common pattern is to split exports into separate files and re-export them from a single barrel file (for example, `index.ts`) to simplify imports elsewhere.

Example — many classes in one file (not ideal):

```ts
export class C1 {}
export class C2 {}
export class C3 {}
export class C4 {}
```

Refactor into separate files:

```ts
# C/C1.ts
export class C1 {}

# C/C2.ts
export class C2 {}

# C/C3.ts
export class C3 {}

# C/C4.ts
export class C4 {}
```

Create a barrel (`C/index.ts`) to re-export the pieces:

```ts
export { C1 } from "./C1";
export { C2 } from "./C2";
export { C3 } from "./C3";
export { C4 } from "./C4";
```

Then import elsewhere using:

```ts
import { C1, C2 } from "./C";
```

Note: to enable certain resolution strategies or path mapping you may need to configure `tsconfig.json` (for example, setting `moduleResolution: "node"` or adding `paths` mappings). Use these options only when required by your build/tooling.

[Barrels vs Type Aliases in Typesript](./barrels-vs-path-aliases-in-typescript.md)

Next Section: [Integration Typescript with javascript](./../7-integration-typescript-with-javascript/integration-typescript-with-javascript.md)
