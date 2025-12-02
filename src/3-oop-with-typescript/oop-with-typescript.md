# Object oriented Programming with Typescript

- OOP
- Classes
- Typeof vs Instanceof
- Const vs Readonly
- Access Control Keywords (private / protected / public)
- Private vs Protected Members
- Constructors / Constructor Parameter Properties
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

### why it works

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

All this properties are public by default.

public

- This is the default. Everything is public unless stated otherwise.
- Anyone can access this. Whether you should is another story.

private

- This makes a property accessible only inside the class where it’s declared.
- Not accessible in subclasses, outside consumers, anywhere except the class itself

protected

- Accessible inside the class and inside subclasses, but nowhere else.

```ts
class User {
  public name: string; // Accessible everywhere
  protected role: string; // Accessible in this class + subclasses
  private password: string; // Accessible only inside this class

  constructor(name: string, role: string, password: string) {
    this.name = name;
    this.role = role;
    this.password = password;
  }

  public updateName(newName: string): void {
    this.name = newName;
  }

  protected getRole(): string {
    return this.role;
  }

  private validatePassword(pw: string): boolean {
    return pw === this.password;
  }
}

class Admin extends User {
  constructor(name: string, password: string) {
    super(name, "admin", password);
  }

  public printRole(): void {
    // Allowed: `role` is protected → accessible here
    console.log(`Role: ${this.role}`);
  }
}

const u = new User("Alice", "reader", "secret123");

// Allowed
console.log(u.name);
u.updateName("Alicia");

// Not allowed (compile-time errors):
// u.role;
// u.getRole();
// u.password;
// u.validatePassword("secret123");

const admin = new Admin("Bob", "pass123");
admin.printRole();
```

## Private vs Protected Members

### private

Accessible only inside the class where it is declared.

### protected

Accessible inside the class AND inside subclasses.

Both hide internal details, but protected creates an inheritance-friendly API, while private creates a hard boundary.

## Parameter Properties

```ts
class User {
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

// this is the better version with Typescript feature called Parameter Properties

class User {
  constructor(public id: number, protected name: string, private role: string) {}

  get displayName(): string {
    return `${this.role}: ${this.name}`;
  }
}
```

## Getters & Setters

Why using Getters & Setters is clean

- \_name and \_price are private, guaranteeing invariants.
- Getters and setters provide controlled access with validation.
- The class surface stays minimal and predictable.
- Works naturally with frameworks like Angular, where computed values or validation logic often go into getters/setters.

```ts
class Product {
  // Private fields ensure encapsulation
  private _name: string;
  private _price: number;

  constructor(name: string, price: number) {
    this._name = name;
    this._price = price;
  }

  // Public getter
  public get name(): string {
    return this._name;
  }

  // Public setter with validation logic
  public set name(value: string) {
    if (!value.trim()) {
      throw new Error("Product name cannot be empty.");
    }
    this._name = value;
  }

  // Getter for price
  public get price(): number {
    return this._price;
  }

  // Setter with guard
  public set price(value: number) {
    if (value < 0) {
      throw new Error("Price cannot be negative.");
    }
    this._price = value;
  }

  public toString(): string {
    return `${this._name} — €${this._price}`;
  }
}

const product = new Product("Keyboard", 79);

console.log(product.name); // Access getter
product.name = "Mechanical Keyboard"; // Setter with validation

console.log(product.price);
product.price = 99;

console.log(product.toString());

// Not allowed (private):
// product._name;
// product._price;
```

## Index Signature

Index signatures are TypeScript’s way of saying: “This object can have dynamic keys, and here’s the shape of the values behind those keys.”
They’re useful when you don’t know all property names ahead of time but you can describe the type pattern.

```ts
// This means: any string key is allowed, and its value must be a number.
type MyMap = {
  [key: string]: number;
};
```

More Practical Example:

```ts
interface ErrorMessages {
  [field: string]: string; // index signature
}

const errors: ErrorMessages = {
  username: "Required",
  email: "Invalid format",
  password: "Too short",
};

// Allowed
errors["confirmPassword"] = "Mismatch";

// Not allowed
// errors.count = 5;          // ❌ number is not assignable to string
```

