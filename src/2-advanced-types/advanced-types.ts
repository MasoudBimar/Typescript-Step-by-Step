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