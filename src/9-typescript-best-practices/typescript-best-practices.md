user.name# Typescript Best Practices

- [Typescript Best Practices](#typescript-best-practices)
  - [Prefer Type Annotations to Type Assertions](#prefer-type-annotations-to-type-assertions)

## Prefer Type Annotations to Type Assertions

Type annotations are generally safer than type assertions because they allow the compiler to catch type errors.
Type assertions can lead to runtime errors if the asserted type is incorrect.
Therefore, it's recommended to use type annotations whenever possible and reserve type assertions for cases where you are certain of the type and need to override the compiler's inference.

```ts
interface Person {
  name: string;
  age: number;
}
let person: Person = { name: "Alice", age: 30 }; // Type annotation explicitly defines the type of 'person'

let person = { name: "Alice", age: 30 } as Person; // Type assertion is less safe and should be used with caution

let anotherPerson = {} as Person; // This will compile, but 'anotherPerson' does not actually have the properties of 'Person', leading to potential runtime errors

let yetAnotherPerson: Person = {}; // This will cause a compile-time error because the object does not conform to the 'Person' interface, which is safer than the previous example
```

Lets check all the possible way of using type annotations and type assertions in the following sections.

```ts
type UserType = {
  name: string;
  age: number;
};

interface UserInterface {
  name: string;
  age: number;
}

let user1: UserType = { name: "Alice", age1: 30 }; //Error: Object literal may only specify known properties, and 'age1' does not exist in type 'UserType'
let user2: UserInterface = { name: "Bob", age1: 25 }; //Error: Object literal may only specify known properties, and 'age1' does not exist in type 'UserType'

let user3 = { name: "Alice", age1: 30 } as UserType; //Error: Conversion of type '{ name: string; age1: number; }' to type 'UserInterface' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
let user4 = { name: "Bob", age1: 25 } as UserInterface; //Error: Conversion of type '{ name: string; age1: number; }' to type 'UserInterface' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.

let user5 = {} as UserType; // This will compile but user5 will have undefined properties
let user6 = {} as UserInterface; // This will compile but user6 will have undefined properties

let user7: UserType = {}; //Error: Type '{}' is missing the following properties from type 'UserType': name, age
let user8: UserInterface = {}; //Error: Type '{}' is missing the following properties from type 'UserInterface': name, age
```

Use Type annotation over type assertion in map methods to ensure type safety.

```ts
interface User {
  id: number;
  name: string;
}
const userIds = [1, 2, 3];

const badApproachUsers = userIds.map((id) => {
  return { id, name: `User${id}` };
}) as User[]; // Bad way: Type assertion is less safe: can't catch { }

const secondBadApproachUsers = userIds.map((id) => {
  return { id, name: `User${id}` } as User;
}); // Bad way: Type assertion is less safe: can't catch { }

const notGoodApproachUsers = userIds.map((id) => {
  return { id, name: `User${id}` };
}); // Bad way: No type annotation, so the compiler cannot catch type errors: if the object structure changes, it may lead to runtime errors

const goodApproachUsers: User[] = userIds.map((id) => {
  const user: User = { id, name: `User${id}` }; // Type annotation ensures that the object conforms to the User interface
  return user;
}); // Good way: Type annotation allows the compiler to catch type errors: compiler will throw an error if the object structure does not conform to the User interface

const betterApproachUsers = userIds.map(
  (id): User => ({
    id,
    name: `User${id}`,
  }),
); // better way: not verbose and type annotation ensures type safety: if the object structure changes, the compiler will throw an error
```
