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
