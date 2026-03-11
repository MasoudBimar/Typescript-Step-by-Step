# TypeScript Advanced Types

- Type aliases
- Unions and intersections
- Type narrowing
- Nullable types
- The unknown type
- The never type

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

## Type Narrowing

What is type narrowing?

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

type narrowing is the process of refining a broad type to a more specific type within a conditional block. In the example above, we check if weight is of type number or string, and based on that, we narrow down the type to perform appropriate operations.

## Discriminating Unions

A common technique for working with unions is to have a single field which uses literal types which you can use to let TypeScript narrow down the possible current type. For example, we’re going to create a union of three types which have a single shared field.

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
type NetworkState = NetworkLoadingState | NetworkFailedState | NetworkSuccessState;
```

## Intersection Types

Intersection types are closely related to union types, but they are used very differently. An intersection type combines multiple types into one.

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

## Nullable Values

In TypeScript, the `null` and `undefined` types represent the absence of a value. By default, when you declare a variable without initializing it, it is assigned the value `undefined`. The `null` value is typically used to indicate that a variable intentionally has no value.

When you enable the `strictNullChecks` compiler option, TypeScript will not allow you to assign `null` or `undefined` to a variable unless you explicitly include them in the type.

`strictNullChecks` controls

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
let log: any = null; # (msg: string) =>{}

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

What it does:

```ts
const x = foo ?? "default";
0 || 42; # 42   (oops if 0 was a valid value)
"" || "abc"; # 'abc'
false || true; # true
```

<!-- First we need to know about falsy/truthy values -->

a ?? b returns:

a if a is not null or not undefined

otherwise, it returns b

This makes it a “null-or-undefined fallback,” not a “falsey fallback.”

## Type Assertion

`as` won't do the conversion; it just tells the compiler about the return type of that expression.

In other words, a type assertion tells the TypeScript compiler to treat a value as a specific type without changing the runtime value.

```ts
const value = something as MyType;
const value = <MyType>something;
```

The first form (as) is the modern standard.

## The Unknown Type

When we define a parameter with the `any` type, we basically bypass type checking.

But if we use `unknown`, we have to use type narrowing or type guards

```ts
function render(document: any) {
  document.x33(); # compilor wont complain about any types
}
```

```ts
  function render(document: unknown){
    // We need to use type narrowing with typeof or instanceof
    // Narrowing
    if(typeof document === 'string'){ # for primitives
      document.toUpperCase();
    }
    if(document instanceof WordDocument){ # for objects
      document.toUpperCase();
    }
  }
```

## The never Type

The never type in TypeScript is a tiny creature with a very specific job: it represents values that should not exist. Whenever TypeScript concludes “this code path can’t produce a value,” you get never.
It’s the type system’s way of yelling (politely): “If you ever reach this point, your logic is broken.”

```ts
function fail(message: string): never {
  throw new Error(message);
}
```

When TypeScript knows all possibilities have been excluded, the inferred type becomes never.

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

[OOP in Typescript](./../3-oop-with-typescript/oop-with-typescript.md)
