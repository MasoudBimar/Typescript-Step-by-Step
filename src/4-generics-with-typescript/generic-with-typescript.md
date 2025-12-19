# Generic With Typescript

- What? Why? Where?
- Generic Classes
- Generic Functions
- Generic Interfaces
- Generic Constraints
- Extending Generic Classes
- Type Mapping

## What? Why? Where?

### What are Generics?

A generic is a type parameter — like a variable for types.

When you write a function or class, instead of committing to a specific type (string, number, YourType), you say:

```ts
function wrap<T>(value: T) {
  return { value };
}
```

Here T is a placeholder. The function doesn't care what value is; it only promises to keep its type consistent.

It’s the same idea as algebra: f(x) = x² does not need to know what x is, only that x behaves consistently within the function.

### Why do we need Generics?

TypeScript’s generics solve a recurring problem: reusability without losing type safety.

Without generics, functions that work for “any type” must fall back to any, which is basically an escape hatch that breaks safety guarantees.

Generics let you build:

- Reusable APIs without sacrificing precision.
- Fluent chains of transformations where the type "flows" with the data.
- Contracts that depend on other types.

Examples of problems solved by generics:

- Mapping values while keeping the same shape.
- Expressing “a promise of X”.
- Creating collections `(Array<T>, Map<K, V>)`.
- Enforcing relationships between multiple types.

They’re a mathematical language for expressing constraints in code.

### Where are Generics used?

Almost everywhere a pattern depends on a type the user of the function chooses.

Here are the common places:

Functions

```ts
function identity<T>(value: T): T {
  return value;
}
```

Classes

```ts
class Box<T> {
  constructor(public content: T) {}
}
```

Interfaces

```ts
interface ApiResponse<T> {
  data: T;
  error?: string;
}
```

Utility Types

```ts
type Maybe<T> = T | null | undefined;
```

Constraints

```ts
function logLength<T extends { length: number }>(item: T) {
  console.log(item.length);
}
```

## Generic classes

```ts
class Box<T> {
  constructor(private value: T) {}

  get(): T {
    return this.value;
  }
}

const numBox = new Box<number>(10);
const strBox = new Box<string>("hello");

console.log(numBox.get()); # number
console.log(strBox.get()); # string
```

Another example:

```ts
class KeyValuePair<K, V> {
  constructor(public key: K, public value: V) {}
}

let pair = new KeyValuePair<string, number>("1", 123);
let pair2 = new KeyValuePair("1", 123); # without supplying the generic type arguments, the compiler infers the types based on constructor parameters
```

## Generic Functions

A function with type parameters — usually written as `<T>, <T, U>, ` etc.
These parameters behave like variables for types, not for values.

`T` captures whatever type the caller passes in, and the function returns that same type.
Nothing magical — just a promise of consistency.

```ts
function wrapInArray<T>(value: T) {
  return [value];
}

class ArrayUtils {
  static wrapInArray<T>(value: T) {
    return [value];
  }
}

let numbers = ArrayUtils.wrapInArray(1);
```

## Generic Interfaces

Where Are Generic Interfaces Used?

- Data Containers

  ```ts
  interface Result<T> {
    data: T;
    error?: string;
  }

  const r: Result<User> = { data: { name: "Jon" } };
  ```

- HTTP Responses

  ```ts
  interface ApiResponse<T> {
    payload: T;
    status: number;
  }
  ```

- Collections & Dictionaries

  ```ts
  interface Dictionary<T> {
    [key: string]: T;
  }

  const scores: Dictionary<number> = { alice: 10 };
  ```

- Function Signatures

  ```ts
  interface Transformer<T, R> {
    (input: T): R;
  }

  const toLength: Transformer<string, number> = (s) => s.length;
  ```

- Constraints

```ts
interface NamedEntity {
  name: string;
}

interface Store<T extends NamedEntity> {
  add(item: T): void;
  get(name: string): T | undefined;
}
```

## Generic Constraints

### What Are Generic Constraints?

A constraint is a rule placed on a type parameter, written as:

```ts
<T extends SomeType>

```

`extends` here means “T must be assignable to this type” — not inheritance.

We can constraint by interface or a class.

```ts
function logLength<T extends { length: number }>(item: T) {
  console.log(item.length);
}
```

