# Generic With Typescript

- Generic Classes
- Generic Functions
- Generic Interfaces
- Generic Constraints
- Type Mapping

## What? Why? Where?

```ts
class Box<T> {
  constructor(private value: T) {}

  get(): T {
    return this.value;
  }
}

const numBox = new Box<number>(10);
const strBox = new Box<string>("hello");

console.log(numBox.get()); // number
console.log(strBox.get()); // string
```

Another example:

```ts
class KeyValuePair<K, V> {
  constructor(public key: T, public value: V) {}
}

let pair = new KeyValuePair<string, number>("1", 123);
let pair2 = new KeyValuePair("1", 123); // without  supplying the generic type argumants compiler infer the types based on constructor parameters
```
