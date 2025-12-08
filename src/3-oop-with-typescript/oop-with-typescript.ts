/**
 * ============================================
 * OBJECT-ORIENTED PROGRAMMING WITH TYPESCRIPT
 * ============================================
 *
 * Topics:
 * - OOP basics
 * - Classes
 * - typeof vs instanceof
 * - const vs readonly
 * - Access control keywords (private / protected / public)
 * - Private vs protected members
 * - Constructor parameter properties
 * - Getters and setters
 * - Static members
 * - Index signatures
 * - Inheritance
 * - Polymorphism
 * - Abstract classes
 * - Interfaces
 */

// ============================================
// 1. OOP BASICS & CLASSES
// ============================================

/**
 * Traditional class declaration with explicit field initialization.
 * This is the verbose way of declaring a class in TypeScript.
 */
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

const userClass1 = new UserClass(1, "Alice", "Admin");
console.log("UserClass displayName:", userClass1.displayName);

// ============================================
// 2. CONSTRUCTOR PARAMETER PROPERTIES
// ============================================

/**
 * Using access modifiers in constructor parameters automatically
 * creates and initializes class properties.
 * This is a shorthand that reduces boilerplate code.
 *
 * - public id: creates a public property
 * - private name: creates a private property
 * - protected role: creates a protected property
 */
class User {
  constructor(
    public id: number,
    private name: string,
    protected role: string
  ) { }

  get displayName(): string {
    return `${this.role}: ${this.name}`;
  }
}

const user1 = new User(1, "Alice", "Admin");
console.log("User displayName:", user1.displayName);

// ============================================
// 3. TYPEOF VS INSTANCEOF
// ============================================

/**
 * typeof: Used to check primitive types at runtime.
 * Returns: 'string', 'number', 'boolean', 'bigint', 'symbol', 'undefined', 'function', 'object'
 */
function handleInput(input: string | number): string {
  if (typeof input === "string") {
    return input.toUpperCase();
  }
  return input.toFixed(2);
}

console.log("typeof demo - string:", handleInput("hello"));
console.log("typeof demo - number:", handleInput(42.5));

/**
 * instanceof: Used to check if an object was created by a specific class.
 * It walks the prototype chain to verify inheritance.
 */
function isUser(obj: unknown): obj is User {
  return obj instanceof User;
}

const unknownObj: unknown = new User(2, "Bob", "Editor");
if (isUser(unknownObj)) {
  console.log("instanceof check passed, object is User:", unknownObj.displayName);
}

// ============================================
// 4. CONST VS READONLY
// ============================================

/**
 * const: JavaScript runtime rule that prevents reassignment of a variable binding.
 * It does NOT prevent mutation of the object itself.
 */
const userObj = { name: "Masoud", age: 30 };
// userObj = { name: "other" }; // Error: reassignment not allowed
userObj.name = "Bimmer"; // OK: mutation is allowed
console.log("const demo - after mutation:", userObj);

/**
 * readonly: TypeScript compile-time rule that prevents mutation of properties.
 * It does NOT prevent reassignment (unlike const).
 */
class ConfigUser {
  readonly id: number;
  readonly name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

const configUser = new ConfigUser(1, "Charlie");
console.log("readonly demo - id:", configUser.id);
// configUser.id = 2; // Error: readonly property cannot be reassigned
// configUser.name = "David"; // Error: readonly property cannot be reassigned

// ============================================
// 5. ACCESS CONTROL KEYWORDS
// ============================================

/**
 * public: Accessible everywhere (default, can be omitted).
 * protected: Accessible in the class and in subclasses.
 * private: Accessible only inside the class where it is declared.
 */
class SecureUser {
  public username: string; // Accessible everywhere
  protected role: string; // Accessible in this class and subclasses
  private password: string; // Accessible only inside this class

  constructor(username: string, role: string, password: string) {
    this.username = username;
    this.role = role;
    this.password = password;
  }

  public updateUsername(newUsername: string): void {
    this.username = newUsername;
  }

  protected getRole(): string {
    return this.role;
  }

  private validatePassword(pw: string): boolean {
    return pw === this.password;
  }

  public authenticate(pw: string): boolean {
    return this.validatePassword(pw);
  }
}

const secureUser = new SecureUser("alice123", "admin", "secret123");
console.log("Access control - public member:", secureUser.username);
// console.log(secureUser.role); // Error: protected member
// console.log(secureUser.password); // Error: private member

// ============================================
// 6. PRIVATE VS PROTECTED MEMBERS
// ============================================

/**
 * private: Only accessible within the class itself.
 * protected: Accessible within the class and in subclasses.
 *
 * This demonstrates the difference when using inheritance.
 */
class BaseEntity {
  private internalId: string; // Only accessible here
  protected ownerName: string; // Accessible in subclasses

