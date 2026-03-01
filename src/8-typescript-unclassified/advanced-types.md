# TypeScript Advanced Types

## TypeScript Conditional Types

- You can create different types based on a condition.
- This gives flexibility in type definition

```ts
type ApiResponse<T> = T extends "error" ? { status: 400; message: string } : { status: 200; data: any };

type ErrorResponse = ApiResponse<"error">; // { status: 400, message: string }
type SuccessResponse = ApiResponse<"success">; // { status: 200, data: any }
```

Meaning:

If `T` is `error` the type becomes `{ status: 400, message: string }`

Otherwise the type becomes `{ status: 200, data: any }`

So:

`ApiResponse<"error">` produces an error response type

`ApiResponse<"success">` produces a success response type

Better Ways to Use Conditional Types:

```ts
type ApiResponse<T extends "error" | "success", D = unknown> = T extends "error" ? { status: 400; message: string } : { status: 200; data: D };

// Usage

type SuccessUser = ApiResponse<"success", { id: number; name: string }>;
```

Often better way using type discriminators:

```ts
type ApiResponse<D> = { status: 200; data: D } | { status: 400; message: string };

// This works great with control flow narrowing:

function handle<D>(res: ApiResponse<D>) {
  if (res.status === 200) {
    res.data; // typed
  } else {
    res.message; // typed
  }
}
```

## Template Literal Types

- You can create string types based on patterns.

```ts
type EndPoint = `/api/${string}`;

const userEndpoint: EndPoint = "/api/users"; // valid
const invalidEndpoint: EndPoint = "/home"; // error
```

## Type Safety using Generics

```ts
function safeLocalStorage<T>(key: string, defaultValue: T) {
  return {
    get: (): T => {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    },
    set: (value: T) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
  };
}

const userStorage = safeLocalStorage("user", { name: "", age: 0 });
userStorage.set({ name: "John", age: 25 });
const user = userStorage.get();
```

## Type Guards

```ts
type User = { name: string; age: number };
type Admin = { name: string; permissions: string[] };

function isAdmin(user: User | Admin): user is Admin {
  return "permissions" in user;
}

function handleUser(user: User | Admin) {
  if (isAdmin(user)) {
    console.log(user.permissions);
  }
}
```

Better Guard Example:

```ts
function isAdmin(user: unknown): user is Admin {
  return typeof user === "object" && user !== null && "permissions" in user && Array.isArray((user as any).permissions);
}
```

## Utility Types

TypeScript provides built-in utility types to manipulate types.

- `Partial<T>`: Makes all properties optional.
- `Required<T>`: Makes all properties required.
- `Readonly<T>`: Makes all properties read-only.
- `Pick<T, K>`: Creates a type by picking properties `K` from `T`.
- `Omit<T, K>`: Creates a type by omitting properties `K` from `T`.
- `Record<K, T>`: Creates a type with keys `K` and values of type `T`.
- `Exclude<T, U>`: Excludes from `T` those types that are assignable to `U`.
- `Extract<T, U>`: Extracts from `T` those types that are assignable to `U`.
- `NonNullable<T>`: Excludes `null` and `undefined` from `T`.
- `ReturnType<T>`: Gets the return type of a function type `T`.
- `Parameters<T>`: Gets the parameter types of a function type `T` as a tuple.
- `ConstructorParameters<T>`: Gets the parameter types of a constructor function type `T` as a tuple.
- `InstanceType<T>`: Gets the instance type of a constructor function type `T`.
- `ThisType<T>`: Used to specify the type of `this` in an object literal.
- `Uppercase<S>`, `Lowercase<S>`, `Capitalize<S>`, `Uncapitalize<S>`: String manipulation types.
- `Awaited<T>`: Unwraps the type of a Promise.

```ts
type User = { name: string; age: number };

type PartialUser = Partial<User>; // { name?: string; age?: number }
type RequiredUser = Required<PartialUser>; // { name: string; age: number }
type ReadonlyUser = Readonly<User>; // { readonly name: string; readonly age: number }
type UserName = Pick<User, "name">; // { name: string }
type UserWithoutAge = Omit<User, "age">; // { name: string }
type UserRecord = Record<string, User>; // { [key: string]: User }
type UserKeys = keyof User; // "name" | "age"
type UserValues = User[UserKeys]; // string | number
type NonNullableUser = NonNullable<User | null>; // User
type UserReturnType = ReturnType<() => User>; // User
type UserParameters = Parameters<(name: string, age: number) => User>; // [string, number]
type UserConstructorParameters = ConstructorParameters<typeof User>; // [string, number]
type UserInstanceType = InstanceType<typeof User>; // User
type ThisTypeExample = ThisType<{ name: string }>; // { name: string }
type UppercaseName = Uppercase<"user">; // "USER"
type AwaitedUser = Awaited<Promise<User>>; // User
```

-- `Partial` is commonly used for update operations where you only want to provide some of the properties.
-- `Record` is usefull for keeping configuratios & status maps.
-- `Omit` & `Pick` is usefull for working with APIs to deal with part of data.
-- `Readonly` is usefull for immutability & preventing accidental changes.
-- `keyof` & indexed access types are usefull for dynamic property access & type manipulation.
-- `NonNullable` is usefull for ensuring values are not null or undefined.
-- `ReturnType` & `Parameters` are usefull for working with function types and ensuring type safety.
