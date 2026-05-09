type UserType = {
    name: string;
    age: number;
};

interface UserInterface {
    name: string;
    age: number;
}

let user1: UserType = { name: "Alice", age1: 30 }; //! Object literal may only specify known properties, and 'age1' does not exist in type 'UserType'
let user2: UserInterface = { name: "Bob", age1: 25 }; //! Object literal may only specify known properties, and 'age1' does not exist in type 'UserType'

let user3 = { name: "Alice", age1: 30 } as UserType; //! Conversion of type '{ name: string; age1: number; }' to type 'UserInterface' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
let user4 = { name: "Bob", age1: 25 } as UserInterface; //! Conversion of type '{ name: string; age1: number; }' to type 'UserInterface' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.

let user5 = {} as UserType; // This will compile but user5 will have undefined properties
let user6 = {} as UserInterface; // This will compile but user6 will have undefined properties

let user7: UserType = {}; //! Type '{}' is missing the following properties from type 'UserType': name, age
let user8: UserInterface = {}; //! Type '{}' is missing the following properties from type 'UserInterface': name, age

console.log(user1);
console.log(user2);
console.log(user3);
console.log(user4);
console.log(user5);
console.log(user6);
console.log(user7);
console.log(user8);

///////////////////////////////////////

interface User {
    id: number;
    name: string;
}
const userIds = [1, 2, 3];

const badApproachUsers = userIds.map((id) => {
    return { id, name: `User${id}` };
}) as User[]; // Bad way: Type assertion is less safe: cant catch { }

const secondBadApproachUsers = userIds.map((id) => {
    return { id, name: `User${id}` } as User;
}); // Bad way: Type assertion is less safe: cant catch {  }

const notGoodApproachUsers = userIds.map((id) => {
    return { id, name1: `User${id}` };
}); // Bad way: No type annotation, so the compiler cannot catch type errors: if the object structure changes, it may lead to runtime errors

const goodApproachUsers: User[] = userIds.map((id) => {
    const user: User = { id, name1: `User${id}` }; // Type annotation ensures that the object conforms to the User interface
    return user;
}); // Good way: Type annotation allows the compiler to catch type errors: compiler will throw an error if the object structure does not conform to the User interface

const betterApproachUsers = userIds.map(
    (id): User => ({
        id,
        name1: `User${id}`,
    }),
); // better way: not verbose and type annotation ensures type safety: if the object structure changes, the compiler will throw an error

console.log(badApproachUsers);
console.log(secondBadApproachUsers);
console.log(notGoodApproachUsers);
console.log(goodApproachUsers);
console.log(betterApproachUsers);