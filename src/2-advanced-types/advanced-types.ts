// Typescript objects
let employeeObj: {
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
console.log(employeeObj);

// Type Aliases
type Employee = {
    readonly id: number,
    name: string,
    retire: (date: Date) => void
};

let newEmployee: Employee = {
    id: 2,
    name: "Jane Smith",
    retire: (date: Date) => {
        console.log(date);
    }
};
console.log(newEmployee);

// Union Types

function kgToLbs(weight: number | string): number {
    // Narrowing
    if (typeof weight === "number") {
        return weight * 2.2;
    } else {
        return parseFloat(weight) * 2.2;
    }
}

console.log(kgToLbs(10));
console.log(kgToLbs("10kg"));

// Intersection example (small atomic insertion)
type Draggable = { drag: () => void };

type Resizable = { resize: () => void };

type UIWidget = Draggable & Resizable;

const textBox: UIWidget = {
    drag: () => console.log("dragging"),
    resize: () => console.log("resizing")
};

textBox.drag();
textBox.resize();
// Discriminated / Tagged Unions
type NetworkLoadingState = { state: "loading" };
type NetworkFailedState = { state: "failed"; code: number };
type NetworkSuccessState = {
    state: "success";
    response: { title: string; duration: number; summary: string };
};

type NetworkState =
    | NetworkLoadingState
    | NetworkFailedState
    | NetworkSuccessState;

function handleNetwork(state: NetworkState) {
    switch (state.state) {
        case "loading":
            console.log("Loading...");
            break;
        case "failed":
            console.log("Failed with code:", state.code);
            break;
        case "success":
            console.log("Success:", state.response.title);
            break;
        default:
            const _exhaustiveCheck: never = state;
            return _exhaustiveCheck;
    }
}

handleNetwork({ state: "loading" });
handleNetwork({ state: "failed", code: 500 });
handleNetwork({ state: "success", response: { title: "OK", duration: 123, summary: "done" } });

// Nullable values + Optional chaining
function greet(name: string | null | undefined) {
    console.log(name?.toUpperCase() ?? "Hey there!");
}

greet("Alice");
greet(null);

// unknown vs any
function safeParse(input: unknown) {
    if (typeof input === "string") {
        console.log("string length:", input.length);
    } else if (typeof input === "number") {
        console.log("number value:", input.toFixed(2));
    } else if (Array.isArray(input)) {
        console.log("array length:", input.length);
    } else {
        console.log("unknown type — cannot operate directly");
    }
}

safeParse("hello");
safeParse(3.1415);
safeParse([1, 2, 3]);

// never type (exhaustiveness & functions that never return)
function fail(message: string): never {
    throw new Error(message);
}

function processValue(x: string | number) {
    if (typeof x === "string") {
        console.log("string branch");
    } else if (typeof x === "number") {
        console.log("number branch");
    } else {
        const _check: never = x;
        return _check;
    }
}

processValue("ok");
processValue(42);
