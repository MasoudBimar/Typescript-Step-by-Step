# Generic With Typescript

- چیست؟ چرا؟ کجا؟
- کلاس‌های جنریک
- توابع جنریک
- رابط‌های جنریک
- محدودیت‌های جنریک
- توسعه کلاس‌های جنریک
- نقشه‌برداری نوع

## چیست؟ چرا؟ کجا؟

### Generic‌ها چیستند؟

Generic یک پارامتر نوع است — مانند یک متغیر برای انواع.

وقتی یک تابع یا کلاس می‌نویسید، به‌جای التزام به یک نوع خاص `(string، number، YourType)`، می‌گویید:

```ts
function wrap<T>(value: T) {
  return { value };
}
```

اینجا `T` یک جای‌نگین است. تابع برای مقدار مهم نیست؛ فقط وعده می‌دهد نوع آن را ثابت نگه دارد.

این همان ایده‌ای است که در جبر داریم: `f(x) = x²` نیازی ندارد بداند x چیست، تنها اینکه `x` در داخل تابع به‌طور مسلسل رفتار کند.

### چرا به `Generics` نیاز داریم?

`Generics` در TypeScript یک مشکل تکراری را حل می‌کند: قابل‌استفاده‌بودن بدون از دست دادن ایمنی نوع.

بدون `Generics،` توابعی که برای "هر نوعی" کار کنند باید به any برگردند، که اساساً یک درب فرار است که تضمین‌های ایمنی را می‌شکند.

`Generics` اجازه می‌دهد تا بسازید:

- API‌های قابل‌استفاده بدون قربانی کردن دقت.
- زنجیره‌های روان تبدیل‌ها جایی که نوع با داده "جریان می‌یابد".
- قرارداد‌هایی که به انواع دیگری وابسته‌اند.

نمونه‌های مسائل حل‌شده توسط `Generics`:

- نگاشت مقادیر در حالی که شکل یکسان می‌ماند.
- بیان "یک وعده از X".
- ایجاد مجموعه‌ها `(Array<T>, Map<K, V>)`.
- اعمال روابط بین انواع متعدد.

آنها یک زبان ریاضیاتی برای بیان محدودیت‌ها در کد هستند.

### `Generics` کجا استفاده می‌شود?

تقریباً در هر جایی که یک الگو به نوعی که کاربر تابع انتخاب می‌کند وابسته است.

اینجا جاهای معمول هستند:

`Functions`

```ts
function identity<T>(value: T): T {
  return value;
}
```

`Classes`

```ts
class Box<T> {
  constructor(public content: T) {}
}
```

`Interfaces`

```ts
interface ApiResponse<T> {
  data: T;
  error?: string;
}
```

`Utility Types`

```ts
type Maybe<T> = T | null | undefined;
```

`Constraints`

```ts
function logLength<T extends { length: number }>(item: T) {
  console.log(item.length);
}
```

## کلاس‌های جنریک

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

نمونه دیگر:

```ts
class KeyValuePair<K, V> {
  constructor(
    public key: K,
    public value: V,
  ) {}
}

let pair = new KeyValuePair<string, number>("1", 123);
let pair2 = new KeyValuePair("1", 123); // بدون تامین آرگومان‌های نوع جنریک، کامپایلر انواع را بر اساس پارامترهای سازنده استنتاج می‌کند
```

## توابع جنریک

یک تابع با پارامترهای نوع — معمولاً به‌صورت `<T>, <T, U>,` و غیره نوشته می‌شود.
این پارامترها مانند متغیرهای انواع رفتار می‌کنند، نه برای مقادیر.

`T` هر نوعی را که فراخوان آن منتقل می‌کند می‌گیرد، و تابع همان نوع را برمی‌گرداند.
هیچ جادویی نیست — فقط وعده‌ای برای سازگاری.

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

## رابط‌های جنریک

رابط‌های جنریک کجا استفاده می‌شود؟

- ظروف داده

  ```ts
  interface Result<T> {
    data: T;
    error?: string;
  }

  const r: Result<User> = { data: { name: "Jon" } };
  ```

- پاسخ‌های HTTP

  ```ts
  interface ApiResponse<T> {
    payload: T;
    status: number;
  }
  ```

- مجموعه‌ها و واژه‌نامه‌ها

  ```ts
  interface Dictionary<T> {
    [key: string]: T;
  }

  const scores: Dictionary<number> = { alice: 10 };
  ```

- امضای توابع

  ```ts
  interface Transformer<T, R> {
    (input: T): R;
  }

  const toLength: Transformer<string, number> = (s) => s.length;
  ```

- محدودیت‌ها

```ts
interface NamedEntity {
  name: string;
}

interface Store<T extends NamedEntity> {
  add(item: T): void;
  get(name: string): T | undefined;
}
```

## محدودیت‌های جنریک

### محدودیت‌های جنریک چیستند؟

