# Object oriented Programming with Typescript

- OOP
- Classes
- Typeof/Instanceof
- Constructors / Constructor Parameter Properties
- Access Control Keywords (private / protected / public)
- Getters & Setters
- Static members
- Index Signature
- Inheritance
- Polymorphism
- Abstract classes
- Interfaces

## Object Oriented Programming

## Classes

The basic building block. TypeScript adds strong typing, visibility modifiers, and constructor shorthand.

```ts
class UserClass {
  id: number;
  name: string;
  role: string;
  constructor(id: number, name: string, role: string) {
    this.id = id;
    this.name = name;
    this.role = role;
  }

  get displayName(): string {
    return `${this.role}: ${this.name}`;
  }
}
```

and transpiled version to javascript is

```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
  id;
  name;
  role;
  constructor(id, name, role) {
    this.id = id;
    this.name = name;
    this.role = role;
  }
  get displayName() {
    return `${this.role}: ${this.name}`;
  }
}
const user1 = new User(1, "Alice", "Admin");
console.log(user1.displayName);
```

better version without redundancy is this:

```ts
class User {
  constructor(public id: number, public name: string, public role: string) {}

  get displayName(): string {
    return `${this.role}: ${this.name}`;
  }
}
```

## Typeof/Instanceof

### Summary

Use typeof when you check primitive types.
Use instanceof when you check class instances or objects created by constructors.

### When to use typeof

typeof only works reliably for primitive values:

- string
- number
- boolean
- bigint
- symbol
- undefined
- function

```ts
function handle(input: string | number) {
  if (typeof input === "string") {
    return input.toUpperCase();
  }
  return input.toFixed(2);
}
```

### When to use instanceof

instanceof checks whether an object was created by a specific class or constructor.

```ts
class User {
  /* ... */
}

function isUser(obj: unknown): obj is User {
  return obj instanceof User;
}
```

### why is works:

it checks the prototype chain

```ts
obj.__proto__ === Class.prototype;
```

So it only works for:

- real classes
- objects instantiated with new
- things sharing a prototype chain

## Const vs Readonly

The essential difference: They operate on different things and at different times.

- const is a JavaScript runtime rule.
- readonly is a TypeScript compile-time rule.

### const — prevents reassignment of a variable

const controls the binding, not the value inside it.

```ts
const user = { name: "Masoud" };

// ❌ Not allowed
user = { name: "Bimmer" };

// ✅ Allowed (mutation)
user.name = "Bimmer";
```

`const` does NOT make objects immutable. It only says: “This variable cannot point to another value.”

Use const for:

- function-scoped immutable bindings
- Angular constants (tokens, configs, utility objects)
- arrays or objects that shouldn't be reassigned, only mutated
- everything that is not meant to be reassigned (best practice)

### readonly — prevents mutation of properties

`readonly` is a TypeScript type-level constraint.
It stops you from modifying fields inside an object.

```ts
class User {
  readonly id: number;
  constructor(id: number) {
    this.id = id;
  }
}

const u = new User(1);

// ❌ Compile-time error
u.id = 2;
```

Use readonly for:

- immutability in domain models
- Angular Inputs
- DTOs fetched from API
- configuration objects in services
- NgRx state definitions (to prevent accidental mutation)
- preventing accidental mutation inside functions

## Access Control Keywords (private / protected / public)

Visibility modifiers in TypeScript—public, protected, private—are basically your guardrails for controlling how a class can be used. They don’t exist at runtime; they exist purely for the compiler to enforce architectural boundaries.
Think of them as instructions to future developers: “Touch this, but not that.”

public

- This is the default. Everything is public unless stated otherwise.
- Anyone can access this. Whether you should is another story.

private

- This makes a property accessible only inside the class where it’s declared.
- Not accessible in subclasses, outside consumers, anywhere except the class itself

protected

- Accessible inside the class and inside subclasses, but nowhere else.

## Inheritance

Classic “is-a” relationships.

expected class should be:

```ts
class Employee extends User {
  constructor(id: number, name: string, role = "Employee") {
    super(id, name, role);
  }

  calculateSalary(): number {
    return 5000;
  }
}
```

and transpiled version to javascript is

```js
class Employee extends User {
  constructor(id, name, role = "Employee") {
    super(id, name, role);
  }
  calculateSalary() {
    return 5000;
  }
}
```

Used when extending base logic makes sense.
But in modern Angular/TS, you avoid deep trees—composition is often cleaner.

## Polymorphism

Different classes implement the same interface or override shared behavior.

```ts
interface PaymentMethod {
  pay(amount: number): void;
}

class CreditCard implements PaymentMethod {
  pay(amount: number) {
    console.log(`Paid ${amount} via card`);
  }
}

class PayPal implements PaymentMethod {
  pay(amount: number) {
    console.log(`Paid ${amount} via PayPal`);
  }
}
```

This pattern is common in:

- strategy pattern (e.g., different state handlers)
- form serialization
- backend integration layers

## Abstraction (abstract classes & interfaces)

Abstract class → partial implementation
Interface → structure only

```ts
abstract class Shape {
  abstract area(): number;
}

class Circle extends Shape {
  constructor(private r: number) {
    super();
  }
  area() {
    return Math.PI * this.r * this.r;
  }
}
```

## Encapsulation

Control what can be accessed or modified.

```ts
class Counter {
  #value = 0; // JavaScript private field
  public inc() {
    this.#value++;
  }
  public getValue() {
    return this.#value;
  }
}
```

This prevents accidental misuse across your app.
