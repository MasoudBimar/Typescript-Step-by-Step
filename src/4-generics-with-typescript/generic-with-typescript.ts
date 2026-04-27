interface User {
    id: number;
    name: string;
    birthDate: Date;
}

type CustomReadonly<T> = {
    readonly [K in keyof T]: T[K];
}

let newUser: CustomReadonly<User> = {
    id: 2,
    name: 'Masoud',
    birthDate: new Date()
}

// newUser.name = 'somethingElse'; // Error: Cannot assign to 'name' because it is a read-only property.

function wrapValue<T>(value: T) {
    return { value };
}

let wrapped = wrapValue('test');

console.log(wrapped);