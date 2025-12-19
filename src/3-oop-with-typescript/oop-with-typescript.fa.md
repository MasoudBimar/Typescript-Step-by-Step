# برنامه‌نویسی شیءگرا با TypeScript

موارد پوشش‌داده‌شده:

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

## برنامه‌نویسی شیءگرا

OOP کد را حولِ اشیائی سازمان‌دهی می‌کند که وضعیت (state) و رفتار (behavior) را گرد هم می‌آورند. TypeScript با افزودن نوع‌دهی ایستا و قوانین دسترسی، لایه‌ای از ایمنی روی مدل مبتنی بر prototype در JavaScript می‌گذارد تا استفاده از این اشیاء ایمن‌تر شود.

## کلاس‌ها

کلاس‌ها بلوک‌های سازندهٔ اصلی در OOP هستند. TypeScript انواع قوی، اصلاح‌کننده‌های دید (visibility modifiers) و نوشتار کوتاه برای سازنده را اضافه می‌کند.

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

### خلاصه

- از `typeof` برای مقادیر اولیه (primitives) استفاده کنید.
- از `instanceof` برای نمونه‌های کلاس یا اشیائی که با سازنده‌ها ایجاد شده‌اند استفاده کنید.

### چه زمانی از `typeof` استفاده کنیم

عملگر `typeof` به‌طور قابل‌اعتماد تنها برای مقادیر اولیه کار می‌کند:

- string
- number
- boolean
- bigint
- symbol
- undefined
- function

مثال:

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

تفاوت اصلی: این دو در سطوح مختلف و زمان‌های متفاوت اعمال می‌شوند.

- `const` یک قاعدهٔ زمان اجرا در JavaScript است.
- `readonly` یک قاعدهٔ زمان کامپایل در TypeScript است.

### `const` — جلوگیری از مقداردهی مجدد متغیر

`const` انتساب (binding) را کنترل می‌کند، نه مقدار داخل آن را.

```ts
const user = { name: "Masoud" };

# Not allowed
# user = { name: "Bimmer" };

# Allowed (mutation)
user.name = "Bimmer";
```

`const` اشیاء را immutable نمی‌کند؛ فقط می‌گوید این متغیر نمی‌تواند به مقدار دیگری اشاره کند.

موارد استفادهٔ `const`:

- بایندینگ‌های غیرقابل‌تغییر در حوزهٔ تابع
- آرایه‌ها یا اشیائی که نباید rebound شوند، اما ممکن است تغییر یابند
- هر چیزی که قرار نیست مقداردهی مجدد شود (به‌عنوان بهترین شیوه)

### `readonly` — جلوگیری از تغییر خواص

`readonly` یک قید در سطح نوع (type-level constraint) در TypeScript است.
این قید از تغییر فیلدهای داخل یک شیء جلوگیری می‌کند.

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

## اعضای `private` در برابر `protected`

- `private`: تنها داخل همان کلاسی که اعلام شده قابل دسترسی است.
- `protected`: داخل کلاس و در زیرکلاس‌ها قابل دسترسی است.

هر دو جزئیات داخلی را مخفی می‌کنند، اما `protected` یک API سازگار با ارث‌بری فراهم می‌آورد در حالی که `private` یک مرز سخت ایجاد می‌کند.

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

آنها سربار کد را کاهش می‌دهند؛ اما مراقب باشید که با اعلام مجدد فیلدها در زیرکلاس‌ها به‌طور ناخواسته فیلدها را shadow نکنید.

## Getters و Setters

چرا getters و setters مفید هستند:

- `_name` و `_price` خصوصی هستند و تضمین‌کنندهٔ برقرار ماندن ناهمخوانی‌ها (invariants) است.
- getters و setters دسترسی کنترل‌شده همراه با اعتبارسنجی را فراهم می‌کنند.
- سطح API کلاس کوچک و قابل‌پیش‌بینی باقی می‌ماند.

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

## امضای ایندکس (Index Signature)