  constructor(internalId: string, ownerName: string) {
    this.internalId = internalId;
    this.ownerName = ownerName;
  }

  private getInternalId(): string {
    return this.internalId;
  }

  protected getOwner(): string {
    return this.ownerName;
  }
}

class ExtendedEntity extends BaseEntity {
  printOwner(): void {
    // Allowed: protected member is accessible in subclass
    console.log("Protected member access:", this.getOwner());
  }

  // Not allowed: private members cannot be accessed in subclasses
  // printInternalId(): void {
  //   console.log(this.getInternalId()); // Error
  // }
}

const extended = new ExtendedEntity("id-123", "John");
extended.printOwner();

// ============================================
// 7. GETTERS AND SETTERS
// ============================================

/**
 * Getters and setters provide controlled access to private properties.
 * They allow validation logic and computed properties.
 */
class Product {
  private _name: string;
  private _price: number;

  constructor(name: string, price: number) {
    this._name = name;
    this._price = price;
  }

  // Getter: provides read access with optional transformation
  get name(): string {
    return this._name;
  }

  // Setter: provides write access with validation logic
  set name(value: string) {
    if (!value || !value.trim()) {
      throw new Error("Product name cannot be empty.");
    }
    this._name = value;
  }

  get price(): number {
    return this._price;
  }

  set price(value: number) {
    if (value < 0) {
      throw new Error("Price cannot be negative.");
    }
    this._price = value;
  }

  toString(): string {
    return `${this._name} - $${this._price}`;
  }
}

const product = new Product("Keyboard", 79);
console.log("Getter demo:", product.name); // Access getter
product.name = "Mechanical Keyboard"; // Setter with validation
product.price = 99;
console.log("Getter/Setter demo:", product.toString());

// ============================================
// 8. STATIC MEMBERS
// ============================================

/**
 * Static members belong to the class itself, not to instances.
 * They are useful for:
 * - Counters
 * - Factory methods
 * - Utility functions
 * - Configuration that doesn't depend on instance state
 */
class Counter {
  private static _count: number = 0;

  public static increment(): void {
    Counter._count++;
  }

  public static get count(): number {
    return Counter._count;
  }

  public static reset(): void {
    Counter._count = 0;
  }

  constructor() {
    Counter.increment();
  }
}

const counter1 = new Counter();
const counter2 = new Counter();
console.log("Static members - count:", Counter.count); // 2
Counter.reset();
console.log("Static members - after reset:", Counter.count); // 0

// ============================================
// 9. INDEX SIGNATURES
// ============================================

/**
 * Index signatures allow dynamic property names with a known value type.
 * Useful when property names are not known ahead of time.
 */
interface ErrorMessages {
  [field: string]: string; // Any string key maps to a string value
}

const errors: ErrorMessages = {
  username: "Required",
  email: "Invalid email format",
  password: "Must be at least 8 characters",
};

errors["confirmPassword"] = "Passwords do not match";
console.log("Index signatures demo:", errors);

/**
 * Mixed defined properties and index signatures.
 * Defined properties take precedence.
 */
interface ApiResponse {
  status: number; // Known property
  [key: string]: number; // All other keys must have number values
}

const response: ApiResponse = {
  status: 200,
  totalItems: 42,
  pageNumber: 1,
};

console.log("Mixed index signature demo:", response);

// ============================================
// 10. INHERITANCE
// ============================================

/**
 * Inheritance allows a class to extend another class,
 * inheriting its properties and methods.
 * Use 'super()' to call the parent constructor.
 */
class BaseUser {
  constructor(
    public id: number,
    public name: string,
    public role: string
  ) { }

  get displayName(): string {
    return `${this.role}: ${this.name}`;
  }
}

class Employee extends BaseUser {
  employeeNumber: number | undefined;

  constructor(
    id: number,
    name: string,
    role: string = "Employee",
    employeeNumber?: number
  ) {
    super(id, name, role); // Call parent constructor
    this.employeeNumber = employeeNumber;
  }

  calculateSalary(): number {
    return 5000;
  }
}

const employee = new Employee(2, "Bob", "Developer", 12345);
console.log("Inheritance demo - displayName:", employee.displayName);
console.log("Inheritance demo - calculateSalary:", employee.calculateSalary());

// ============================================
// 11. POLYMORPHISM
// ============================================

/**
 * Polymorphism allows different classes to implement the same interface
 * or override shared behavior. This enables flexible, extensible code.
 */
interface PaymentMethod {
  pay(amount: number): void;
}

class CreditCard implements PaymentMethod {
  constructor(private cardNumber: string) { }

