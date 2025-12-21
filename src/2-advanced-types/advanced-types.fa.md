# انواع پیشرفته در TypeScript

- Type aliases
- Unions and intersections
- Type narrowing
- Nullable types
- The unknown type
- The never type

## تفاوت اینترفیس ها و تایپ الیاس ها Type Aliases & Interfaces

بیایید `Type Aliases` و `Interfaces` را با هم مقایسه کنیم

### تایپ الیاس ها (مستعار) Type Aliases

`Type Aliases` اجازه می‌دهند نوع‌هایی با نام دلخواه تعریف کنید `(Alias)`.

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

### اینترفیس ها Interfaces

`Interfaces` مشابه `Type Aliases` هستند، با این تفاوت که فقط برای انواع شیء `(object types)` کاربرد دارند.

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

## محدود کردن تایپ Type Narrowing

`Type Narrowing` چیست؟

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

`Type narrowing` فرایند محدود کردن یک نوع عمومی به یک نوع خاص‌تر داخل یک بلاک شرطی است. در مثال بالا ابتدا بررسی می‌کنیم `weight` از نوع `number` است یا `string` و بر اساس آن نوع را محدود می‌کنیم تا عملیات مناسب را انجام دهیم.

## آشنایی با `Discriminating Unions`

یک روش معمول برای کار با `union`ها این است که یک فیلد مشترک با انواع `literal` داشته باشیم تا `TypeScript` بتواند نوع فعلی ممکن را تشخیص دهد. در مثال زیر یک `union` از سه نوع با یک فیلد مشترک تعریف شده است.

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

## آشنایی با `Intersection Types`

`Intersection types` با `union`ها نزدیک هستند اما کاربرد متفاوتی دارند. یک `intersection` چندین نوع را با هم ترکیب می‌کند تا یک نوع جدید بسازد.

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

## آشنایی با `Literal Types`

در TypeScript سه دستهٔ literal موجود است: رشته‌ها (strings)، اعداد (numbers) و بولی‌ها (booleans). با استفاده از literal types می‌توانید مقادیر دقیقی را که یک رشته، عدد یا بولین باید داشته باشد مشخص کنید.

```ts
type percent = 3 | 6 | 9; # Cannot be any number other than 3,6,9
type Metric = "cm" | "inch";
```

## آشنایی با `Nullable Values`

به‌جای غیرفعال کردن `strictNullChecks`، بهتر است زمانی که نیاز است صراحتاً `null` یا `undefined` را در نوع‌ها لحاظ کنیم.

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

## آشنایی با `Optional Chaining`

عمل‌گر دسترسی اختیاری (Optional property access): یک قطعهٔ کوچک نحوی با وظیفه‌ای مهم است — دسترسی امن به یک propriété زمانی که مقدار قبلی ممکن است `null` یا `undefined` باشد.

```ts
function getUser(id: number): User | null | undefined {
  return id === 0 ? null : { userName: "TestUser" };
}

let user = getUser(0);
// Optional property access operator
console.log(user?.userName);
// If user or profile were null, the code would still run without crashing.
```

چرا این ویژگی وجود دارد

این ویژگی شما را از زنجیره‌های شرطی محافظتی مانند مثال زیر بی‌نیاز می‌کند:

```ts
user && user.profile && user.profile.email;
```

و منطق را مرتب نگه می‌دارد و با `strictNullChecks` به‌خوبی کار می‌کند.

برای دسترسی به عناصر آرایه:
عمل‌گر دسترسی اختیاری به عنصر

```ts
// before
if (customers !== null && customers !== undefined) {
  customers[0];
}
// after
customers?.[0];
```

برای فراخوانی توابع نیز عمل‌گر Optional call وجود دارد

```ts
let log: any = null; # (msg: string) =>{}

log?.("test");
```

## آشنایی با `Nullish Coalescing Operator`

چه کاری انجام می‌دهد:

```ts
const x = foo ?? "default";
0 || 42; # 42   (oops if 0 was a valid value)
"" || "abc"; # 'abc'
false || true; # true
```

<!-- First we need to know about falsy/truthy values -->

عبارت `a ?? b` مقدار `a` را برمی‌گرداند اگر `a` برابر `null` یا `undefined` نباشد؛ در غیر این صورت `b` را برمی‌گرداند.

بنابراین این عمل‌گر یک «فعل و انفعال بازگشتی برای null یا undefined» است، نه یک «بازگشت برای مقدارهای falsy».

## آشنایی با `Type Assertion`

`as` تبدیل (conversion) انجام نمی‌دهد؛ فقط به کامپایلر اطلاع می‌دهد که آن عبارت را به چه نوعی نسبت دهد.

به عبارت دیگر، یک type assertion به TypeScript می‌گوید که یک مقدار را به‌عنوان نوع مشخصی در نظر بگیرد بدون اینکه مقدار در زمان اجرا تغییر کند.

```ts
const value = something as MyType;
const value = <MyType>something;
```

The first form (as) is the modern standard.

## آشنایی با `The Unknown Type`

وقتی پارامتری را با نوع `any` تعریف می‌کنیم عملاً بررسی نوع را دور می‌زنیم.

اما اگر از `unknown` استفاده کنیم، باید از `type narrowing` یا محافظ‌های نوع (type guards) استفاده کنیم.

```ts
function render(document: any) {
  document.x33(); # compilor wont complain about any types
}
```

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

## آشنایی با `The never Type`

نوع `never` در TypeScript وظیفه‌ای مشخص دارد: نمایش مقادیری که قرار نیست وجود داشته باشند. هرگاه TypeScript نتیجه بگیرد «این مسیر اجرایی نمی‌تواند مقداری تولید کند»، نوع `never` به‌دست می‌آید.

این نوع راهی است برای اعلام غیرمستقیم اینکه «اگر به این نقطه رسیدید، منطق شما نادرست است».

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

گاهی لازم است `never` را صریحاً مشخص کنیم، زیرا گاهی کامپایلر TypeScript نوع بازگشتی را به‌اشتباه به‌عنوان `void` استنتاج می‌کند.

[OOP in Typescript](./../3-oop-with-typescript/oop-with-typescript.fa.md)
