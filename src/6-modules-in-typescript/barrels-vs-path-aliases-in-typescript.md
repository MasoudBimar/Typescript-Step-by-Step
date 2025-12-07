# Barrels vs. Path Aliases in TypeScript

## Barrels Everywhere

`index.ts` in every folder as a barrel/re-export point

Pros

> [!TIP]
> Shorter imports, sometimes nicer ergonomics.

Cons

> [!CAUTION]
> Easy to accidentally create cycles (file A imports from folder barrel that re-exports A)
> Public API becomes fuzzy (“everything is exportable”)
> Debugging “where did this come from?” gets slower

Avoid "barrels everywhere". Keep barrels only at library boundaries and intentional sub-entrypoints.

## TypeScript Path Aliases (`compilerOptions.paths`)

Pros

> [!TIP]
> Clean, stable import paths: `import { X } from "@org/foo"`.
> Excellent in monorepos; encourages clear boundary imports.

Cons

> [!CAUTION]
> Aliases are a TypeScript compile-time resolution feature; tooling must be configured to match.
> Jest requires `moduleNameMapper` (ts-jest documents this explicitly).
> Runtime Node may need additional setup if running TypeScript directly (depends on your build/loader configuration).
>
> Use aliases for cross-library imports, but ensure test/runtime tooling is correctly configured.

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

Next Section: [Integration Typescript with javascript](./../7-integration-typescript-with-javascript/integration-typescript-with-javascript.md)
