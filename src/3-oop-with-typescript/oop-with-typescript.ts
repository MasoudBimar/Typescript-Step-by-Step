class UserClass {
  id: number;
  name: string;
  role: string;
  constructor(id: number, name: string, role: string) {
    this.id = id;
    this.name = name;
    this.role = role;
  }

  get displayName(): string {
    return `${this.role}: ${this.name}`;
  }
}

const userClass1 = new UserClass(1, "Alice", "Admin");
console.log(userClass1.displayName);

class User {
  constructor(public id: number, private name: string, protected role: string) { }

  get displayName(): string {
    return `${this.role}: ${this.name}`;
  }
}

const user1 = new User(1, "Alice", "Admin");
console.log(user1.displayName);

class Employee extends User {
  constructor(id: number, name: string, role = "Employee") {
    super(id, name, role);
  }

  calculateSalary(): number {
    return 5000;
  }
}

const employee1 = new Employee(2, "Bob");
console.log(employee1.displayName);
console.log(employee1.calculateSalary());