# Typescript Compiler and Code Generation

- [Typescript Compiler and Code Generation](#typescript-compiler-and-code-generation)
  - [TypeScript Compiler](#typescript-compiler)
  - [Runtime Types vs Declared Types](#runtime-types-vs-declared-types)
  - [Function Overloading using Typescript Types](#function-overloading-using-typescript-types)
    - [Function cannot be overloded by based on typescript types](#function-cannot-be-overloded-by-based-on-typescript-types)
  - [Runtime Performance \& TypeScript Types](#runtime-performance--typescript-types)
  - [JavaScript is inherently duck typed](#javascript-is-inherently-duck-typed)

## TypeScript Compiler

TypeScript compiler does two main things:

1. Type Checking: It checks the types in your code to catch errors before you run it.
2. Transpilation: It converts your TypeScript code into JavaScript that can run in any JavaScript environment.

> [!NOTE]
> `transpiling` is converting next-generation code (like TypeScript or ES6+) into older JavaScript that can run in current environments. this process is also called `downleveling`.

`TypeChecking` is completely independent of `Transpilation`. You can use the TypeScript compiler just for type checking without generating JavaScript code by using the `--noEmit` flag.

```bash
tsc --noEmit
```

Can Code be generated with type errors?
Yes, by default, TypeScript will still generate JavaScript code even if there are type errors.

> [!NOTE]
> Even with type errors, the TypeScript compiler will still emit JavaScript code unless you use the `--noEmitOnError` flag.
> Because code generation is independent of type checking.

Generating code with type errors can help you test and run unaffected parts of the codebase, even if some files contain errors.

> [!CAUTION]
> Typescript Types Cannot be checked at runtime. TypeScript's type system is only used during development and compile time.

```ts
type employee = {
  name: string;
  age: number;
};

type manager = {
  name: string;
  age: number;
  department: string;
};

type EmployeeOrManager = employee | manager;

function printEmployeeInfo(emp: EmployeeOrManager) {
  // Error(ts 2693): 'manager' only refers to a type, but is being used as a value here.
  // instead of using instanceof we can use the in operator to check if the property exists in the object
  if (emp instanceof manager) {
    console.log(emp.department);
  }
  if ("department" in emp) {
    console.log(emp.department);
  }
}
```

> [!NOTE]
> The `in` operator is a more reliable way to check for the existence of a property in an object at runtime.
> `instanceof` happens at runtime and only works with classes and constructor functions, not with type aliases or interfaces.

What is the alternative to `instanceof` for type checking in TypeScript?

1. Use the `in` operator to check for the existence of a property that is unique to a specific type.
2. Use type discriminators (a common property that can be used to differentiate between types).
3. Use user-defined type guards (functions that return a type predicate to narrow down types).

```ts
type employee = {
  type: "employee";
  name: string;
  age: number;
};

type manager = {
  type: "manager";
  name: string;
  age: number;
  department: string;
};

type EmployeeOrManager = employee | manager;

function printEmployeeInfo(emp: EmployeeOrManager) {
  if (emp.type === "manager") {
    console.log(emp.department);
  }
}
```

> [!NOTE]
> Types defined with class key word is available both at compile time and runtime, so we can use `instanceof` to check for their types.

```ts
class Employee {
  constructor(
    public name: string,
    public age: number,
  ) {}
}

class Manager extends Employee {
  constructor(
    name: string,
    age: number,
    public department: string,
  ) {
    super(name, age);
  }
}
type EmployeeOrManager = Employee | Manager;

function printEmployeeInfo(emp: EmployeeOrManager) {
  if (emp instanceof Manager) {
    console.log(emp.department);
  }
}
```

> [!NOTE]
> Type Assertion (Generally Type Operation) cannot affect runtime values.

It only tells the TypeScript compiler to treat a value as a different type for type checking purposes. It does not change the actual type of the value at runtime.

```ts
function getEmployeeInfo(emp: EmployeeOrManager) {
  // Type assertion to treat emp as a Manager
  const manager = emp as Manager;
  console.log(manager.department); // This will cause a runtime error if emp is not actually a Manager
}
```

after compilation(transpilation), the above code will look like this:

```js
"use strict";
function getEmployeeInfo(emp) {
  // Type assertion to treat emp as a Manager
  const manager = emp;
  console.log(manager.department); // This will cause a runtime error if emp is not actually a Manager
}
```

So how should we handle type conversions in TypeScript?

1. Check the type at runtime using typeof, instanceof, or the in operator before performing operations that depend on a specific type.
2. Use Javascript type conversion methods (Type Constructs) (like `Number()`, `String()`, etc.) to convert values to the desired type.

```ts
function convertToNumber(value: string | number): number {
  if (typeof value === "string") {
    return Number(value); // Convert string to number
  }
  return value; // Already a number
}
```

## Runtime Types vs Declared Types

Primitive Types (Declared Types) in Typescript might be different from their JavaScript counterparts.

In this example the `boolean` type in TypeScript is a primitive type that can only be `true` or `false`, while in JavaScript, the `Boolean` type is an object wrapper around the primitive boolean value.

```ts
function setLightSwitch(value: boolean) {
  switch (value) {
    case true:
      turnLightOn();
      break;
    case false:
      turnLightOff();
      break;
    default:
      console.log(`I can't do that.`);
  }
}

function turnLightOn() {
  console.log("switching on");
}
function turnLightOff() {
  console.log("switching off");
}

setLightSwitch(true);
setLightSwitch(false);
let userInput = await getUserInput(); // Assume this returns a value from a service call
setLightSwitch(userInput); // This will call the default case if userInput is not a boolean
```

## Function Overloading using Typescript Types

> [!ERROR]
> TypeScript does not support function overloading in the same way that languages like Java or C# do.

### Function cannot be overloded by based on typescript types

```ts
function add(a: number, b: number): number {
  return a + b;
}
function add(a: string, b: string): string {
  return a + b;
}

// Error: Duplicate function implementation.ts(2393)
```

> [!ERROR]
> In TypeScript, you can achieve a similar effect using function overload signatures, but you cannot have multiple implementations of the same function.

```ts
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: any, b: any): any {
  return a + b;
}
```

In this example, we declare two overload signatures for the `add` function, one for numbers and one for strings.
However, we only provide a single implementation that can handle both cases using the `any` type.

- The implementation signature must also be compatible with the overload signatures.
- The implementation signature can be more general than the overload signatures, but it cannot be more specific.
- The implementation signature must be able to handle all the cases defined by the overload signatures.

Notice this is wrong:

> [!ERROR]
> Caller only see the overload signatures, not the implementation signature. so if the implementation signature is not compatible with the overload signatures, it will cause a type error when calling the function.

```ts
function fn(x: string): void;
function fn() {
  // ...
}

fn(); // Error: No overload matches this call.ts(2769)
```

> [!NOTE]
> Again, the signature used to write the function body can’t be “seen” from the outside. (Function Overloads)[https://www.typescriptlang.org/docs/handbook/2/functions.html#overloads]

Correct way to write the above code:

```ts
function fn(): void;
function fn(x: string): void;
function fn(x?: string): void {
  // ...
}

fn();
fn("hello");

// simpler way to write the above code:

function fn(x?: string): void {
  // ...
}

fn();
fn("hello");
```

## Runtime Performance & TypeScript Types

> [!NOTE]
> TypeScript's type system is only used during development and compile time. It does not have any impact on the runtime performance of the generated JavaScript code.

Compilation might get slower If:

1. You have a large codebase with many files and complex type relationships.
2. You are using advanced TypeScript features and transpile to older JavaScript versions that require more complex transformations.
3. You have strict type checking enabled, which can require more time to analyze the code.

Remember typing systerm is separated from code generation.
Also odebase with type error is able to be transpiled to Javascript.
Plus `TypeScript` types are not available at runtime.
To use types at runtime, wee need to reconstruct it.

- Tagged unions and property checking are common ways to do this.
- Some constructs, such as class, introduce both a Type‐Script type and a value that is available at runtime

## JavaScript is inherently duck typed

> [!NOTE]
> Structural Typing or Duck Typing: If it walks like a duck and quacks like a duck, it’s a duck.

That said, TypeScript's type system is structural, which means that if two types have the same shape, they are considered compatible, regardless of their names or declarations.
for exmple a function accepts any value whose structure matches the expected type, regardless of its declared type

```ts
interface Duck {
  quack(): void;
}
interface Person {
  quack(): void;
}
function makeItQuack(duck: Duck) {
  duck.quack();
}
const person: Person = {
  quack() {
    console.log("I can quack like a duck!");
  },
};
makeItQuack(person); // This works because Person has the same shape as Duck
```

In this example, even though `Person` and `Duck` are different types, they are compatible because they have the same structure (both have a `quack` method). This is a fundamental aspect of TypeScript's type system and allows for flexible code reuse and interoperability.

```ts
interface SimpleUser {
  fName: string;
  lName: string;
}
function showUser(v: SimpleUser) {
  return console.log(v.fName, v.lName);
}
interface NearlyUser {
  role: string;
  fName: string;
  lName: string;
}

const v: NearlyUser = { fName: "John", lName: "Doe", role: "SuperUser" };
showUser(v); // OK, no complain about type mismatch
```

> [!NOTE]
> Typescript type system is modeling JavaScript's dynamic & flexible runtime behavior.

> [!TIP]
> `structural typing`: Two type are compatible if their members are compatible, regardless of their names or declarations.

> [!TIP]
> Use structural typing to facilitate unit testing by creating mock objects that match the expected structure of the types being tested, without needing to create full implementations of those types.
