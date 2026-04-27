# TypeScript Advanced Types

- [TypeScript Advanced Types](#typescript-advanced-types)
  - [Type Aliases \& Interfaces](#type-aliases--interfaces)
    - [Type Aliases](#type-aliases)
    - [Interfaces](#interfaces)
      - [Core Differences between Type Aliases and Interfaces](#core-differences-between-type-aliases-and-interfaces)
  - [Unions and intersections](#unions-and-intersections)
    - [Union Types](#union-types)
    - [Intersection Types](#intersection-types)
  - [Literal Types](#literal-types)
  - [Template Literal Types](#template-literal-types)
  - [Type Narrowing](#type-narrowing)
  - [Discriminating Unions](#discriminating-unions)
  - [Nullable Values](#nullable-values)
  - [Optional Chaining](#optional-chaining)
    - [noUncheckedIndexedAccess](#nouncheckedindexedaccess)
  - [Nullish Coalescing Operator](#nullish-coalescing-operator)
    - [First we need to know about falsy/truthy values](#first-we-need-to-know-about-falsytruthy-values)
    - [Assignment version](#assignment-version)
  - [Type Assertion](#type-assertion)
  - [The `any` type](#the-any-type)
  - [The `unknown` Type](#the-unknown-type)
  - [The `never` Type](#the-never-type)
  - [Utility Types](#utility-types)
  - [Type Guards](#type-guards)
  - [TypeScript Conditional Types](#typescript-conditional-types)

## Type Aliases & Interfaces

Let's compare type aliases with interfaces

### Type Aliases

Type Aliases allow defining types with a custom name (an Alias).

```ts
type CarYear = number;
type CarType = string;
type CarModel = string;
type Car = {
  year: CarYear;
  type: CarType;
  model: CarModel;
};
```

### Interfaces

Interfaces are similar to type aliases, except they only apply to object types.

```ts
interface Rectangle {
  height: number;
  width: number;
}

const rectangle: Rectangle = {
  height: 20,
  width: 10,
};
```

#### Core Differences between Type Aliases and Interfaces

> [!TIP]
> Interface Designed specifically for object shape, Supports declaration merging, Can be extended / implemented cleanly

> [!TIP]
> Type ALias More flexible, can represent Can represent: primitives, unions, intersections, tuples, mapped types, functions

## Unions and intersections

### Union Types

Union types allow you to define a type that can be one of several types.

```ts
type ID = number | string;
let userId: ID;
userId = 123; // OK
userId = "abc"; // OK
userId = true; // Error: Type 'boolean' is not assignable to type 'ID'
```

### Intersection Types

Intersection types allow you to combine multiple types into one.

> [!TIP]
> Derived types that combine properties of multiple types. An intersection type A & B has all properties of both A and B.

```ts
type X = { value: number };
type Y = { text: string };

type XY = X & Y;

let a: XY = {
  value: 42,
  text: "Hello", // must have both properties
};
```

Better example of intersection types is when we want to combine multiple behaviors into a single type.

```ts
type Draggable = {
  drag: () => void;
};

type Resizable = {
  resize: () => void;
};

type UIWidget = Draggable & Resizable;

let textBox: UIWidget = {
  resize: () => {},
  drag: () => {},
};
```

## Literal Types

There are three sets of literal types available in TypeScript: strings, numbers, and booleans; by using literal types you can allow an exact value which a string, number, or boolean must have.

```ts
type percent = 3 | 6 | 9; # Cannot be any number other than 3,6,9
type Metric = "cm" | "inch";
```

## Template Literal Types

- You can create string types based on patterns.

```ts
type EndPoint = `/api/${string}`;

const userEndpoint: EndPoint = "/api/users"; // valid
const invalidEndpoint: EndPoint = "/home"; // error
```

## Type Narrowing

**What is type narrowing?**

**Type Narrowing** is the process of refining a broad type to a more specific type within a conditional block.

```ts
function kgToLbs(weight: number | string): number {
  // Narrowing
  if (typeof weight === "number") {
    return weight * 2.2;
  } else {
    return parseFloat(weight) * 2.2;
  }
}
```

> [!NOTE]
> when there is a union type, we need to use type narrowing to perform operations specific to each type.

In the example above, we check if weight is of type number or string, and based on that, we narrow down the type to perform appropriate operations.

> [!TIP]
> Type Narrowing Techniques: must be used within a conditional block, Type Guards (typeof, instanceof), User-defined type guards, Discriminated unions

```ts
type Weight = number | string;

function kgToLbs(weight: Weight): number {
  // Narrowing
  if (typeof weight === "number") {
    return weight * 2.2;
  } else {
    return parseFloat(weight) * 2.2;
  }
}
```

## Discriminating Unions

A common technique for working with unions is to have a single field which uses [Literal Types](#literal-types) which you can use to let TypeScript narrow down the possible current type.

For example, we’re going to create a union of three types which have a single shared field.

```ts
type NetworkLoadingState = {
  state: "loading";
};
type NetworkFailedState = {
  state: "failed";
  code: number;
};
type NetworkSuccessState = {
  state: "success";
  response: {
    title: string;
    duration: number;
    summary: string;
  };
};
// Create a type which represents only one of the above types
// but you aren't sure which it is yet.
type NetworkState = NetworkLoadingState | NetworkFailedState | NetworkSuccessState; // Union type + Discriminating field
```

## Nullable Values

In TypeScript, the `null` and `undefined` types represent the absence of a value.
By default, when you declare a variable without initializing it, it is assigned the value `undefined`.
The `null` value is typically used to indicate that a variable intentionally has no value.

When you enable the `strictNullChecks` compiler option, TypeScript will not allow you to assign `null` or `undefined` to a variable unless you explicitly include them in the type.

So `strictNullChecks` controls:

This code is valid when `strictNullChecks` is off:

```ts
const x: number = null; // OK, null is a valid number
```

but triggers an error when you turn `strictNullChecks` on:

```ts
const x: number = null;
// ~ Type 'null' is not assignable to type 'number'
```

Instead of disabling `strictNullChecks`, we should explicitly include null or undefined in the types when needed

```ts
const x: number | null = null;
```

Or we can use a union type to allow both null and undefined

```ts
function greet(name: string | null | undefined) {
  if (name) {
    console.log(name.toUpperCase());
  } else {
    console.log("Heyyyy");
  }
}

greet(null);
```

How to deal with null and undefined values?

- Use union types to explicitly include null or undefined when needed.
- Use optional chaining to safely access properties on potentially null or undefined values.
- Use the nullish coalescing operator (??) to provide default values when dealing with null or undefined.

```ts
const el = document.getElementById("some-id");
el.textContent = "Ready"; // ~~ Object is possibly 'null'
if (el) {
  el.textContent = "Ready"; // OK, null has been excluded (using check)
}
el!.textContent = "Ready"; // OK, we've asserted that el is non-null (using non-null assertion operator)
```

## Optional Chaining

Optional property access operator: It’s a tiny piece of syntax with a big job: safely accessing a property when the value before it might be null or undefined.

```ts
function getUser(id: number): User | null | undefined {
  return id === 0 ? null : { userName: "TestUser" };
}

let user = getUser(0);
// Optional property access operator
console.log(user?.userName);
// If user or profile were null, the code would still run without crashing.
```

Why it exists

It saves you from defensive chains like:

```ts
user && user.profile && user.profile.email;
```

and keeps logic tidy while working nicely with `strictNullChecks`.

For accessing an array:
Optional element access operator

```ts
// before
if (customers !== null && customers !== undefined) {
  customers[0];
}
// after
customers?.[0];
```

For calling functions we have Optional call

```ts
let log: any = null; // (msg: string) =>{}

log?.("test");
```

### noUncheckedIndexedAccess

When you access an array element, TypeScript will check if the index is within the bounds of the array. If you try to access an index that is out of bounds, TypeScript will give you an error.

```ts
const myArray = ["one", "two", "three"];
const value = myArray[5];
console.log(value.toUpperCase()); // Error: Object is possibly 'undefined'.ts(2532)
console.log(value?.toUpperCase()); // OK, value is possibly undefined, but we handle it with optional chaining
console.log(myArray[0].toUpperCase()); // Error: Object is possibly 'undefined'.ts(2532)
```

## Nullish Coalescing Operator

The `??` operator provides a safe default value, but only when the left-hand side is `null` or `undefined` not for all falsy values.

What it does:

```ts
const x = foo ?? "default";
0 || 42; // 42   (oops if 0 was a valid value)
"" || "abc"; // 'abc'
false || true; // true
```

### First we need to know about falsy/truthy values

a ?? b returns:

a if a is not null or not undefined

otherwise, it returns b

This makes it a “null-or-undefined fallback,” not a “falsey fallback.”

### Assignment version

```ts
let value: number | undefined;

value ??= 10;
// same as:
value = value ?? 10;
```

## Type Assertion

`as` won't do the conversion; it just tells the compiler about the return type of that expression.

In other words, a type assertion tells the TypeScript compiler to treat a value as a specific type without changing the runtime value.

> [!CAUTION]
> `as` won't do the conversion; it just tells the compiler about the return type of that expression.

```ts
const value = something as MyType;
const value = <MyType>something;
```

The first form (as) is the modern standard.

## The `any` type

The `any` type in TypeScript is a special type that can represent any value. It is often used when you want to opt out of type checking for a particular variable or when you are working with dynamic content.

explicit 'any' type annotation:

```ts
let myVariable: any = "Hello, World!";
myVariable = 42; // No error, myVariable can be assigned any type of value
```

implicit 'any' type:

> [!NOTE]
> implicit 'any' occurs when TypeScript cannot infer the type of the variable and it can be avoided by writing type declaration and for checking by providing an explicit type annotation or by enabling the `noImplicitAny` compiler option.

```ts
function logMessage(message) {
  console.log(message);
  // Error: Parameter 'message' implicitly has an 'any' type.ts(7006)
}
```

Why using 'any' is not recommended in TypeScript?

- The any type silences the type checker and TypeScript language services.
- It defeats the purpose of using TypeScript by allowing any value to be assigned to a variable typed as 'any'.
- It can lead to runtime errors that TypeScript is designed to prevent.

## The `unknown` Type

When we define a parameter with the `any` type, we basically bypass type checking.

But if we use `unknown`, we have to use type narrowing or type guards

```ts
function render(document: any) {
  document.x33(); // compiler wont complain about any types
}
```

> [!CAUTION] Using `any` is like telling the compiler "I know what I'm doing, trust me." It can lead to runtime errors if the actual type doesn't match your assumptions.

```ts
function render(document: unknown) {
  // We need to use type narrowing with typeof or instanceof
  // Narrowing
  if (typeof document === "string") {
    // for primitives
    document.toUpperCase();
  }
  if (document instanceof WordDocument) {
    // for objects
    document.toUpperCase();
  }
}
```

> [!TIP] The `unknown` type is a safer alternative to `any` because it forces you to perform type checks (Type Narrowing or type guards) before using the value, reducing the risk of runtime errors.

## The `never` Type

The never type in TypeScript represents values that should not exist. Whenever TypeScript concludes “this code path can’t produce a value,” you get `never`.

```ts
function fail(message: string): never {
  throw new Error(message);
}
```

> [!TIP] The `never` type is useful for functions that `always throw an error` or have `infinite loops`, indicating that they will never return a value.

When TypeScript knows all possibilities have been excluded, the inferred type becomes `never`.

```ts
function process(x: string | number) {
  if (typeof x === "string") {
    // ...
  } else if (typeof x === "number") {
    // ...
  } else {
    // x is never
  }
}
```

We should set `never` explicitly because sometimes the TypeScript compiler infers the return type as `void`.

## Utility Types

TypeScript provides built-in utility types to manipulate types.

- `Partial<T>`: Makes all properties optional.
- `Required<T>`: Makes all properties required.
- `Readonly<T>`: Makes all properties read-only.
- `Pick<T, K>`: Creates a type by picking properties `K` from `T`.
- `Omit<T, K>`: Creates a type by omitting properties `K` from `T`.
- `Record<K, T>`: Creates a type with keys `K` and values of type `T`.
- `Exclude<T, U>`: Excludes from `T` those types that are assignable to `U`.
- `Extract<T, U>`: Extracts from `T` those types that are assignable to `U`.
- `NonNullable<T>`: Excludes `null` and `undefined` from `T`.
- `ReturnType<T>`: Gets the return type of a function type `T`.
- `Parameters<T>`: Gets the parameter types of a function type `T` as a tuple.
- `ConstructorParameters<T>`: Gets the parameter types of a constructor function type `T` as a tuple.
- `InstanceType<T>`: Gets the instance type of a constructor function type `T`.
- `ThisType<T>`: Used to specify the type of `this` in an object literal.
- `Uppercase<S>`, `Lowercase<S>`, `Capitalize<S>`, `Uncapitalize<S>`: String manipulation types.
- `Awaited<T>`: Unwraps the type of a Promise.

```ts
type User = { name: string; age: number };

type PartialUser = Partial<User>; // { name?: string; age?: number }
type RequiredUser = Required<PartialUser>; // { name: string; age: number }
type ReadonlyUser = Readonly<User>; // { readonly name: string; readonly age: number }
type UserName = Pick<User, "name">; // { name: string }
type UserWithoutAge = Omit<User, "age">; // { name: string }
type UserRecord = Record<string, User>; // { [key: string]: User }
type UserKeys = keyof User; // "name" | "age"
type UserValues = User[UserKeys]; // string | number
type NonNullableUser = NonNullable<User | null>; // User
type UserReturnType = ReturnType<() => User>; // User
type UserParameters = Parameters<(name: string, age: number) => User>; // [string, number]
type UserConstructorParameters = ConstructorParameters<typeof User>; // [string, number]
type UserInstanceType = InstanceType<typeof User>; // User
type ThisTypeExample = ThisType<{ name: string }>; // { name: string }
type UppercaseName = Uppercase<"user">; // "USER"
type AwaitedUser = Awaited<Promise<User>>; // User
```

-- `Partial` is commonly used for update operations where you only want to provide some of the properties.
-- `Record` is usefull for keeping configuratios & status maps.
-- `Omit` & `Pick` is usefull for working with APIs to deal with part of data.
-- `Readonly` is usefull for immutability & preventing accidental changes.
-- `keyof` & indexed access types are usefull for dynamic property access & type manipulation.
-- `NonNullable` is usefull for ensuring values are not null or undefined.
-- `ReturnType` & `Parameters` are usefull for working with function types and ensuring type safety.

## Type Guards

```ts
type User = { name: string; age: number };
type Admin = { name: string; permissions: string[] };

function isAdmin(user: User | Admin): user is Admin {
  return "permissions" in user;
}

function handleUser(user: User | Admin) {
  if (isAdmin(user)) {
    console.log(user.permissions);
  }
}
```

Better Guard Example:

```ts
function isAdmin(user: unknown): user is Admin {
  return typeof user === "object" && user !== null && "permissions" in user && Array.isArray((user as any).permissions);
}
```

## TypeScript Conditional Types

- You can create different types based on a condition.
- This gives flexibility in type definition

```ts
type ApiResponse<T> = T extends "error" ? { status: 400; message: string } : { status: 200; data: any };

type ErrorResponse = ApiResponse<"error">; // { status: 400, message: string }
type SuccessResponse = ApiResponse<"success">; // { status: 200, data: any }
```

Meaning:

If `T` is `error` the type becomes `{ status: 400, message: string }`

Otherwise the type becomes `{ status: 200, data: any }`

So:

`ApiResponse<"error">` produces an error response type

`ApiResponse<"success">` produces a success response type

Better Ways to Use Conditional Types:

```ts
type ApiResponse<T extends "error" | "success", D = unknown> = T extends "error" ? { status: 400; message: string } : { status: 200; data: D };

// Usage

type SuccessUser = ApiResponse<"success", { id: number; name: string }>;
```

Often better way using type discriminators:

```ts
type ApiResponse<D> = { status: 200; data: D } | { status: 400; message: string };

// This works great with control flow narrowing:

function handle<D>(res: ApiResponse<D>) {
  if (res.status === 200) {
    res.data; // typed
  } else {
    res.message; // typed
  }
}
```

[OOP in Typescript](./../3-oop-with-typescript/oop-with-typescript.md)
