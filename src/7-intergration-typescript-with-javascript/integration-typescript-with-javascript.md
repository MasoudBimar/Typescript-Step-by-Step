# Integration: TypeScript with JavaScript

- What, why and when to mix JS with TS
- Including JavaScript code in a TypeScript project
- Type-checking JavaScript: `checkJs` and JSDoc
- Declaration files (`.d.ts`) and `@types` packages

## What and Why

Mixing plain JavaScript into a TypeScript project is common: many libraries, legacy files, or third-party snippets are still written in JS. TypeScript provides gradual typing so you can adopt it incrementally. The challenge is that TypeScript's benefits come from known types, while JavaScript often lacks explicit type information.

### Common challenges

- Missing or incorrect type information
  - JavaScript has no enforced types, so intent can be ambiguous.
  - `any` leaks or an abundance of handwritten `.d.ts` files can erode type safety at the boundary.
- Module system mismatch (ESM vs CommonJS)
  - `module.exports`/`require` vs `import`/`export` can require interop flags or runtime adjustments.
  - Compiler flags like `esModuleInterop` and `allowSyntheticDefaultImports` affect compiled output and imports.
- Runtime differences and unsafe behaviors
  - Mutation, inconsistent return shapes, or conditional returns can compile but crash at runtime; runtime guards are often needed (e.g. `zod`, `io-ts`, or manual checks).
- Dynamic patterns vs static analysis
  - `this`-based patterns, prototype mutation, or dynamic property access (`obj[key]`) make static typing harder and may force `unknown`/`any` and defensive checks.
- Tooling complexity
  - Mixing compilers/bundlers (tsc, Babel, Webpack, Vite, esbuild) and legacy JS sometimes requires careful configuration for sourcemaps, tree-shaking, and module resolution.
- Varying typing quality
  - Third-party typings can lag or conflict (`@types/*` vs built-in types).

### When to integrate

You usually integrate JS into TS when migrating incrementally, using an untyped dependency, or keeping runtime unchanged while gaining editor tooling and safety around the edges.

## Including JavaScript code in a TypeScript project

Here is a simple CommonJS JavaScript module that returns inconsistent shapes (illustrates why runtime guards are needed):

```js
// pricingEngine.js (CommonJS)
module.exports = {
  calculate(price, factor) {
    if (Math.random() > 0.5) return price * factor; // number
    return { value: price * factor }; // object
  },
};
```

> [!NOTE]
> To allow TypeScript to include `.js` files, set `allowJs: true` in `tsconfig.json`. If you also want to type-check those JS files, enable `checkJs: true`.

```jsonc
// tsconfig.json (partial)
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": false, // set true to enable basic JSDoc type-checking for .js files
    "esModuleInterop": true
  }
}
```

> [!CAUTION]
> Module format and runtime must match. In Node.js, if you use ES modules (`"type": "module"` in `package.json` or `.mjs` files), you must import ESM-style (`import ... from './file.js'`) and include file extensions. If a runtime expects CommonJS but you emit ESM (or vice versa), you'll see runtime errors like `Cannot use import statement outside a module`.

### Importing a CommonJS JS file from TypeScript

Option A — CommonJS style (Node + require)

```ts
// price.service.ts (compiled to run in a CommonJS environment)
const pricingEngine = require("./pricingEngine");

export function safeCalculate(price: number, factor: number): number {
  const result = pricingEngine.calculate(price, factor);

  if (typeof result === "number") return result;
  if (result && typeof result === "object" && "value" in result) return (result as any).value;

  throw new Error("Invalid response from pricing engine");
}
```

Option B — ESM-friendly import (when JS module is ESM or bundler handles interop)

```ts
// price.service.ts (ESM runtime or with proper bundler support)
import * as pricingEngine from "./pricingEngine.js";

export function safeCalculate(price: number, factor: number): number {
  const result = pricingEngine.calculate(price, factor as any);
  // same runtime validation as above
  if (typeof result === "number") return result;
  if (result && typeof result === "object" && "value" in result) return (result as any).value;
  throw new Error("Invalid response from pricing engine");
}
```