Index signature راه TypeScript برای بیان این است: این شیء می‌تواند کلیدهای پویا داشته باشد و این شکلِ نوعِ مقادیرِ مرتبط با آن کلیدها است.
این زمانی مفید است که همهٔ نام‌های خواص را از پیش نمی‌دانید اما می‌توانید الگوی نوع را توصیف کنید.

```ts
# This means: any string key is allowed, and its value must be a number.
type MyMap = {
  [key: string]: number;
};
```

مثال عملی‌تر:

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

### چه زمانی از index signature استفاده نکنیم

1. وقتی کلیدها ناشناخته اما یکنواخت هستند، بهتر است از `Record<Key, Value>` استفاده کنید:

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

Index signatureها زمانی بهترین هستند که نام خواص واقعاً ناشناخته باشند.

## اعضای استاتیک (Static Members)

اعضای استاتیک به خودِ کلاس تعلق دارند، نه به هیچ نمونه‌ای. این اعضا برای ابزارهای کمکی، شمارنده‌ها، متدهای کارخانه‌ای و پیکربندی‌هایی که نباید به وضعیت یک نمونه وابسته باشند، مناسب‌اند.

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

## ارث‌بری (Inheritance)

روابط کلاسیک «is-a». زمانی که اشتراک‌گذاری رفتار منطقی است از یک کلاس پایه مشتق (extend) کنید.

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

اضافه کردن اصلاح‌کننده‌های دسترسی (access modifiers) به پارامترهای سازنده به‌طور ضمنی خصوصیات کلاس را ایجاد می‌کند.
این می‌تواند به‌طور ناخواسته وضعیت را مخفی کند، باعث override نادرست در زیرکلاس‌ها شود یا باگ‌های ظریف مربوط به ترتیب ساخت را معرفی کند.
اگرچه این نوشتار کوتاه به‌نظر می‌رسد، اما ایمنی ارث‌بری را تضعیف می‌کند.
بنابراین از استفاده از access modifierها روی پارامترهایی که به `super` در سازندهٔ زیرکلاس ارسال می‌شوند خودداری کنید.

در بیشتر کدبیس‌ها ارث‌بری را کم‌عمق نگه دارید؛ ترکیب (composition) معمولاً ساده‌تر می‌ماند.

## چندریختی (Polymorphism)

کلاس‌های مختلف می‌توانند همان interface را پیاده‌سازی کنند یا رفتار مشترک را override نمایند.
Polymorphism کد را برای توسعه باز و برای تغییر بسته نگه می‌دارد (اصل Open/Closed).

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

## انتزاع (Abstraction — کلاس‌های abstract و Interfaces)

- Abstract class: پیاده‌سازی جزئی به‌علاوه رفتار مشترک.
- Interface: فقط شکلِ نوع (shape) را مشخص می‌کند.

```ts
abstract class Shape {
  abstract area(): number; # باید به‌عنوان abstract علامت‌گذاری شود تا به کامپایلر بگوییم اینجا پیاده‌سازی ندارد
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

### تفاوت‌های کلیدی (مختصر)

- حضور در زمان اجرا: Interface حذف می‌شود؛ اما abstract class به‌صورت یک کلاس در خروجی ظاهر می‌شود.
- پیاده‌سازی: Interface نمی‌تواند پیاده‌سازی داشته باشد؛ اما abstract class می‌تواند.
- سازنده: Interface سازنده ندارد؛ abstract class می‌تواند داشته باشد اما نمی‌توان آن را مستقیماً نمونه‌سازی کرد.
- اصلاح‌کننده‌های دسترسی: اعضای Interface به‌صورت پیش‌فرض public هستند؛ abstract class می‌تواند از private/protected/public استفاده کند.
- وراثت چندگانه: یک کلاس می‌تواند چندین Interface را پیاده‌سازی کند؛ اما تنها می‌تواند از یک abstract/base class ارث ببرد.
- فیلدها: Interface تنها امضای نوع دارد؛ abstract class می‌تواند فیلدهای واقعی (از جمله readonly و با سطح دسترسی) اعلام کند.

[Generics In Typescript](./../4-generics-with-typescript/generic-with-typescript.fa.md)