Moxed defined propeties + index signature

```ts
interface ApiResponse {
  status: number; // known property
  [key: string]: number; // dynamic properties must also be number
}

const res: ApiResponse = {
  status: 200,
  items: 42, // allowed
  total: 100, // allowed
};
```

### When not to use index signatures

1. TypeScript has improved alternatives: `Record<Key, Value>;`

```ts
type Scores = Record<string, number>;
```

2. Mapped types (much safer when keys are known):

```ts
type UserRoles = "admin" | "editor" | "viewer";

type Permissions = {
  [R in UserRoles]: boolean;
};
```

Index signatures are best when property names are truly unknown.

## Static Members

Static members are the pieces of a class that belong to the class itself, not to any instance. Think of them as shared tools sitting on the class’s shelf, untouched by the quirks of individual objects.

They’re great for utilities, counters, factory methods, configuration, and anything that shouldn’t depend on instance state.

```ts
class Counter {
  private static _count = 0; // private static field

  public static increment(): void {
    Counter._count++;
  }

  public static get count(): number {
    // static getter
    return Counter._count;
  }

  public static reset(): void {
    Counter._count = 0;
  }

  constructor() {
    Counter.increment(); // accessing static member
  }
}

const a = new Counter();
const b = new Counter();

console.log(Counter.count); // 2

Counter.reset();
console.log(Counter.count); // 0
```

## Inheritance

Classic “is-a” relationships.

expected class should be:

```ts
class User {
  constructor(public id: number, public name: string, public role: string) {}

  get displayName(): string {
    return `${this.role}: ${this.name}`;
  }
}

// Putting access modifiers directly on constructor parameters in a class creates new properties, and subclasses may shadow, override incorrectly, or accidentally depend on construction order.
// It looks concise, but it hides real state and breaks safe inheritance.
// So we dont need access modifiers on params we pass to super through childs constructor

class Employee extends User {
  // so we have employeeNumber with access modifier
  // and the rest of params came without any modifiers
  constructor(public employeeNumber: number, id: number, name: string, role) {
    super(id, name, role);
  }

  calculateSalary(): number {
    return 5000;
  }
}
```

Used when extending base logic makes sense.
But in modern Angular/TS, you avoid deep trees—composition is often cleaner.

## Polymorphism

Different classes implement the same interface or override shared behavior.
Polymorphism is a way to keep classes open for extenstion and close for modification(Open Close Priciple)

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

Another example

```ts
abstract class Animal {
  abstract speak(): string;
}

class Dog extends Animal {
  override speak(): string {
    return "Woof";
  }
}

class Cat extends Animal {
  override speak(): string {
    return "Meow";
  }
}

const pets: Animal[] = [new Dog(), new Cat()];

for (const p of pets) {
  console.log(p.speak());
}
```

## Abstraction (abstract classes & interfaces)

Abstract class → partial implementation
Interface → structure only

```ts
abstract class Shape {
  abstract area(): number; // area should be marked as abstract for tellimg the compiler that its not ready
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }
  area() {
    return Math.PI * this.radius * this.radius;
  }
}
```

```ts
interface Movable {
  move(): void;
}

abstract class Animal implements Movable {
  constructor(protected name: string) {}

  abstract move(): void;

  public describe(): string {
    return `${this.name} is alive`;
  }
}

class Dog extends Animal {
  override move(): void {
    console.log("Dog runs");
  }
}

const a: Animal = new Dog("Rex");
a.move(); // Dog runs
a.describe(); // Rex is alive
```

Key Differences (Concise + Precise)
Exists at runtime?

- Interface: erased at compile time → no JS output
- Abstract class: becomes a real JS class

Can contain implementation?

- Interface: ❌ no
- Abstract class: ✔ yes

Can have constructor?

- Interface: ❌
- Abstract class: ✔

Supports access modifiers?

- Interface: ❌ no private/protected
- Abstract class: ✔ private, protected, public

Multiple inheritance?

- Interface: ✔ a class can implement multiple interfaces
- Abstract class: ❌ only one parent class allowed

Field declarations?

- Interface: only type signatures
- Abstract class: real fields, readonly, visibility, etc.
