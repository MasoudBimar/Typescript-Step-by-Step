# ادغام: TypeScript با JavaScript

- چه‌ زمانی و چرا JS را با TS مخلوط کنیم
- گنجاندن کد JavaScript در پروژه TypeScript
- تایپ-چک کردن JavaScript: `checkJs` و JSDoc
- فایل‌های اعلان (`.d.ts`) و پکیج‌های `@types`

## چرا و چه وقت

ادغام JavaScript معمول است: بسیاری از کتابخانه‌ها، فایل‌های legacy یا قطعات شخص ثالث هنوز به‌صورت JS نوشته شده‌اند. TypeScript تایپ مرحله‌ای (gradual typing) ارائه می‌دهد تا بتوانید به‌صورت تدریجی پذیرش کنید. مشکل این است که مزایای TypeScript از دانش نوع‌ها ناشی می‌شود، در حالی که JavaScript معمولاً اطلاعات نوع را به‌صورت صریح ارائه نمی‌دهد.

### چالش‌های رایج

- کمبود یا نادرستی اطلاعات نوع
  - JavaScript تایپ‌های اجباری ندارد، بنابراین نیت گاهی مبهم است.
  - نشت `any` یا تعداد زیاد فایل‌های `.d.ts` می‌تواند امنیت تایپی را در مرز کاهش دهد.
- ناسازگاری سیستم ماژول‌ها (ESM در مقابل CommonJS)
  - `module.exports`/`require` در برابر `import`/`export` ممکن است نیاز به تنظیماتinterop یا تغییرات در زمان اجرا داشته باشند.
  - فلگ‌هایی مثل `esModuleInterop` و `allowSyntheticDefaultImports` روی خروجی کامپایل و نحوه‌ی import تأثیر می‌گذارند.
- تفاوت‌ها و رفتارهای ناایمن در زمان اجرا
  - تغییرپذیری، شکل بازگشتی نامنظم یا بازگشت‌های شرطی ممکن است کامپایل شوند اما در زمان اجرا خطا دهند؛ اغلب نیاز به اعتبارسنجی در زمان اجرا (مثلاً با `zod`، `io-ts` یا بررسی‌های دستی) دارید.
- الگوهای داینامیک در برابر تحلیل استاتیک
  - الگوهای مبتنی بر `this`، تغییر prototype یا دسترسی داینامیک به پراپرتی‌ها (`obj[key]`) تحلیل استاتیک را سخت‌تر کرده و ممکن است شما را به `unknown`/`any` و کد محافظتی سوق دهد.
- پیچیدگی ابزارها
  - ترکیب کامپایلرها/باندلرها (tsc، Babel، Webpack، Vite، esbuild) با JS قدیمی ممکن است نیاز به پیکربندی دقیق برای sourcemap، tree-shaking و رزولوشن ماژول داشته باشد.
- کیفیت متغیر تایپ‌ها
  - تایپ‌های شخص ثالث ممکن است به‌روز نباشند یا با هم تداخل داشته باشند (`@types/*` در برابر تایپ‌های bundled).

### چه زمانی ادغام کنیم

معمولاً وقتی به‌صورت تدریجی مهاجرت می‌کنید، از یک dependency بدون تایپ استفاده می‌کنید، یا می‌خواهید runtime را بدون تغییر نگه دارید اما از ابزارهای ویرایشگر و ایمنی در حاشیه بهره ببرید، JS را در TS ادغام می‌کنید.

## گنجاندن کد JavaScript در پروژه TypeScript

در ادامه یک ماژول CommonJS ساده که اشکال بازگشتی نامنظم دارد را می‌بینید (نمونه‌ای برای نشان دادن نیاز به گاردهای زمان اجرا):

```js
// pricingEngine.js (CommonJS)
module.exports = {
  calculate(price, factor) {
    if (Math.random() > 0.5) return price * factor; # number
    return { value: price * factor }; # object
  },
};
```

