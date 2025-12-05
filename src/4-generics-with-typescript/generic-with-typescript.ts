interface User {
    id: number;
    name: string;
    birthDate: Date;
}

type Readonly<T> = {
    readonly [K in keyof T]: T[K];
}

let newUser: Readonly<User> = {
    id: 2,
    name: 'Masoud',
    birthDate: new Date()
}

newUser.name = 'somethingElse'; // Error: Cannot assign to 'name' because it is a read-only property.