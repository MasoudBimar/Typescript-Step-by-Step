# Modules In TypeScript

- چیست؟ چرا؟ کجا؟
- ایجاد و استفاده از modules
- فرمت‌های Module
- Default exports
- Wildcard imports
- Re-exporting

## چیست؟ چرا؟ کجا؟

TypeScript "modules" تنها ES modules جاوااسکریپت است به‌علاوه سیستم نوع TypeScript که روی آن قرار گرفته است. ایده اصلی: یک فایل تبدیل به module می‌شود اگر import یا export سطح‌بالایی داشته باشد؛ در غیر این صورت مثل یک فایل "script" جهانی رفتار می‌کند.

### چیست؟

- یک module یک فایل با `import / export` است. تعلیقات آن محدود به آن فایل هستند مگر export شوند.
- همچنین "internal modules" قدیمی‌تر در تاریخ TS وجود دارد (`namespace / module keyword`)، اما در TS/Angular مدرن تقریباً همیشه منظور ES modules است.

### چرا؟

Modules برای ساخت کد وجود دارند:

- قابل ترکیب: dependencies صریح (import) و API surface صریح (export).
- قابل تجزیه ایستایی: ابزار/bundlers می‌توانند imports را در زمان build تجزیه کنند (tree-shaking، refactoring، type-checking).
- به‌صورت پیش‌فرض غیر‌جهانی: از تصادم نام‌ها و اقدام عجیب در فاصله دور اجتناب می‌کند.

### کجا؟

در سه لایه فکر کنید (این 90% از سردرگمی "module" را حل می‌کند):

- In code

```ts
// math.ts  <-- این یک module است زیرا export می‌کند
export function add(a: number, b: number) {
  return a + b;
}

// app.ts
import { add } from "./math";
console.log(add(1, 2));
```