```ts
class Person {
  name: string;
}
class Customer extends Person {}

function doSomething<T extends Person>(value: T): T {
  return value;
}

doSomething(new Customer("test"));
```

### Why Use Constraints?

They solve the problem of generic functions that need specific operations.

Without constraints, TypeScript won’t allow property access or method usage:

```ts
function fail<T>(x: T) {
  return x.length; # ❌ Error — T could be anything
}
```

With Constraints

```ts
function ok<T extends { length: number }>(x: T) {
  return x.length; # ✔️ Safe
}
```

### Restricting to Objects, Classes and Unions or even shape of an object

```ts
function getValue<T extends object, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}
```

```ts
function createInstance<T extends new (...args: unknown[]) => unknown>(ctor: T) {
  return new ctor();
}
```

```ts
function print<T extends string | number>(value: T) {
  console.log(value);
}
```

## Extending Generic Classes

```ts
interface User {
  name: string;
  ssn: number;
}

class Store<T> {
  protected items: T[] = []; # should be private or protected if we plan to inherit from it

  add(value: T): void {
    this.items.push(value);
  }
}

let store = new Store<User>();

// Pass on the generic type parameter
class CompressibleStore<T> extends Store<T> {
  compress() {}
}

let store = new CompressibleStore<User>();
store.compress();

// Restricting the generic type parameter
class SearchableStore<T extends { name: string }> extends Store<T> {
  find(name: string): T | undefined {
    return this.items.find((obj) => obj.name === name); # we need to use constraints to add the name property to T
  }
}

// Fix the generic type parameter
class UserStore<User> extends Store<User> {
  filterByCategory(category: string): User[] {
    return [];
  }
}
```

## The keyof Operator

The keyof operator takes an object type and produces a string or numeric literal union of its keys. The following type P is the same type as `type P = "x" | "y"`:

```ts
type Point = { x: number; y: number };
type P = keyof Point;
```

If the type has a string or number index signature, keyof will return those types instead:

```ts
class SearchableStore<T extends { name: string }> extends Store<T> {
  // If the property uses a string type, we get this error:
  // "No index signature with a parameter of type 'string' was found on type"
  // We need to tell the compiler we're not using an index signature,
  // but actual properties of type T.
  // The keyof operator returns the union of properties of the given type
  find(property: keyof T, value: unknown): T | undefined {
    return this.items.find((obj) => obj[property] === value);
  }
}
```

## Type Mapping

Sometimes a type needs to be based on another type, so repeating the exact properties makes it duplicate.

With type mapping we can iterate over one type properties and their types and create another type with some manipulation.

- based type => readonly version
- based type => required all properties version
- based type => optional version

First step create a type based on another using type mapping:

```ts
interface User {
  id: number;
  name: string;
  birthDate: Date;
}

type ReadonlyUser = {
  // index signature & keyof
  readonly [Property in keyof User]: User[Property];
  // left-hand side: iterate over all User's properties using index signature & keyof
  // right-hand side: get the type of the corresponding property
};
```

Next step change the property name to K and make it generic:

```ts
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

let newUser: Readonly<User> = {
  id: 2,
  name: "Masoud",
  birthDate: new Date(),
};

newUser.name = "somethingElse"; # Error: Cannot assign to 'name' because it is a read-only property
```

Same as for Optional,

```ts
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

type Optional<T> = {
  [K in keyof T]?: T[K];
};

type Required<T> = {
  [K in keyof T]: T[K] | null;
};
```

### Because these types are quite useful, they are built into TypeScript

Typescript Utility Types

```ts
Awaited<Type>;
Partial<Type>;
Required<Type>;
Readonly<Type>;
Record<Keys, Type>;
Pick<Type, Keys>;
Omit<Type, Keys>;
Exclude<UnionType, ExcludedMembers>;
Extract<Type, Union>;
NonNullable<Type>;
Parameters<Type>;
ConstructorParameters<Type>;
ReturnType<Type>;
InstanceType<Type>;
NoInfer<Type>;
ThisParameterType<Type>;
OmitThisParameter<Type>;
ThisType<Type>;
//Intrinsic String Manipulation Types
Uppercase<StringType>;
Lowercase<StringType>;
Capitalize<StringType>;
Uncapitalize<StringType>;
```

[Typescript Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

Next Section: [Decorators In Typescript](./../5-decorators-in-typescript/decorators-in-typescript.md)
