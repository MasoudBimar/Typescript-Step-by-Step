import { LinkedList } from "./2-linked-list";
import { Stack } from "./3-stacks";

export class Queue<T>{
    data: T[] = [];

    enqueue(item: T) {
        this.data.push(item);
    }

    dequeue(): T | undefined {
        return this.data.shift();
    }

    peek(): T | undefined {
        return this.data[0];
    }

    isEmpty(): boolean {
        return this.data.length === 0;
    }

    size(): number {
        return this.data.length;
    }
}

export function reverseQueue<T>(queue: Queue<T>): Queue<T> {
    const stack = new Stack<T>();
    while (!queue.isEmpty()) {
        stack.push(queue.dequeue()!);
    }

    const reversedQueue = new Queue<T>();
    while (!stack.isEmpty()) {
        reversedQueue.enqueue(stack.pop()!);
    }
    return reversedQueue;
}

export class LinkedListQueue<T>{

    data: LinkedList<T> = new LinkedList<T>();

    enqueue(item: T) {
        this.data.append(item);
    }

    dequeue(): T | null {
        const first = this.data.getFirst();
        if (first !== null) {
            this.data.delete(first);
        }
        return first;
    }
    
    peek(): T | null {
        return this.data.getFirst();
    }

    isEmpty(): boolean {
        return this.data.length === 0;
    }

    size(): number {
        return this.data.length;
    }
    
}