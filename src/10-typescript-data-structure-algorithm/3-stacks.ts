import { LinkedList } from "./2-linked-list";

export class Stack<T>{
    data: T[] = [];

    push(item: T) {
        this.data.push(item);
    }

    pop(): T | undefined {
        return this.data.pop();
    }

    peek(): T | undefined {
        return this.data[this.data.length - 1];
    }

    isEmpty(): boolean {
        return this.data.length === 0;
    }

    size(): number {
        return this.data.length;
    }
}

export function reverseString(str: string): string {
    const stack = new Stack<string>();
    for (const char of str) {
        stack.push(char);
    }

    let reversed = '';
    while (!stack.isEmpty()) {
        reversed += stack.pop();
    }
    return reversed;
}

export class MinStack {
    private stack: number[] = [];
    private minStack: number[] = [];

    push(x: number): void {
        this.stack.push(x);
        if (this.minStack.length === 0 || x <= (this.getMin() ?? Infinity)) {
            this.minStack.push(x);
        }
    }

    pop(): void {
        const popped = this.stack.pop();
        if (popped !== undefined && popped === this.getMin()) {
            this.minStack.pop();
        }
    }

    top(): number | undefined {
        return this.stack[this.stack.length - 1];
    }

    getMin(): number | undefined {
        return this.minStack[this.minStack.length - 1];
    }
}

export class LinkedListStack<T> {
    private list: LinkedList<T> = new LinkedList();

    push(item: T): void {
        this.list.prepend(item);
    }

    pop(): T | undefined {
        if (this.list.length === 0) {
            return undefined;
        }
        const value = this.list.getFirst();
        if (value !== null) {
            this.list.delete(value);
            return value;
        } else {
            return undefined;
        }
    }

    peek(): T | undefined {
        return this.list.getFirst() ?? undefined;
    }

    isEmpty(): boolean {
        return this.list.getFirst() === null;
    }

    size(): number {
        return this.list.length;
    }
}