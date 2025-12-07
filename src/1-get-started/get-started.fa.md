# تایپ اسکریپت چیست؟

TypeScript یک ابرمجموعهٔ نحوی از JavaScript است که انواع ایستا (static types) را اضافه می‌کند. این زبان به‌گونه‌ای طراحی شده تا به توسعه‌دهندگان کمک کند خطاها را زودتر از طریق سیستم نوع‌شناسی شناسایی کنند و توسعهٔ JavaScript را کارآمدتر سازد. کد TypeScript به JavaScript معمولی ترنسپایل می‌شود و می‌تواند در هر محیطی که از JavaScript پشتیبانی می‌کند اجرا شود، مانند مرورگرها و Node.js.

## زبان TypeScript چه چیزهایی به JavaScript اضافه می‌کند

- تایپ ایستا
  - Static Typing
- تکمیل کد
  - Code completion
- ابزارهای بازسازی کد
  - Refactoring
- نگارش کوتاه‌تر و قابلیت‌های جدید زبان

  - Shorthand notation and new features

## Static Typing

JavaScript یک زبان با تایپ پویا (Dynamically-Typed) است.
TypeScript یک زبان با تایپ ایستا (Statically-Typed) است. TypeScript از بررسی تایپ در زمان کامپایل استفاده می‌کند؛ یعنی پیش از اجرای برنامه بررسی می‌کند که انواع مشخص‌شده با هم سازگار باشند، نه در زمان اجرا. به عبارت ساده، TypeScript همان JavaScript است با لایه‌ای از بررسی تایپ یا نوع داده.

### معایب TypeScript

- نیاز به فرآیند کامپایل/ترنسپایل (Compilation / Transpilation)
- نیازمند انضباط در نگارش کد و رعایت انواع برای به‌دست آوردن بیشترین مزایا

### نصب TypeScript

```bash
npm install -g typescript
```

### ترنسپایل فایل TypeScript به JavaScript

```bash
tsc filename.ts
```

### پیکربندی کامپایلر TypeScript

```bash
tsc --init
```

این فرمان یک فایل پیکربندی به نام `tsconfig.json` با تنظیمات پیش‌فرض ایجاد می‌کند.

### مهم‌ترین تنظیم‌ها در `tsconfig.json`

نمونه‌ای از تنظیمات معمول در `tsconfig.json`:

```json
  "rootDir": "./src",
  "outDir": "./dist",
  "removeComments": true,
  "noEmitHelpers": true,
  "noImplicitAny": true,
  "noImplicitReturns": true,
  "noUnusedParameters": true,
  "noUnusedLocals": true,
  "allowUnreachableCode": false,
```

### دیباگ کردن

کافی است یک breakpoint در محل موردنظر قرار دهید و به پنل Debug در VS Code بروید. سپس روی گزینهٔ ایجاد `launch.json` کلیک کنید و پیکربندی مربوط به Node.js را انتخاب نمایید.

### پیکربندی فایل اجرای برنامه (launch.json)

نمونهٔ پیکربندی `launch.json` برای اجرای برنامه با Node.js در VS Code:

```json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}\\src\\get-started\\1.get-started.ts",
      "preLaunchTask": "tsc: build - tsconfig.json",
      "outFiles": ["${workspaceFolder}/**/*.js"]
    }
  ]
}
```

## Types

انواع پایهٔ JavaScript

- number
- string
- boolean
- null
- undefined
- object

انواع اضافی در TypeScript

- any
- unknown
- never
- enum
- tuple
- BigInt (ES2020+)
- Symbol

### اعلان نوع و استنتاج نوع (Type Annotation and Inference)

TypeScript دو روش برای کار با نوع‌ها ارائه می‌دهد:

- اعلان صریح نوع (Explicit Typing): شما صریحاً نوع یک متغیر را مشخص می‌کنید.
- استنتاج نوع (Type Inference): TypeScript به‌طور خودکار نوع را بر اساس مقدار اختصاص‌یافته تعیین می‌کند.

### تاپل‌ها در TypeScript (Tuples)

- آرایه‌های دارای نوع مشخص (Typed Arrays)

تاپل یک آرایهٔ دارای نوع است که طول و نوع هر ایندکس از پیش مشخص شده است.

```ts
let user: [number, string] = [15, "Masoud"];

// define our tuple
let ourTuple: [number, boolean, string];
// initialize correctly
ourTuple = [5, false, "Coding God was here"];
// We have no type safety in our tuple for indexes 3+
ourTuple.push("Something new and wrong");
console.log(ourTuple);
```

### Enumها در TypeScript

Enumها فهرستی از ثابت‌های مرتبط هستند. اگر enum را به‌صورت ثابت‌ها تعریف کنیم، کامپایلر ممکن است کد بهینه‌تری تولید کند.

```ts
const small = 1;
const meduim = 2;
const large = 3;

// PascalCase

enum Size {
  Small = 1,
  Meduim = 2,
  Large = 3,
}

let mySize: Size = Size.Meduim;

// const
const enum Size1 {
  Small = 1,
  Meduim = 2,
  Large = 3,
}
```

[Typescript Advanced Types](./../2-advanced-types/advanced-types.md)
