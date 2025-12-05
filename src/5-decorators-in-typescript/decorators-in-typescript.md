# Decorators In Typescript

- What? Why? Where?
- Class Decorators
- Method Decorators
- Property Decorators
- Accessor Decorators
- Parameter Decorators

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

```ts
function Component(constructor: Function) {
  constructor.prototype.someId = Date.now();
  constructor.prototype.insertInDom = () => {
    console.log("inside insertInDom");
  };
}

@Component
class SampleComponent {}
```

Here is the Js Generated

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
