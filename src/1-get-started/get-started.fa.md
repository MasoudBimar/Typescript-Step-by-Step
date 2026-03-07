# تایپ اسکریپت چیست؟

تایپ اسکریپت یک ابرمجموعهٔ یا سوپرستی سینتکسی از جاوااسکریپت است که انواع ایستا (تایپ های استاتیک) را به جاوااسکریپت اضافه می‌کند.
این زبان به‌گونه‌ای طراحی شده تا به توسعه‌دهندگان کمک کند خطاها را زودتر از طریق سیستم تایپ شناسایی کند و توسعهٔ برنامه های به زبان جاوااسکریپت را کارآمدتر سازد.
کد تایپ اسکریپت به جاوااسکریپت معمولی ترنسپایل یعنی یک تبدیل میانی از ترجمه و کامپایل می‌شود و می‌تواند در هر محیطی که از جاوااسکریپت پشتیبانی می‌کند اجرا کد تولیدی نه خود تایپ اسکریپت شود، مانند مرورگرها و `Node.js`.

## زبان تایپ اسکریپت چه چیزهایی به جاوااسکریپت اضافه می‌کند

- Static Typing
- Code completion
- Refactoring
- Shorthand notation and new features

## Static Typing

جاوااسکریپت یک زبان با تایپ پویا `(Dynamically-Typed)` است.
تایپ اسکریپت یک زبان با تایپ ایستا `(Statically-Typed)` است. تایپ اسکریپت از بررسی تایپ در زمان کامپایل استفاده می‌کند؛ یعنی پیش از اجرای برنامه بررسی می‌کند که انواع مشخص‌شده با هم سازگار باشند، نه در زمان اجرا. به عبارت ساده، تایپ اسکریپت همان جاوااسکریپت است با لایه‌ای از بررسی تایپ یا نوع داده.

### معایب تایپ اسکریپت :)

- نیاز به فرآیند کامپایل/ترنسپایل `(Compilation / Transpilation)`
- نیازمند انضباط در نگارش کد و رعایت انواع برای به‌دست آوردن بیشترین مزایا

### نصب تایپ اسکریپت

```bash
npm install -g typescript
```

### ترنسپایل فایل تایپ اسکریپت به جاوااسکریپت

```bash
tsc filename.ts
```

### پیکربندی کامپایلر تایپ اسکریپت

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
  "strictNullChecks": true,
  "noImplicitReturns": true,
  "noUnusedParameters": true,
  "noUnusedLocals": true,
  "allowUnreachableCode": false,
```

### دیباگ کردن

کافی است یک `breakpoint` در محل موردنظر قرار دهید و به پنل `Debug` در `VS Code` بروید. سپس روی گزینهٔ ایجاد `launch.json` کلیک کنید و پیکربندی مربوط به `Node.js` را انتخاب نمایید.

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

انواع پایهٔ جاوااسکریپت

- number
- string
- boolean
- null
- undefined
- object

انواع اضافی در تایپ اسکریپت

- any
- unknown
- never
- enum
- tuple
- BigInt (ES2020+)
- Symbol

### اعلان نوع و استنتاج نوع (Type Annotation and Inference)

تایپ اسکریپت دو روش برای کار با نوع‌ها ارائه می‌دهد:

- اعلان صریح نوع (Explicit Typing): شما صریحاً نوع یک متغیر را مشخص می‌کنید.
- استنتاج نوع (Type Inference): تایپ اسکریپت به‌طور خودکار نوع را بر اساس مقدار اختصاص‌یافته تعیین می‌کند.

### تاپل‌ها در تایپ اسکریپت (Tuples)

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

### Enumها در تایپ اسکریپت

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

[تایپ های پیشرفته در تایپ اسکریپت](./../2-advanced-types/advanced-types.fa.md)
