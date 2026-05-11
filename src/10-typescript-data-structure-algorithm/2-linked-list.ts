export class Node<T> {
  value: T;
  next: Node<T> | null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
  }
}

export class LinkedList<T> {
  private head: Node<T> | null;
  private tail: Node<T> | null;
  public length: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  append(value: T): void {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      if (this.tail) {
        this.tail.next = newNode;
      }
      this.tail = newNode;
    }
    this.length++;
  }

  prepend(value: T): void {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }
    this.length++;
  }

  delete(value: T): void {
    if (!this.head) return;

    if (this.head.value === value) {
      this.head = this.head.next;
      this.length--;
      if (this.length === 0) {
        this.tail = null;
      }
      return;
    }

    let currentNode = this.head;
    while (currentNode.next) {
      if (currentNode.next.value === value) {
        currentNode.next = currentNode.next.next;
        this.length--;
        if (!currentNode.next) {
          this.tail = currentNode;
        }
        return;
      }
      currentNode = currentNode.next;
    }
  }

  find(value: T): Node<T> | null {
    let currentNode = this.head;
    while (currentNode) {
      if (currentNode.value === value) {
        return currentNode;
      }
      currentNode = currentNode.next;
    }
    return null;
  }

  toArray(): T[] {
    let array: T[] = [];
    if (this.length > 0) {
      let currentNode = this.head;
      while (currentNode) {
        array.push(currentNode.value);
        currentNode = currentNode.next;
      }
    }
    return array;
  }

  reverse(): void {
    if (this.length < 1) {
      return;
    }
    let prevNode: Node<T> | null = this.head;
    let currentNode: Node<T> | null = this.head?.next ?? null;

    while (currentNode !== null) {
      let next = currentNode.next;
      currentNode.next = prevNode;
      prevNode = currentNode;
      currentNode = next;
    }

    this.tail = this.head;
    if (this.tail) {
      this.tail.next = null;
    }
    this.head = prevNode;
  }

  getFirst(): T | null {
    return this.head ? this.head.value : null;
  }

  getLast(): T | null {
    return this.tail ? this.tail.value : null;
  }
}

// let list = new LinkedList<number>();
// list.append(1);
// list.append(2);
// list.append(3);
// list.reverse();
// console.log(list.head?.value); // 3
// console.log(list.tail?.value); // 1
// console.log(list.toArray()); // [3, 2, 1]

// list.prepend(0);
// console.log(list.toArray()); // [0, 3, 2, 1]
