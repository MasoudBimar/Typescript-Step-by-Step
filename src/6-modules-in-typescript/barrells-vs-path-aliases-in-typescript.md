# Which one is better Using barrels or Type Aliases

## Barrels everywhere

`index.ts` in every folder (barrels everywhere)

Pros

> [!TIP]
> Shorter imports, sometimes nicer ergonomics.

Cons

> [!CAUTION]
> Easy to accidentally create cycles (file A imports from folder barrel that re-exports A)
> Public API becomes fuzzy (“everything is exportable”)
> Debugging “where did this come from?” gets slower

Avoid “barrels everywhere”. Keep barrels only at library boundaries (and maybe a small number of intentional sub-entrypoints

## TypeScript path aliases (compilerOptions.paths)

Pros

> [!TIP]
> Clean, stable import paths: `import { X } from "@org/foo"`;
> Great in monorepos; encourages boundary imports.

Cons

> [!CAUTION]
> Aliases are a TypeScript compile-time resolution feature. Tooling must agree.
> Jest needs moduleNameMapper (ts-jest documents this explicitly).
> Runtime Node may need help if you’re running TS directly (depends on your setup).

Use aliases for cross-lib imports, but wire your test/runtime tooling correctly.

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@org/my-lib": ["libs/my-lib/src/index.ts"]
    }
  }
}
```

```ts
// libs/my-lib/src/index.ts
export { FooService } from "./lib/foo.service";
export type { FooConfig } from "./lib/foo.types";

// consumer
import { FooService, type FooConfig } from "@org/my-lib";
```
