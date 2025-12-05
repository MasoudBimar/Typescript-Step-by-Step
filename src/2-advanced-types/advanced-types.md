# Typescript Advanced Types

- Type aliases
- Unions and intersections
- Type narrowing
- Nullable types
- The unknown type
- The never type

## Type Aliases & Interfaces

Here we compare types with interfaces

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

what is the type narrowing:

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
drag: () => void
}

type Resizable = {
resize: () => void
}

type UIWidget = Draggable & Resizable;

let textBox: UIWidget = {
resize: ()=> {};
drag: () => {}

}
```

## Literal Types

There are three sets of literal types available in TypeScript: strings, numbers, and booleans; by using literal types you can allow an exact value which a string, number, or boolean must have.

```ts
type percent = 3 | 6 | 9; // Cannot be any number other than 3,6,9
type Metric = "cm" | "inch";
```

## Nuulable Values

Instead of disabling `strictNullChecks`, we should explicitly include null or undefined in the types when needed

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

## Nullish Coalescing Opeator

What it does:

```ts
const x = foo ?? "default";
0 || 42; // 42   (oops if 0 was a valid value)
"" || "abc"; // 'abc'
false || true; // true
```

<!-- First we need to know about falsy/truthy values -->

a ?? b returns:

a if a is not null or not undefined

otherwise, it returns b

This makes it a “null-or-undefined fallback,” not a “falsey fallback.”

## Type Assertion

`as` wont do the conversion it just tell the compiler about return type of that expression

In other word, A type assertion tells the TypeScript compiler to treat a value as a specific type without changing the runtime value.

```ts
const value = something as MyType;
const value = <MyType>something;
```

The first form (as) is the modern standard.

## The Unknown Type

Assume we have a parameter defining a parameter with any type we basically bypass the type checking.

but if we use `unknown`, we have to use type narrowing or type guards

```ts
function render(document: any) {
  document.x33(); // compilor wont complain about any types
}
```

```ts
  function render(document: unknown){
    // we either need to use type narrowing with typeOf or instnaceOf
    // Narrowing
    if(document typeof === 'string'){ // for primitives
      document.toUpperCase();
    }
    if(document instanceof === WordDocument){ // for objects
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

we need to set never explicitly because sometime typescript compiler infer the return type as void

[OOP in Typescript](./../3-oop-with-typescript/oop-with-typescript.md)
