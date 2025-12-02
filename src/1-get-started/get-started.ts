console.log("Hello, TypeScript!");

let x: number = 5;
let x2: number = 123_456_789;
let course: string = "TypeScript Basics";
let is_published: boolean = true;
let level; // any type
let y: string = "Hello, World!";

function greet(name: string): string {
    return `${y} My name is ${name} and my lucky number is ${x}.`;
}

greet("TypeScript User");

// Arrays

let numbers = [1, 2, 3, 4, 5, 'test']; // inferred as (number | string)[]

let typed_numbers: number[] = [10, 20, 30, 40, 50];


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