> [!NOTE]
> برای اجازه دادن به TypeScript جهت شامل کردن فایل‌های `.js`، در `tsconfig.json` مقدار `allowJs: true` را قرار دهید. اگر می‌خواهید این فایل‌های JS نیز تایپ-چک شوند، `checkJs: true` را فعال کنید.

```jsonc
// tsconfig.json (partial)
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": false, # set true to enable basic JSDoc type-checking for .js files
    "esModuleInterop": true
  }
}
```

> [!CAUTION]
> فرمت ماژول و محیط اجرا باید مطابقت داشته باشند. در Node.js، اگر از ES modules استفاده می‌کنید (`"type": "module"` در `package.json` یا فایل‌های `.mjs`)، باید import به صورت ESM انجام شود (`import ... from './file.js'`) و پسوند فایل را مشخص کنید. اگر runtime انتظار CommonJS داشته باشد اما شما ESM تولید کنید (یا برعکس)، خطای زمان اجرا مانند `Cannot use import statement outside a module` مشاهده خواهید کرد.

### وارد کردن فایل CommonJS از TypeScript

گزینه A — سبک CommonJS (Node + require)

```ts
// price.service.ts (compiled to run in a CommonJS environment)
const pricingEngine = require("./pricingEngine");

export function safeCalculate(price: number, factor: number): number {
  const result = pricingEngine.calculate(price, factor);

  if (typeof result === "number") return result;
  if (result && typeof result === "object" && "value" in result) return (result as any).value;

  throw new Error("Invalid response from pricing engine");
}
```

گزینه B — سازگار با ESM (وقتی ماژول JS به‌صورت ESM است یا باندلر interop را مدیریت می‌کند)

```ts
// price.service.ts (ESM runtime or with proper bundler support)
import * as pricingEngine from "./pricingEngine.js";

export function safeCalculate(price: number, factor: number): number {
  const result = pricingEngine.calculate(price, factor as any);
  // همان اعتبارسنجی زمان اجرا
  if (typeof result === "number") return result;
  if (result && typeof result === "object" && "value" in result) return (result as any).value;
  throw new Error("Invalid response from pricing engine");
}
```

> [!TIP]
> یک wrapper کوچک TypeScript برای ماژول‌های بدون تایپ بنویسید که اعتبارسنجی زمان اجرا انجام دهد و یک API تایپ‌شده به بقیه کد ارائه کند.

## تایپ-چک کردن JavaScript

به‌صورت پیش‌فرض، TypeScript فایل‌های `.js` را تایپ-چک نمی‌کند. برای فعال‌سازی بررسی پایه (با استفاده از JSDoc)، `checkJs: true` را در `tsconfig.json` قرار دهید و مطمئن شوید `allowJs: true` فعال باشد تا کامپایلر فایل‌های JS را شامل کند.

می‌توانید بررسی را برای یک فایل مشخص با قرار دادن `// @ts-nocheck` در بالای فایل غیرفعال کنید.

> [!CAUTION]
> غیرفعال کردن با `@ts-nocheck` بررسی ویرایشگر/کامپایلر را حذف می‌کند — فراخوانی توابع با پارامترهای ناقص `undefined` را در زمان اجرا ارسال می‌کند و خطاها را از دید کامپایلر پنهان می‌سازد.

## استفاده از JSDoc برای توصیف تایپ‌ها (مناسب برای مهاجرت تدریجی)

افزودن JSDoc comments به فایل JS به TypeScript و ادیتور کمک می‌کند تا IntelliSense و بسیاری از خطاها را تشخیص دهند.

```js
// mathTools.js

/**
 * Multiplies two numbers.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function multiply(a, b) {
  return a * b;
}

/**
 * Parses a JSON string safely.
 * @param {string} text
 * @returns {{ ok: true, value: any } | { ok: false, error: string }}
 */
function safeParse(text) {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

module.exports = { multiply, safeParse };
```

در TypeScript می‌توانید این‌ها را وارد کرده و با پشتیبانی مناسب ابزارها استفاده کنید. با `esModuleInterop: true` می‌توانید به شکل زیر عمل کنید:

