# Object-Oriented Programming with TypeScript

Topics covered:

- OOP basics
- Classes
- typeof vs instanceof
- const vs readonly
- Access control keywords (private / protected / public)
- Private vs protected members
- Constructor parameter properties
- Getters and setters
- Static members
- Index signatures
- Inheritance
- Polymorphism
- Abstract classes
- Interfaces

## Object-Oriented Programming

OOP organizes code around objects that bundle state and behavior. TypeScript layers static typing and visibility rules on top of JavaScript's prototype-based model to make those objects safer to use.

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

JavaScript output looks like:

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

## typeof vs instanceof

### Summary

- Use `typeof` for primitives.
- Use `instanceof` for class instances or objects created by constructors.

### When to use typeof

`typeof` only works reliably for primitive values:

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

`instanceof` checks whether an object was created by a specific class or constructor.

```ts
class User {
  /* ... */
}

function isUser(obj: unknown): obj is User {
  return obj instanceof User;
}
```

### Why it works

`instanceof` walks the prototype chain:

```ts
obj.__proto__ === Class.prototype;
```

So it only works for:

- real classes
- objects instantiated with `new`
- things sharing a prototype chain

## const vs readonly

The essential difference: they operate on different things and at different times.

- `const` is a JavaScript runtime rule.
- `readonly` is a TypeScript compile-time rule.

### const - prevents reassignment of a variable

`const` controls the binding, not the value inside it.

```ts
const user = { name: "Masoud" };

# Not allowed
# user = { name: "Bimmer" };

# Allowed (mutation)
user.name = "Bimmer";
```

`const` does NOT make objects immutable. It only says: this variable cannot point to another value.

Use `const` for:

- function-scoped immutable bindings
- arrays or objects that should not be rebound, only mutated
- anything that is not meant to be reassigned (best practice)

### readonly - prevents mutation of properties

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

# Compile-time error
# u.id = 2;
```

Use `readonly` for:

- immutability in domain models
- DTOs fetched from an API
- configuration objects in services
- preventing accidental mutation inside functions or state containers

## Access Control Keywords (private / protected / public)

Visibility modifiers in TypeScript (public, protected, private) are compile-time guardrails for controlling how a class can be used. They do not exist at runtime; they are enforced by the compiler to express intent.

All members are public by default.

public

- This is the default. Everything is public unless stated otherwise.
- Anyone can access this. Whether you should is another story.

private

- Accessible only inside the class where it is declared.
- Not accessible in subclasses, outside consumers, anywhere except the class itself.

protected

- Accessible inside the class and inside subclasses, but nowhere else.

```ts
class User {
  public name: string; # Accessible everywhere
  protected role: string; # Accessible in this class + subclasses
  private password: string; # Accessible only inside this class

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
    # Allowed: `role` is protected - accessible here
    console.log(`Role: ${this.role}`);
  }
}

const u = new User("Alice", "reader", "secret123");

# Allowed
console.log(u.name);
u.updateName("Alicia");

# Not allowed (compile-time errors):
# u.role;
# u.getRole();
# u.password;
# u.validatePassword("secret123");

const admin = new Admin("Bob", "pass123");
admin.printRole();
```

## Private vs Protected Members

- `private`: accessible only inside the class where it is declared.
- `protected`: accessible inside the class and inside subclasses.

Both hide internal details, but `protected` creates an inheritance-friendly API, while `private` creates a hard boundary.

## Constructor Parameter Properties

Parameter properties let you declare and initialize members right in the constructor signature.

```ts
class User {
  constructor(public id: number, protected name: string, private role: string) {}

  get displayName(): string {
    return `${this.role}: ${this.name}`;
  }
}
```

They reduce boilerplate, but be careful not to accidentally shadow fields by redeclaring them in subclasses.

## Getters & Setters

Why getters and setters are useful:

- `_name` and `_price` are private, guaranteeing invariants.
- Getters and setters provide controlled access with validation.
- The class surface stays minimal and predictable.

```ts
class Product {
  # Private fields ensure encapsulation
  private _name: string;
  private _price: number;

  constructor(name: string, price: number) {
    this._name = name;
    this._price = price;
  }

  # Public getter
  public get name(): string {
    return this._name;
  }

  # Public setter with validation logic
  public set name(value: string) {
    if (!value.trim()) {
      throw new Error("Product name cannot be empty.");
    }
    this._name = value;
  }

  # Getter for price
  public get price(): number {
    return this._price;
  }

