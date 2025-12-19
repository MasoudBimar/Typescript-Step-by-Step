# Barrels vs. Path Aliases in TypeScript

## Barrels در همه جا

`index.ts` در هر پوشه به‌عنوان یک barrel/re-export point

مزایا

> [!TIP]
> imports کوتاه‌تر، گاهی ergonomics بهتر.

معایب

> [!CAUTION]
> ساخت cycles به‌طور تصادفی آسان است (فایل A از folder barrel import می‌کند که A را بازصادور می‌کند)
> Public API مبهم می‌شود ("همه چیز قابل export است")
> Debugging "این از کجا آمده؟" کندتر می‌شود

از "barrels در همه جا" اجتناب کنید. Barrels را تنها در مرزهای library و intentional sub-entrypoints نگه دارید.

## TypeScript Path Aliases (`compilerOptions.paths`)

مزایا

> [!TIP]
> مسیرهای import تمیز و پایدار: `import { X } from "@org/foo"`.
> عالی در monorepos؛ روابط clear boundary imports را تشویق می‌کند.

معایب

> [!CAUTION]
> Aliases یک ویژگی compile-time resolution TypeScript است؛ ابزار باید برای matching تنظیم شود.
> Jest نیاز به `moduleNameMapper` دارد (ts-jest این را به‌طور صریح مستند می‌کند).
> Runtime Node ممکن است اگر مستقیماً TypeScript را اجرا کنید به setup اضافی نیاز داشته باشد (به configuration build/loader شما بستگی دارد).
>
> Aliases را برای cross-library imports استفاده کنید، اما مطمئن شوید test/runtime tooling به‌درستی تنظیم شده است.

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@org/my-lib": ["libs/my-lib/src/index.ts"]
    }
  }
}
```

```ts
// libs/my-lib/src/index.ts
export { FooService } from "./lib/foo.service";
export type { FooConfig } from "./lib/foo.types";

// consumer
import { FooService, type FooConfig } from "@org/my-lib";
```

بخش بعدی: [Integration Typescript with javascript](./../7-integration-typescript-with-javascript/integration-typescript-with-javascript.fa.md)
