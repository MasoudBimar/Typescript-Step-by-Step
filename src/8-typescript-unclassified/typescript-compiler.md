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
