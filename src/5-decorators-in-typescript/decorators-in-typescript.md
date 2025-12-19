# Decorators In TypeScript

- What? Why? Where?
- Class Decorator
- Method Decorator
- Property Decorator
- Accessor Decorator
- Parameter Decorator

## What? Why? Where?

Decorators in TypeScript are one of those features that feel a bit like attaching tiny robotic parasites to your code: they latch onto a class, method, property, or parameter and quietly modify behavior. Used well, they give you expressive power; used poorly, they turn your codebase into eldritch spaghetti. Angular leans heavily on them, so understanding them is worth the effort.

### What?

A decorator is a function that runs at class-definition time, not at runtime flow, and can inspect or modify:

- classes
- methods
- fields
- accessors
- parameters

TypeScript doesn’t execute decorators itself; it transforms them into JavaScript that sets metadata or wraps behavior.
It is runtime — but specifically runtime at class-evaluation time, not runtime at method-call or instance-construction time.

```ts
function LogClass(target: Function) {
  console.log(`Decorating: ${target.name}`);
}

@LogClass
class User {}
```

When the class is defined, `LogClass(User)` runs.

### Why?

Decorators answer one big pain point:
adding cross-cutting, metadata-driven behavior without cluttering the class with boilerplate.

#### Metadata & Reflection

Attach metadata so frameworks can introspect classes. Angular does this:

```ts
@Component({...})
class MyComponent {}

```

The decorator builds a metadata record so Angular knows how to instantiate the component, which template to load, what inputs exist, etc.

#### Behavior Wrapping

Method decorators wrap logic for logging, caching, memoization, rate limiting, etc.

#### Declarative APIs

Decorators provide a DSL for frameworks to define “how your class behaves” without imperative setup code.

Angular, NestJS, TypeORM, MobX, Fastify, tRPC—all rely on them for declarative, metadata-driven design.

### Where?

Decorators can be applied to: `class declaration, method, accessor, property, or parameter`.

### What are Decorators?

A Decorator is a special kind of declaration that can be attached to a `class declaration, method, accessor, property, or parameter`. Decorators use the form `@expression`, where expression must evaluate to a function that will be called at runtime with information about the decorated declaration.

Think of decorators as compile-time annotations that:

- Run once, when the class is defined.
- Can modify definitions (prototype, descriptors).
- Exist mostly to support frameworks that need metadata.
- Are not runtime injection unless you implement it yourself.

## Class Decorators

TypeScript currently has two decorator systems:

- Legacy / “stage 2” decorators ("experimentalDecorators": true) — this is what Angular still relies on.
- New / “stage 3” (standard-ish) decorators (TypeScript 5+) aligned with the TC39 proposal.
  [More Information About this](https://github.com/angular/angular/issues/65739)

```ts
# stage 2
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

# Decorator Factory
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

In Stage 2 / “legacy” TypeScript decorators ("experimentalDecorators": true), “decorator composition” is literally function composition: stacking @f and @g behaves like f(g(x)) for the decorated thing. TypeScript also defines a strict order for when different kinds of decorators run.

```ts
@f
@g
class C {}
```

First, the Pipe decorator will be called, then the Component decorator.
Like `f(g(x))` [docs](https://www.typescriptlang.org/docs/handbook/decorators.html)

## Method Decorator

TypeScript legacy ("stage 2") method decorators are runtime functions that TypeScript calls with (target, propertyKey, descriptor) and that can observe / modify / replace the method by editing (or returning) the PropertyDescriptor. [TypeScript docs](https://www.typescriptlang.org/docs/handbook/decorators.html)

We can define the @enumerable decorator using the following function declaration:

```ts
function enumerable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.enumerable = value;
  };
}
```

- `target` is the prototype for instance methods, or the constructor for static methods.
- `key` is the method name.
- `descriptor` is the `PropertyDescriptor` for the method (can be undefined if you compile below ES5)
- If you return a descriptor, TypeScript uses it as the method’s descriptor (but return values are ignored when targeting < ES5).

```ts
export function LogCalls(): MethodDecorator {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const original = descriptor.value as Function;

    descriptor.value = function (this: unknown, ...args: unknown[]) {
      # we can't use arrow functions here because with FAT we can't access this
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

An Accessor Decorator is declared just before an accessor declaration. The accessor decorator is applied to the Property Descriptor for the accessor and can be used to observe, modify, or replace an accessor’s definitions.

TypeScript disallows decorating both the get and set accessor for a single member.
Instead, all decorators for the member must be applied to the first accessor specified in document order.
This is because decorators apply to a Property Descriptor, which combines both the get and set accessor, not each declaration separately.

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

Here are some examples of Typescript Parameter Decorator that is used in angular framework

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

Next Section: [Modules In Typescript](./../6-modules-in-typescript/modules-in-typescript.md)