محدودیت یک قاعده‌ای است که بر روی یک پارامتر نوع قرار می‌گیرد، به این‌صورت نوشته می‌شود:

```ts
<T extends SomeType>

```

`extends` اینجا به معنی "T باید قابل اختصاص به این نوع باشد" است — نه وراثت.

ما می‌توانیم بر اساس Interface یا کلاس محدود کنیم.

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

### چرا از محدودیت‌ها استفاده کنیم؟

آنها مسئله توابع جنریک را حل می‌کنند که به عملیات خاصی نیاز دارند.

بدون محدودیت‌ها، `TypeScript` دسترسی به ویژگی یا استفاده از روش را اجازه نمی‌دهد:

```ts
function fail<T>(x: T) {
  return x.length; # خطا — T می‌تواند هر چیزی باشد
}
```

با محدودیت‌ها

```ts
function ok<T extends { length: number }>(x: T) {
  return x.length; # محفوظ
}
```

### محدود کردن به Objects، Classes و Unions یا حتی شکل یک object

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

## توسعه کلاس های جنریک

```ts
interface User {
  name: string;
  ssn: number;
}

class Store<T> {
  protected items: T[] = []; # اگر قصد ارث‌بری داریم باید private یا protected باشد

  add(value: T): void {
    this.items.push(value);
  }
}

let store = new Store<User>();

// عبور دادن پارامتر نوع جنریک
class CompressibleStore<T> extends Store<T> {
  compress() {}
}

let store = new CompressibleStore<User>();
store.compress();

// محدود کردن پارامتر نوع جنریک
class SearchableStore<T extends { name: string }> extends Store<T> {
  find(name: string): T | undefined {
    return this.items.find((obj) => obj.name === name); // ما باید از محدودیت‌ها استفاده کنیم تا ویژگی `name` را به T اضافه کنیم
  }
}

// تعیین پارامتر نوع جنریک
class UserStore<User> extends Store<User> {
  filterByCategory(category: string): User[] {
    return [];
  }
}
```

## عملگر `keyof`

عملگر `keyof` یک نوع `object` را می‌گیرد و یک `union` از `string` یا `literal` عددی کلیدهایش تولید می‌کند. نوع P زیر همان نوع `type P = "x" | "y"` است:

```ts
type Point = { x: number; y: number };
type P = keyof Point;
```

اگر نوع یک اِمضای `index string` یا `number` داشته باشد، `keyof` در عوض آن انواع را برمی‌گرداند:

```ts
class SearchableStore<T extends { name: string }> extends Store<T> {
  // اگر ویژگی از نوع string استفاده کند، این خطا را دریافت می‌کنیم:
  // "No index signature with a parameter of type 'string' was found on type"
  // ما باید به کامپایلر بگوییم ما از index signature استفاده نمی‌کنیم،
  // بلکه ویژگی‌های واقعی از نوع T هستند.
  // عملگر keyof union ویژگی‌های نوع داده‌شده را برمی‌گرداند
  find(property: keyof T, value: unknown): T | undefined {
    return this.items.find((obj) => obj[property] === value);
  }
}
```

## نقشه‌برداری نوع

گاهی اوقات یک نوع باید بر اساس نوع دیگری باشد، بنابراین تکرار خصوصیات دقیق باعث تکرار می‌شود.

با نقشه‌برداری نوع، ما می‌توانیم بر روی ویژگی‌های یک نوع و انواع آنها تکرار کنیم و نوع دیگری با برخی تحریف‌ات ایجاد کنیم.

- نوع مبنا => نسخه `readonly`
- نوع مبنا => نسخه ای که تمام ویژگی‌ها الزامی است
- نوع مبنا => نسخه اختیاری

مرحله اول: ایجاد نوعی بر اساس دیگری با استفاده از نقشه‌برداری نوع:

```ts
interface User {
  id: number;
  name: string;
  birthDate: Date;
}

type ReadonlyUser = {
  // index signature & keyof
  readonly [Property in keyof User]: User[Property];
  // سمت چپ: بر روی تمام ویژگی‌های User با استفاده از index signature & keyof تکرار کنید
  // سمت راست: نوع ویژگی متناظر را دریافت کنید
};
```

مرحله بعدی: نام ویژگی را به `K` تغییر دهید و آن را جنریک کنید:

```ts
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

let newUser: Readonly<User> = {
  id: 2,
  name: "Masoud",
  birthDate: new Date(),
};

newUser.name = "somethingElse"; // خطا: نمی‌توان به 'name' اختصاص داد زیرا یک ویژگی read-only است
```

همان‌طور که برای `Optional` است,

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

### چون این انواع بسیار مفید هستند، در `TypeScript` داخل‌سازی شده‌اند

انواع `Utility` در `Typescript`

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

[انواع `Utility` در `Typescript`](https://www.typescriptlang.org/docs/handbook/utility-types.html)

بخش بعدی: [Decorators In Typescript](./../5-decorators-in-typescript/decorators-in-typescript.fa.md)
