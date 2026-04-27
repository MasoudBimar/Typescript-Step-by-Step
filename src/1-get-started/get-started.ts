console.log("Hello, TypeScript!");

// ----------------------------------------------Static Typing

let x: number = 5;
let x2: number = 123_456_789;
let course: string = "TypeScript Basics";
let is_published: boolean = true;
let level; // any type
let y: string = "Hello, World!";

console.log(x, x2, course, is_published, level, y);

function greet(name: string): string {
    return `${y} My name is ${name} and my lucky number is ${x}.`;
}

greet("TypeScript User");

// Arrays

let numbers = [1, 2, 3, 4, 5, 'test']; // inferred as (number | string)[]
console.log(numbers);

let typed_numbers: number[] = [10, 20, 30, 40, 50];
console.log(typed_numbers);

function calculateTax(income: number, taxYear: number = 2022): number {
    if (taxYear < 2023) {
        return income * 1.2;
    } else {
        return income * 1.3;
    }
}

calculateTax(10_000, 2022);
calculateTax(10_000, 2023);

// Typescript objects
let employee: {
    readonly id: number,
    name: string,
    retire: (date: Date) => void
} = {
    id: 1,
    name: "John Doe",
    retire: (date: Date) => {
        console.log(date);
    }
};

console.log(employee);

// ------------------------Primitive + unions + narrowing
type Id = string | number;

function formatId(id: Id): string {
    if (typeof id === "string") return id.toUpperCase();
    return id.toString(10);
}

console.log(formatId("abc"));
console.log(formatId(42));

// ------------------------Interfaces + structural typing

interface User {
    id: string;
    email: string;
    isAdmin?: boolean; // optional
}

function canAccessAdminPanel(user: User): boolean {
    return user.isAdmin === true;
}

const u1: User = { id: "u1", email: "a@b.com" };
const u2 = { id: "u2", email: "x@y.com", isAdmin: true, extra: "ignored" }; // extra ok (structural)

console.log(canAccessAdminPanel(u1));
console.log(canAccessAdminPanel(u2));


// Generics + constraints

function pluck<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

const person = { name: "Ada", age: 37 };
const age = pluck(person, "age"); // number
// pluck(person, "unknown"); // ❌ compile error

// ------------------------Discriminated unions (great for teaching)

type ApiResult =
    | { kind: "success"; data: { id: string } }
    | { kind: "error"; error: { message: string; code: number } };

function handle(result: ApiResult) {
    switch (result.kind) {
        case "success":
            return result.data.id;
        case "error":
            throw new Error(`${result.error.code}: ${result.error.message}`);
    }
}


// ----------------------------------------------Code Completion (types drive your IDE)
// ------------------------Literal unions for safe autocomplete

type Theme = "light" | "dark";
type Align = "left" | "center" | "right";

function setUi(_theme: Theme, _align: Align) {
    // IDE suggests: light/dark and left/center/right
}

setUi("dark", "center"); // setUi("blue", "middle"); // ❌ compile error


// ------------------------“as const” for strongly-typed constants

const routes = {
    home: "/",
    users: "/users",
    settings: "/settings",
} as const;

type RouteKey = keyof typeof routes;  // "home" | "users" | "settings"
type RoutePath = (typeof routes)[RouteKey]; // "/" | "/users" | "/settings"

function navigateTo(_path: RoutePath) { }

navigateTo(routes.users); // navigateTo("/nope"); // ❌ compile error

// ------------------------Typed event emitter pattern

type Events = {
    "user:created": { id: string; email: string };
    "user:deleted": { id: string };
};

class TypedEmitter<E extends Record<string, unknown>> {
    private listeners = new Map<keyof E, Array<(payload: any) => void>>();

    on<K extends keyof E>(event: K, fn: (payload: E[K]) => void) {
        const arr = this.listeners.get(event) ?? [];
        arr.push(fn as any);
        this.listeners.set(event, arr);
    }

    emit<K extends keyof E>(event: K, payload: E[K]) {
        this.listeners.get(event)?.forEach((fn) => fn(payload));
    }
}

const bus = new TypedEmitter<Events>();

bus.on("user:created", (p) => {
    console.log(p.email); // autocomplete: id, email
});

bus.emit("user:created", { id: "1", email: "a@b.com" });
// bus.emit("user:created", { id: "1" }); // ❌ compile error


// ----------------------------------------------Refactoring (make changes confidently)
// ------------------------Rename-safe models + function signatures
interface Invoice {
    invoiceId: string;
    totalCents: number;
}

function printInvoice(i: Invoice) {
    return `${i.invoiceId}: ${i.totalCents / 100}`;
}

// Rename `totalCents` -> `amountCents`
// TypeScript shows all affected usages immediately.


// ------------------------Extract types from values (prevents drift)
const config = {
    retries: 3,
    mode: "safe",
    endpoint: "https://api.example.com",
} as const;

type Config = typeof config;

function init(c: Config) {
    // c.mode autocomplete is "safe" (literal), not string
}


// ------------------------Exhaustiveness checks (future-proof refactors)
type Status = "idle" | "loading" | "success" | "error";

function render(status: Status): string {
    switch (status) {
        case "idle": return "Start";
        case "loading": return "Loading...";
        case "success": return "Done";
        case "error": return "Oops";
        default: {
            const _exhaustive: never = status; // if Status changes, compiler points here
            return _exhaustive;
        }
    }
}

// ------------------------------------------------Shorthand notation and newer TS/JS features
// ------------------------Optional chaining + nullish coalescing
type Profile = { user?: { name?: string } };

function greeting(p: Profile) {
    const name = p.user?.name ?? "Anonymous";
    return `Hi, ${name}!`;
}

// ------------------------Parameter properties (class shorthand)
class HttpError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        public readonly code?: string
    ) {
        super(message);
    }
}

throw new HttpError("Not Found", 404, "NOT_FOUND");

// ------------------------Template literal types (fun+useful)

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type ApiRoute = `/api/${string}`;

type RequestKey = `${HttpMethod} ${ApiRoute}`;

const k1: RequestKey = "GET /api/users";
// const k2: RequestKey = "FETCH /api/users"; // ❌

// ------------------------satisfies (keeps inference but enforces shape)
type Role = "admin" | "user";
type Permissions = Record<Role, readonly string[]>;

const permissions = {
    admin: ["read", "write", "delete"],
    user: ["read"],
} satisfies Permissions;

// permissions.admin is still inferred as string[] literals if you use as const etc,
// but the object must match Permissions.


// ------------------------Top-level await (ESM environments)
// In ESM (e.g., Node with "type": "module")
// Top-level 'await' expressions are only allowed when the 'module' option is set to 'es2022', 'esnext', 'system', 'node16', 'node18', 'node20', 'nodenext', or 'preserve', and the 'target' option is set to 'es2017' or higher.
// const res = await fetch("https://example.com");
// console.log(res.status);


// structural typing or duck typing

type NormalUser = {
    firstName: string;
    lastName: string;
}

type SuperUser = {
    firstName: string;
    lastName: string;
    permissionID: string;
}

function sopposedToAcceptNormalUser(user: NormalUser) {
    console.log(user.firstName);
}

let superUserInstance: SuperUser = { firstName: 'john', lastName: 'Doe', permissionID: 'zxcvbnm' };
sopposedToAcceptNormalUser(superUserInstance); // A function accepts a value if its shape (structure) matches the expected type — not based on its declared or nominal type