  pay(amount: number): void {
    console.log(`Paid $${amount} via credit card ending in ${this.cardNumber.slice(-4)}`);
  }
}

class PayPal implements PaymentMethod {
  constructor(private email: string) { }

  pay(amount: number): void {
    console.log(`Paid $${amount} via PayPal (${this.email})`);
  }
}

class ApplePay implements PaymentMethod {
  constructor(private deviceId: string) { }

  pay(amount: number): void {
    console.log(`Paid $${amount} via Apple Pay (Device: ${this.deviceId})`);
  }
}

// Polymorphic function that works with any PaymentMethod
function processPayment(method: PaymentMethod, amount: number): void {
  method.pay(amount);
}

const creditCard = new CreditCard("1234-5678-9012-3456");
const paypal = new PayPal("user@example.com");
const applePay = new ApplePay("device-001");

console.log("\nPolymorphism demo:");
processPayment(creditCard, 50);
processPayment(paypal, 75);
processPayment(applePay, 100);

// ============================================
// 12. ABSTRACT CLASSES
// ============================================

/**
 * Abstract classes define a template for subclasses.
 * They can contain both abstract methods (must be implemented) and concrete methods.
 * Cannot be instantiated directly.
 */
abstract class Animal {
  constructor(protected name: string) { }

  // Abstract method: must be implemented by subclasses
  abstract speak(): string;

  // Concrete method: can be used by all subclasses
  describe(): string {
    return `${this.name} is an animal`;
  }
}

class Dog extends Animal {
  override speak(): string {
    return `${this.name} says Woof!`;
  }
}

class Cat extends Animal {
  override speak(): string {
    return `${this.name} says Meow!`;
  }
}

// Using polymorphism with abstract classes
const animals: Animal[] = [
  new Dog("Rex"),
  new Cat("Whiskers"),
  new Dog("Buddy"),
];

console.log("\nAbstract classes demo:");
for (const animal of animals) {
  console.log(animal.speak());
  console.log(animal.describe());
}

// ============================================
// 13. INTERFACES
// ============================================

/**
 * Interfaces define the shape of an object.
 * They are purely for compile-time checking and do not exist at runtime.
 * Unlike abstract classes, interfaces cannot contain implementation.
 */
interface Movable {
  move(): void;
}

interface Drawable {
  draw(): void;
}

/**
 * A class can implement multiple interfaces.
 * An abstract class can also implement interfaces while providing partial implementation.
 */
abstract class Shape implements Drawable {
  abstract area(): number;

  draw(): void {
    console.log("Drawing shape...");
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  area(): number {
    return Math.PI * this.radius * this.radius;
  }
}

class Square extends Shape {
  constructor(private side: number) {
    super();
  }

  area(): number {
    return this.side * this.side;
  }
}

/**
 * Another interface example with abstract class implementing it.
 */
abstract class Vehicle implements Movable {
  constructor(protected brand: string) { }

  abstract move(): void;

  getBrand(): string {
    return this.brand;
  }
}

class Car extends Vehicle {
  override move(): void {
    console.log(`${this.brand} car drives on the road`);
  }
}

class Motorcycle extends Vehicle {
  override move(): void {
    console.log(`${this.brand} motorcycle rides fast`);
  }
}

console.log("\nInterfaces demo:");
const vehicles: Vehicle[] = [
  new Car("Toyota"),
  new Motorcycle("Harley-Davidson"),
  new Car("BMW"),
];

for (const vehicle of vehicles) {
  console.log(`Brand: ${vehicle.getBrand()}`);
  vehicle.move();
}

// ============================================
// KEY DIFFERENCES: INTERFACE vs ABSTRACT CLASS
// ============================================

/**
 * Runtime presence:
 * - Interface: Erased at runtime (only TypeScript compile-time)
 * - Abstract class: Exists at runtime as a class
 *
 * Implementation:
 * - Interface: Cannot contain implementation
 * - Abstract class: Can contain both abstract and implemented methods
 *
 * Constructor:
 * - Interface: No constructor
 * - Abstract class: Can have constructor
 *
 * Access modifiers:
 * - Interface: Members are public by default
 * - Abstract class: Can use private, protected, public
 *
 * Multiple inheritance:
 * - Interface: A class can implement many interfaces
 * - Abstract class: A class can extend only one
 *
 * Fields:
 * - Interface: Only type signatures
 * - Abstract class: Can have real fields with visibility modifiers
 */