  # Setter with guard
  public set price(value: number) {
    if (value < 0) {
      throw new Error("Price cannot be negative.");
    }
    this._price = value;
  }

  public toString(): string {
    return `${this._name} - $${this._price}`;
  }
}

const product = new Product("Keyboard", 79);

console.log(product.name); # Access getter
product.name = "Mechanical Keyboard"; # Setter with validation

console.log(product.price);
product.price = 99;

console.log(product.toString());

# Not allowed (private):
# product._name;
# product._price;
```

## Index Signature

Index signatures are TypeScript's way of saying: this object can have dynamic keys, and here is the shape of the values behind those keys.
They are useful when you do not know all property names ahead of time but you can describe the type pattern.

```ts
# This means: any string key is allowed, and its value must be a number.
type MyMap = {
  [key: string]: number;
};
```

More practical example:

```ts
interface ErrorMessages {
  [field: string]: string; # index signature
}

const errors: ErrorMessages = {
  username: "Required",
  email: "Invalid format",
  password: "Too short",
};

# Allowed
errors["confirmPassword"] = "Mismatch";

# Not allowed
# errors.count = 5; # number is not assignable to string
```

### Mixed defined properties + index signature

```ts
interface ApiResponse {
  status: number; # known property
  [key: string]: number; # dynamic properties must also be number
}

const res: ApiResponse = {
  status: 200,
  items: 42, # allowed
  total: 100, # allowed
};
```

### When not to use index signatures

1. Prefer `Record<Key, Value>` when keys are unknown but consistent:

```ts
type Scores = Record<string, number>;
```

2. Prefer mapped types when keys are known:

```ts
type UserRoles = "admin" | "editor" | "viewer";

type Permissions = {
  [R in UserRoles]: boolean;
};
```

Index signatures are best when property names are truly unknown.

## Static Members

Static members belong to the class itself, not to any instance. They work well for utilities, counters, factory methods, and configuration that should not depend on instance state.

```ts
class Counter {
  private static _count = 0; # private static field

  public static increment(): void {
    Counter._count++;
  }

  public static get count(): number {
    # static getter
    return Counter._count;
  }

  public static reset(): void {
    Counter._count = 0;
  }

  constructor() {
    Counter.increment(); # accessing static member
  }
}

const a = new Counter();
const b = new Counter();

console.log(Counter.count); # 2

Counter.reset();
console.log(Counter.count); # 0
```

## Inheritance

Classic "is-a" relationships. Extend a base class when sharing behavior makes sense.

```ts
class User {
  constructor(public id: number, public name: string, public role: string) {}

  get displayName(): string {
    return `${this.role}: ${this.name}`;
  }
}

class Employee extends User {
  constructor(id: number, name: string, role = "Employee", public employeeNumber?: number) {
    super(id, name, role);
  }

  calculateSalary(): number {
    return 5000;
  }
}

const employee1 = new Employee(2, "Bob");
console.log(employee1.displayName);
console.log(employee1.calculateSalary());
```

Adding access modifiers to constructor parameters implicitly creates class properties.
This can unintentionally hide state, cause incorrect overriding in subclasses,
or introduce subtle bugs related to construction order.
It looks concise, but it undermines safe inheritance.
Therefore, avoid using access modifiers on parameters passed to `super` from a subclass constructor.

Keep inheritance shallow in most codebases; composition often stays simpler.

## Polymorphism

Different classes implement the same interface or override shared behavior.
Polymorphism keeps code open for extension and closed for modification (Open/Closed Principle).

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

Another example:

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

## Abstraction (abstract classes and interfaces)

- Abstract class: partial implementation plus shared behavior.
- Interface: shape only.

```ts
abstract class Shape {
  abstract area(): number; # area should be marked as abstract to tell the compiler that it is not implemented here
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
a.move(); # Dog runs
a.describe(); # Rex is alive
```

### Key differences (concise)

- Runtime presence: Interface is erased; abstract class is emitted as a class.
- Implementation: Interface cannot contain implementation; abstract class can.
- Constructor: Interface has none; abstract class can have one but cannot be instantiated directly.
- Access modifiers: Interface members are public by default; abstract classes can use private/protected/public.
- Multiple inheritance: A class can implement many interfaces; it can extend only one abstract/base class.
- Fields: Interface has only type signatures; abstract class can declare real fields (including readonly and visibility).

[Generics In Typescript](./../4-generics-with-typescript/generic-with-typescript.md)
