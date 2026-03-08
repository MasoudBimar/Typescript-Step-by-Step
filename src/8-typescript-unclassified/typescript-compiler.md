# Typescript Compiler and Code Generation

TypeScript compiler does two main things:

1. Type Checking: It checks the types in your code to catch errors before you run it.
2. Transpilation: It converts your TypeScript code into JavaScript that can run in any JavaScript environment.

> [!NOTE]
> `transpiling` is converting next-generation code (like TypeScript or ES6+) into older JavaScript that can run in current environments. this process is also called `downleveling`.

`TypeChecking` is completely independent of `Transpilation`. You can use the TypeScript compiler just for type checking without generating JavaScript code by using the `--noEmit` flag.

```bash
tsc --noEmit
```

Can Code be genrated with type errors?
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

Event Primitive Types (Declared Types) in Typescript might be different from their JavaScript counterparts, for example:

in this example the `boolean` type in TypeScript is a primitive type that can only be `true` or `false`, while in JavaScript, the `Boolean` type is an object wrapper around the primitive boolean value.

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
```