```ts
import mathTools = require("./mathTools");

export function calculateTotal(x: number, y: number): number {
  return mathTools.multiply(x, y);
}

export function parseUserConfig(text: string) {
  const result = mathTools.safeParse(text);
  if (result.ok) return result.value;
  throw new Error(`Invalid config: ${result.error}`);
}
```

> [!TIP]
> اگر کنترل فایل JS را دارید، تبدیل آن به ESM (`export function multiply(...) {}`) را در نظر بگیرید — واردات ساده‌تر خواهد شد: `import { multiply } from './mathTools.js'`.

## فایل‌های اعلان (`.d.ts`)

وقتی نمی‌خواهید یا نمی‌توانید فایل JS را ویرایش کنید، یک فایل `.d.ts` قرارداد تایپی برای TypeScript فراهم می‌کند.

مثال JS (CommonJS):

```js
// userApi.js
function fetchUser(id) {
  return fetch(`/api/users/${id}`)
    .then((r) => r.json())
    .then((data) => (data ? { id: data.id, name: data.name, age: data.age } : null));
}

function isAdult(user) {
  return user && user.age >= 18;
}

module.exports = { fetchUser, isAdult };
```

یک فایل اعلان `userApi.d.ts` کنار آن ایجاد کنید:

```ts
// userApi.d.ts
export interface User {
  id: string;
  name: string;
  age?: number;
}

export function fetchUser(id: string): Promise<User | null>;
export function isAdult(user: User | null): boolean;
```

سپس می‌توانید از TypeScript به‌صورت معمول وارد کنید:

```ts
import { fetchUser, isAdult } from "./userApi";

export async function loadUserStatus(id: string) {
  const user = await fetchUser(id);
  if (!user) return "User not found";
  return isAdult(user) ? "Adult" : "Minor";
}
```

> [!CAUTION]
> اگر فایل `.d.ts` ناقص یا نادرست باشد، TypeScript از اشکالِ اعلام‌شده استفاده می‌کند — اما رفتار زمان‌اجرایی را تغییر نمی‌دهد. اعلان‌ها را دقیق نگه دارید.

## استفاده از پکیج‌های `@types/*` (DefinitelyTyped)

بسیاری از کتابخانه‌های محبوب JS تایپ‌هایی در مخزن DefinitelyTyped دارند و تحت `@types/*` در npm منتشر می‌شوند.

برای نصب تایپ یک کتابخانه محبوب (مثال: lodash):

```pwsh
npm install --save-dev @types/lodash
```

> [!TIP]
> اگر یک کتابخانه نسخه‌ای دارد که تایپ‌های رسمی را همراه دارد (bundled types)، ترجیحاً از آن استفاده کنید تا `@types/*`.

## چک‌لیست عملی هنگام ادغام JS با TS

- برای APIهای عمومی/شخص ثالث، JSDoc یا `.d.ts` اضافه کنید.
- `allowJs` را فعال کنید تا JS توسط TypeScript کامپایل شود؛ اگر می‌خواهید JS را تایپ-چک کنید، `checkJs` را فعال کنید.
- سیستم ماژول‌ها را همسو نگه دارید یا `esModuleInterop`/`module` را به‌درستی پیکربندی کنید.
- wrapperهای کوچک TypeScript اضافه کنید که اشکال زمان اجرا را اعتبارسنجی و API تایپ‌شده فراهم کنند.
- از `@types/*` جامعه استفاده کنید؛ در غیر این صورت، فایل‌های اعلان دقیق نگه دارید.

اگر مایل باشید، می‌توانم:

- نمونه‌های `.d.ts` را در این مخزن کنار فایل‌های JS نمونه اضافه کنم،
- یکی از نمونه‌های JS را به ESM تبدیل و جریان import در TS را نشان دهم،
- یا یک `tsc --noEmit` سریع اجرا کنم و نتایج تایپ-چک را گزارش دهم.