> [!TIP]
> Wrap untyped JS modules with a small TypeScript wrapper that performs runtime validation and exposes a typed API to the rest of your codebase.

## Type-checking JavaScript

By default, TypeScript does not type-check `.js` files. To enable basic checking (using JSDoc types), set `checkJs: true` in `tsconfig.json` and make sure `allowJs: true` is enabled so the compiler includes JS files.

You can also suppress checking for a particular file with `// @ts-nocheck` at the top of the file.

> [!CAUTION]
> Silencing with `@ts-nocheck` removes editor/compiler checks — calling functions with missing parameters will pass `undefined` at runtime and hide mistakes from the compiler.

## Using JSDoc to describe types (recommended for gradual migration)

Adding JSDoc comments to a JS file gives TypeScript (and editors) enough information to provide IntelliSense and catch many mistakes.

```js
// mathTools.js

/**
 * Multiplies two numbers.
 *
 * @param {number} a        First operand
 * @param {number} b        Second operand
 * @returns {number}        Result of a * b
 */
function multiply(a, b) {
  return a * b;
}

/**
 * Parses a JSON string safely.
 * @param {string} text
 * @returns {{ ok: true, value: any } | { ok: false, error: string }}
 */
function safeParse(text) {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

module.exports = { multiply, safeParse };
```

In TypeScript you can import and use these with good tooling support. With `esModuleInterop: true` you can do:

```ts
import mathTools = require("./mathTools");

export function calculateTotal(x: number, y: number): number {
  return mathTools.multiply(x, y);
}

export function parseUserConfig(text: string) {
  const result = mathTools.safeParse(text);
  if (result.ok) return result.value;
  throw new Error(`Invalid config: ${result.error}`);
}
```

> [!TIP]
> If you control the JS file, consider switching it to ESM (`export function multiply(...) {}`) — imports become straightforward: `import { multiply } from './mathTools.js'`.

## Declaration files (`.d.ts`)

When you cannot or prefer not to edit the original JS file, a `.d.ts` file provides a typed contract for TypeScript code.

Example JS (CommonJS):

```js
// userApi.js
function fetchUser(id) {
  return fetch(`/api/users/${id}`)
    .then((r) => r.json())
    .then((data) => (data ? { id: data.id, name: data.name, age: data.age } : null));
}

function isAdult(user) {
  return user && user.age >= 18;
}

module.exports = { fetchUser, isAdult };
```

Create a declaration file `userApi.d.ts` next to it:

```ts
// userApi.d.ts
export interface User {
  id: string;
  name: string;
  age?: number;
}

export function fetchUser(id: string): Promise<User | null>;
export function isAdult(user: User | null): boolean;
```

Then you can import from TypeScript as usual:

```ts
import { fetchUser, isAdult } from "./userApi";

export async function loadUserStatus(id: string) {
  const user = await fetchUser(id);
  if (!user) return "User not found";
  return isAdult(user) ? "Adult" : "Minor";
}
```

> [!CAUTION]
> If the `.d.ts` file is incomplete or incorrect, TypeScript will use the provided shapes — but they won't change runtime behavior. Keep declarations accurate.

## Using `@types/*` packages (DefinitelyTyped)

Many popular JS libraries have community-maintained types in the DefinitelyTyped repository and are published under `@types/*` on npm.

Install a type package for a popular library (example: lodash):

```pwsh
npm install --save-dev @types/lodash
```

> [!TIP]
> Prefer official types shipped with a library (`npm i library` which bundles its own types) over `@types/*` when available.

## Practical checklist when integrating JS into TS

- Prefer adding JSDoc or `.d.ts` for public/third-party APIs.
- Enable `allowJs` to compile JS with TypeScript; enable `checkJs` if you want to type-check JS.
- Keep module systems consistent or configure `esModuleInterop`/`module` properly.
- Add small TypeScript wrapper modules that validate runtime shapes and expose typed APIs.
- Use community `@types/*` when available; otherwise maintain accurate declaration files.