یک فایل بدون `import/export` سطح‌بالایی یک "script" است و تعلیقات را در سطح جهانی منتشر می‌کند. [Docs](https://www.typescriptlang.org/docs/handbook/2/modules.html?utm_source=chatgpt.com)

- در tsconfig.json (نحوه‌ای که TS، JS را emit می‌کند):

  - "compilerOptions.module" کنترل می‌کند TS چه module format را output می‌دهد (ESM vs CommonJS vs preserve برای bundlers).
  - "compilerOptions.moduleResolution" کنترل می‌کند TS چگونه imports را بر روی disk پیدا می‌کند (node، nodenext، bundler، و غیره).

- در Runtime (نحوه‌ای که Node/browser فایل‌های .js را تفسیر می‌کند)
  - در Node.js، `package.json "type": "module"` باعث می‌شود Node فایل‌های .js را به‌عنوان ES modules تفسیر کند (در غیر این صورت به‌طور پیش‌فرض CommonJS است).

توضیح بیشتر:

```text
https://www.typescriptlang.org/docs/handbook/2/modules.html
https://www.typescriptlang.org/tsconfig/module
https://www.typescriptlang.org/tsconfig/moduleResolution.html
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
https://nodejs.org/api/esm.html
https://nodejs.org/api/packages.html
```

## ایجاد و استفاده از modules

```ts
// file1.ts

export class Circle {
  constructor(public radius: number) {}
}

export class Square {
  constructor(public width: number) {}
}
```

در Index File:

```ts
// index.ts
import { Circle, Square } from "./file1";
import { Circle as MyCircle, Square } from "./file1";
```

## فرمت‌های Module

جاوااسکریپت دارای چندین فرمت module و الگوهای تاریخی است:

- AMD
- UMD
- CommonJS
- ES2015 / ES6 (ESM)

### AMD

browser loaders مانند RequireJS

```ts
// math.amd.js
define([], function () {
  function add(a, b) {
    return a + b;
  }
  return { add };
});

// main.amd.js
require(["./math.amd"], function (math) {
  console.log(math.add(1, 2));
});
```

### UMD

UMD یک الگو است، نه یک استاندارد زبان: AMD vs CommonJS vs "global" را شناسایی می‌کند و بر این اساس export می‌کند.

```ts
// math.amd.js
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory); // AMD
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory(); // CommonJS / Node
  } else {
    root.math = factory(); // Global (browser)
  }
})(typeof self !== "undefined" ? self : this, function () {
  function add(a, b) {
    return a + b;
  }
  return { add };
});
```

استفاده:

- در AMD: `require(['./math.umd'], (m) => m.add(1, 2))`
- در Node: `const math = require('./math.umd');`
- در یک browser global: `<script src="math.umd.js"></script>` سپس `window.math` را دسترسی کنید

### CommonJS

Node.js کلاسیک (require، module.exports)

```ts
// math.js
function add(a, b) {
  return a + b;
}
module.exports = { add };

// main.js

const math = require("./math.cjs");
console.log(math.add(1, 2));
```

### ES2015 / ES6 Modules (ESM)

استاندارد مدرن (import / export)

```ts
// math.js
export function add(a, b) {
  return a + b;
}

// main.js
import { add } from "./math.mjs";
console.log(add(1, 2));
```

ES modules از export و import استفاده می‌کنند و از نظر ایستایی قابل تجزیه هستند

> [!NOTE]
> فرمت module را از طریق `compilerOptions.module` در `tsconfig.json` تنظیم کنید (نمونه‌ها: `"es6"`، `"es2022"`، یا `"esnext"`).

## Default Exports

```ts
// math.ts
export default class User {}

export class Other1 {}

class Other2 {}

// main.ts
import User, { Other1 } from "./math";
```

## Wildcard imports

می‌توانید کل namespace module (تمام exports آن) را در یک object وارد کنید.

### Namespace import (`import * as X from "…"`)

این نزدیک‌ترین چیز است که TypeScript به "wildcard import" دارد.

```ts
import * as math from "./math";

math.add(1, 2);
math.mul(2, 3);
```

چیزی که می‌گیرید namespace object module است (اساساً "تمام exports به‌عنوان properties").
Dynamic import() همان نوع namespace object را برمی‌گرداند.

وقتی ایده خوبی است

- شما واقعاً می‌خواهید "کل module به‌عنوان یک API surface" (plugin registries، polyfills، utilities).
- شما با CommonJS interop edge-cases سروکار دارید و به فرم namespace نیاز دارید.

> [!CAUTION]
> در بسیاری از موارد این باعث می‌شود dependencies کمتر صریح باشند و می‌تواند tree-shaking را آسیب برساند، زیرا شما کل namespace را وارد می‌کنید حتی اگر تنها یک export استفاده کنید.

### Re-export wildcard (`export * from "…"`) a.k.a. barrel files

این یک import به‌داخل scope فایل فعلی نیست — این "بازصادور همه چیز از module دیگری" است.

```ts
// index.ts
export * from "./math";
export * from "./strings";
```

> [!CAUTION]
> معایب: می‌تواند dependency hairballs و circular deps ایجاد کند اگر overused شود (خصوصاً در Nx monorepos بزرگ).

### Real filesystem globs ("import everything in this folder")

TypeScript/ESM به‌طور خودکار import "./dir/\*.ts" را پشتیبانی نمی‌کند.

> [!NOTE]
> اگر این را می‌بینید، یک ویژگی bundler است، مثل Vite's import.meta.glob:
>
> ```ts
> const modules = import.meta.glob("./plugins/*.ts");
> ```

## Re-exporting

وقتی یک module رشد می‌کند، الگوی معمول تقسیم exports به فایل‌های جداگانه و بازصادور آنها از یک barrel file (برای مثال، `index.ts`) برای ساده‌سازی imports جایی دیگر است.

مثال — بسیاری از کلاس‌ها در یک فایل (ایده‌آل نیست):

```ts
export class C1 {}
export class C2 {}
export class C3 {}
export class C4 {}
```

بازسازی به فایل‌های جداگانه:

```ts
// C/C1.ts
export class C1 {}

// C/C2.ts
export class C2 {}

// C/C3.ts
export class C3 {}

// C/C4.ts
export class C4 {}
```

یک barrel (`C/index.ts`) برای بازصادور قطعات ایجاد کنید:

```ts
export { C1 } from "./C1";
export { C2 } from "./C2";
export { C3 } from "./C3";
export { C4 } from "./C4";
```

سپس import کنید جایی دیگر استفاده کنید:

```ts
import { C1, C2 } from "./C";
```

نکته: برای فعال کردن استراتژی‌های حل خاص یا path mapping، ممکن است نیاز به تنظیم `tsconfig.json` داشته باشید (برای مثال، تنظیم `moduleResolution: "node"` یا اضافه کردن نقشه `paths`). این گزینه‌ها را تنها زمانی استفاده کنید که توسط build/tooling شما نیاز باشد.

[Barrels vs Type Aliases in Typesript](./barrels-vs-path-aliases-in-typescript.md)

بخش بعدی: [Integration Typescript with javascript](./../7-integration-typescript-with-javascript/integration-typescript-with-javascript.md)
