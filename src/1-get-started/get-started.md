# What is Typescript

Typescript is s syntactic superset of JavaScript that adds static types. It is designed to help developers catch errors early through a type system and to make JavaScript development more efficient. TypeScript code is transpiled into plain JavaScript, which can run in any environment that supports JavaScript, such as web browsers and Node.js.

- Can TypeScript “check inconsistency” in JavaScript code?
  - TypeScript can type-check plain .js files and catch a lot of inconsistencies (wrong argument types, missing properties, unsafe null usage, etc.), if you enable it.
  - JSDoc + checkJs (type-check JS files)
  - Gradual typing via .ts migration
- Can we control which ECMAScript version TypeScript outputs?
  - Yes — with target (and also module) in `tsconfig.json`
  - TypeScript transpiles based on `compilerOptions.target`

## What Typescript adds to javascript

- Static Typing
- Code completion
- Refactoring
- Shorthand notation and new features

## Static Typing

Javascript is a Dynamically-Typed Language
Typescript is a Statically-Typed language
TypeScript uses compile time type checking.
Which means it checks if the specified types match before running the code, not while running the code.
Typescript is Javascript plus type-schecking

### Typeswcript Drawbacks

- Compilation (Transpilation)
- Discipline in coding (need to be followed)

### Installing Typescript

```bash
npm install -g typescript
```

### Transpile Typescript file to Javascript

```bash
 tsc filename.ts
```

### Configure Typescript Compiler

```bash
tsc --init
```

This command create a configuration file called tsconfig.json with default settings

### Most Important configs in tsconfig.ts

```json
    "rootDir": "./src",
    "outDir": "./dist",
    "removeComments": true,
    "noEmitHelpers": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedParameters": true,
    "noUnusedLocals": true,
    "allowUnreachableCode": false,
```

### Debugging

Just add a brakepoint somewhere and go to the dubug panel in vs-code.
Then click on create launch.json file and select Node.js

### Launch File Configuration

```json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}\\src\\get-started\\1.get-started.ts",
      "preLaunchTask": "tsc: build - tsconfig.json",
      "outFiles": ["${workspaceFolder}/**/*.js"]
    }
  ]
}
```

## Types

Javascript built-in types

- number
- string
- boolean
- null
- undefined
- object

Typescript extended types

- any
- unknown
- never
- enum
- tuple
- BigInt (ES2020+)
- Symbol

### Type Annotation and Inference

TypeScript offers two ways to work with types:

- Explicit Typing: You explicitly declare the type of a variable
- Type Inference: TypeScript automatically determines the type based on the assigned value

### Typescript Tuples

- Typed Arrays
  A tuple is a typed array with a pre-defined length and types for each index.

```ts
let user: [number, string] = [15, "Masoud"];

// define our tuple
let ourTuple: [number, boolean, string];

// initialize correctly
ourTuple = [5, false, "Coding God was here"];

// We have no type safety in our tuple for indexes 3+
ourTuple.push("Something new and wrong");

console.log(ourTuple);
```

### Typescript Enums

Enums is a list of related constants.
If we define our enum as constants the compiler will generate the more optimized code.

```ts
const small = 1;
const meduim = 2;
const large = 3;

// PascalCase

enum Size {
  Small = 1,
  Meduim = 2,
  Large = 3,
}

let mySize: Size = Size.Meduim;

const enum Size1 {
  Small = 1,
  Meduim = 2,
  Large = 3,
}
```

[Typescript Advanced Types](./../2-advanced-types/advanced-types.md)
