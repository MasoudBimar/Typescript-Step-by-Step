# Decorators In TypeScript

- چیست؟ چرا؟ کجا؟
- Class Decorator
- Method Decorator
- Property Decorator
- Accessor Decorator
- Parameter Decorator

## چیست؟ چرا؟ کجا؟

Decorators در TypeScript یکی از آن ویژگی‌هایی هستند که احساس می‌کنند انگار موجودات کوچک طفیلی‌ای را به کد خود چسباندید: آنها به یک کلاس، متد، ویژگی یا پارامتر آویزان می‌شوند و رفتار را آرام‌آرام تغییر می‌دهند. اگر خوب استفاده شوند، قدرت بیانی می‌دهند؛ اگر بد استفاده شوند، کدپایه شما را به اسپاگتی عجیب و غریب تبدیل می‌کنند. Angular بر آنها متکی است، بنابراین درک آنها ارزشمند است.

### چیست؟

یک decorator یک تابع است که در زمان تعریف کلاس اجرا می‌شود، نه در جریان زمان اجرا، و می‌تواند بررسی یا تغییر دهد:

- classes
- methods
- fields
- accessors
- parameters

TypeScript خود decorators را اجرا نمی‌کند؛ آنها را به JavaScript تبدیل می‌کند که metadata را تنظیم یا رفتار را بسته‌بندی می‌کند.
این زمان اجرا است — اما به طور خاص زمان اجرا در زمان ارزیابی کلاس، نه زمان اجرا در فراخوانی متد یا ساخت instance است.

```ts
function LogClass(target: Function) {
  console.log(`Decorating: ${target.name}`);
}

@LogClass
class User {}
```

When the class is defined, `LogClass(User)` runs.

### چرا؟

Decorators یک مشکل بزرگ را حل می‌کنند:
افزودن رفتار cross-cutting و metadata-driven بدون کثیف‌کردن کلاس با boilerplate.

#### Metadata و Reflection

Metadata را وصل کنید تا frameworks بتوانند کلاس‌ها را بررسی کنند. Angular این کار را انجام می‌دهد:

```ts
@Component({...})
class MyComponent {}

```

Decorator یک سابقه metadata می‌سازد تا Angular بداند چگونه component را نمونه‌سازی کند، کدام template را بارگذاری کند، چه inputs وجود دارد و غیره.

#### بسته‌بندی رفتار

Method decorators منطق را برای logging، caching، memoization، rate limiting و غیره بسته‌بندی می‌کنند.

#### API‌های تعریفی

Decorators یک DSL برای frameworks فراهم می‌کنند تا "چگونه کلاس شما رفتار می‌کند" را بدون کد setup اجباری تعریف کنند.

Angular، NestJS، TypeORM، MobX، Fastify، tRPC — همگی برای طراحی تعریفی و metadata-driven بر آنها متکی‌اند.

### کجا؟

Decorators می‌توانند به: `class declaration، method، accessor، property، یا parameter` اعمال شوند.

### Decorators چیستند؟

یک Decorator یک نوع خاص تعلیق است که می‌تواند به `class declaration، method، accessor، property، یا parameter` وصل شود. Decorators از فرم `@expression` استفاده می‌کنند، جایی که expression باید یک تابع را ارزیابی کند که در زمان اجرا با اطلاعات درباره تعلیق تعریف‌شده فراخوانی می‌شود.

Decorators را به‌عنوان annotations زمان compile فکر کنید که:

- یک بار اجرا می‌شوند، وقتی کلاس تعریف می‌شود.
- می‌توانند تعریفات را تغییر دهند (prototype، descriptors).
- بیشتر برای حمایت از frameworks که به metadata نیاز دارند وجود دارند.
- Injection زمان اجرا نیستند مگر اینکه خود اجرا کنید.

## Class Decorators

TypeScript در حال حاضر دو سیستم decorator دارد:

- Legacy / "stage 2" decorators ("experimentalDecorators": true) — این است که Angular هنوز به آن متکی است.
- New / "stage 3" (standard-ish) decorators (TypeScript 5+) هم‌راستا با پیشنهاد TC39.
  [اطلاعات بیشتر درباره این](https://github.com/angular/angular/issues/65739)

```ts
// stage 2
function Component(constructor: Function) {
  constructor.prototype.someId = Date.now();
  constructor.prototype.insertInDom = () => {
    console.log("inside insertInDom");
  };
}

@Component
class SampleComponent {}
```

Here is the generated JavaScript

```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Component(constructor) {
  constructor.prototype.someId = Date.now();
  constructor.prototype.insertInDom = () => {
    console.log("inside insertInDom");
  };
}
let SampleComponent = (() => {
  let _classDecorators = [Component];
  let _classDescriptor;
  let _classExtraInitializers = [];
  let _classThis;
  var SampleComponent = (_classThis = class {});
  __setFunctionName(_classThis, "SampleComponent");
  (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
    __esDecorate(
      null,
      (_classDescriptor = { value: _classThis }),
      _classDecorators,
      { kind: "class", name: _classThis.name, metadata: _metadata },
      null,
      _classExtraInitializers
    );
    SampleComponent = _classThis = _classDescriptor.value;
    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    __runInitializers(_classThis, _classExtraInitializers);
  })();
  return (SampleComponent = _classThis);
})();
//# sourceMappingURL=decorators-in-typescript.js.map
```

### Parametrized Decorators

```ts
type ComponentOptions = {
  selector: string;
};

// Decorator Factory
function Component(options: ComponentOptions) {
  return (constructor: Function) => {
    constructor.prototype.options = options;
    constructor.prototype.someId = Date.now();
    constructor.prototype.insertInDom = () => {
      console.log("inside insertInDom");
    };
  };
}

@Component({ selector: "#selector-name" })
class SampleComponent {}
```

### Decorator Composition

```ts
type ComponentOptions = {
  selector: string;
};

function Pipe(constructor: Function) {
  console.log("Pipe Decorator called");
  constructor.prototype.pipe = true;
}

function Component(options: ComponentOptions) {
  return (constructor: Function) => {
    console.log("Component Decorator called");
    constructor.prototype.options = options;
    constructor.prototype.someId = Date.now();
    constructor.prototype.insertInDom = () => {
      console.log("inside insertInDom");
    };
  };
}

@Component({ selector: "#selector-name" })
@Pipe
class SampleComponent {}
```

در Stage 2 / "legacy" TypeScript decorators ("experimentalDecorators": true)، "decorator composition" به‌طور حرفی function composition است: پشته‌کردن @f و @g مانند f(g(x)) برای چیز decorated رفتار می‌کند. TypeScript همچنین یک ترتیب سختگیرانه برای زمان اجرای انواع مختلف decorators تعریف می‌کند.

```ts
@f
@g
class C {}
```

ابتدا، Pipe decorator فراخوانی می‌شود، سپس Component decorator.
مانند `f(g(x))` [docs](https://www.typescriptlang.org/docs/handbook/decorators.html)

## Method Decorator

TypeScript legacy ("stage 2") method decorators توابع زمان اجرا هستند که TypeScript با (target، propertyKey، descriptor) فراخوانی می‌کند و می‌تواند متد را مشاهده / تغییر دهد / جایگزین کند با ویرایش (یا برگرداندن) PropertyDescriptor. [TypeScript docs](https://www.typescriptlang.org/docs/handbook/decorators.html)

ما می‌توانیم @enumerable decorator را با استفاده از تعلیق تابع زیر تعریف کنیم:

```ts
function enumerable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.enumerable = value;
  };
}
```

- `target` prototype برای instance methods است، یا constructor برای static methods.
- `key` نام متد است.
- `descriptor` پارامتر `PropertyDescriptor` برای متد است (می‌تواند undefined باشد اگر زیر ES5 کامپایل کنید)
- اگر descriptor را برگردانید، TypeScript از آن به‌عنوان descriptor متد استفاده می‌کند (اما مقادیر برگشتی هنگام targeting < ES5 نادیده گرفته می‌شوند).

```ts
export function LogCalls(): MethodDecorator {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const original = descriptor.value as Function;

    descriptor.value = function (this: unknown, ...args: unknown[]) {
      // ما نمی‌توانیم از arrow functions اینجا استفاده کنیم زیرا با FAT نمی‌توانیم به this دسترسی داشته باشیم
      console.log(String(propertyKey), "args:", args);
      return original.apply(this, args);
    };
  };
}

class Demo {
  @LogCalls()
  sum(a: number, b: number) {
    return a + b;
  }
}
```

## Accessor Decorator

یک Accessor Decorator درست قبل از تعلیق accessor تعریف می‌شود. Accessor decorator به Property Descriptor برای accessor اعمال می‌شود و می‌تواند برای مشاهده، تغییر یا جایگزینی تعریفات accessor استفاده شود.

TypeScript تزیین کردن هر دو getter و setter accessor برای یک member منفرد را ممنوع می‌کند.
در عوض، تمام decorators برای member باید به اولین accessor مشخص‌شده در ترتیب document اعمال شوند.
این به این دلیل است که decorators به Property Descriptor اعمال می‌شوند، که هم getter و هم setter accessor را ترکیب می‌کند، نه هر تعلیق را جداگانه.

```ts
function configurable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.configurable = value;
  };
}

class Point {
  private _x: number;
  private _y: number;
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  @configurable(false)
  get x() {
    return this._x;
  }

  @configurable(false)
  get y() {
    return this._y;
  }
}
```

Another Accessor Decorator

```ts
function Capitalize(target: any, methodName: string, descriptor: PropertyDescriptor) {
  const original = descriptor.get;
  descriptor.get = function () {
    const result = original?.call(this);
    return typeof result === "string" ? result.toUpperCase() : result;
  };
}
```

## Property Decorator

```ts
function MinLength(length: number) {
  return (target: any, propertyName: string) => {
    let value: string;
    const descriptor: PropertyDescriptor = {
      get() {
        return value;
      },
      set(newValue: string) {
        if (newValue.length < length) {
          throw new Error(`${propertyName} should be at least ${length} characters long`);
        }
        value = newValue;
      },
    };
    Object.defineProperty(target, propertyName, descriptor);
  };
}

class User {
  @MinLength(4)
  password: string;

  constructor(password: string) {
    this.password = password;
  }
}

let user = new User("123");
console.log(user.password);
```

## Parameter Decorator

اینجا چند نمونه از Typescript Parameter Decorator که در angular framework استفاده می‌شود:

- Angular API: [@Inject](https://angular.dev/api/core/Inject)
- Angular API: [@Optional](https://angular.dev/api/core/Optional)
- Angular API: [@Self](https://angular.dev/api/core/Self)
- Angular API: [@SkipSelf](https://angular.dev/api/core/SkipSelf)
- Angular API: [@Host](https://angular.dev/api/core/Host)
- Angular API: [@Attribute](https://angular.dev/api/core/Attribute)

```ts
type WatchedParameter = {
  methodName: string;
  parameterIndex: number;
};

const watchedParameters: WatchedParameter[] = [];

function Watch(target: any, methodName: string, parameterIndex: number) {
  watchedParameters.push({ methodName, parameterIndex });
}

class Vehicle {
  move(@Watch speed: number) {}
}
```

Next Section: [Modules In Typescript](./../5-modules-in-typescript/modules-in-typescript.fa.md)
