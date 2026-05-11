import { describe, expect, it } from "vitest";
import { Queue, reverseQueue, LinkedListQueue } from "./4-queues";

describe('Queue', () => {
  describe('enqueue', () => {
    it('should enqueue an item to the queue', () => {
      const queue = new Queue<number>();
      queue.enqueue(1);
      expect(queue.size()).toBe(1);
      expect(queue.peek()).toBe(1);
    });

    it('should enqueue multiple items', () => {
      const queue = new Queue<number>();
      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);
      expect(queue.size()).toBe(3);
      expect(queue.peek()).toBe(1);
    });
  });

  describe('dequeue', () => {
    it('should dequeue the front item from the queue', () => {
      const queue = new Queue<number>();
      queue.enqueue(1);
      queue.enqueue(2);
      const dequeued = queue.dequeue();
      expect(dequeued).toBe(1);
      expect(queue.size()).toBe(1);
      expect(queue.peek()).toBe(2);
    });

    it('should return undefined when dequeuing from empty queue', () => {
      const queue = new Queue<number>();
      const dequeued = queue.dequeue();
      expect(dequeued).toBeUndefined();
    });
  });

  describe('peek', () => {
    it('should return the front item without removing it', () => {
      const queue = new Queue<number>();
      queue.enqueue(1);
      queue.enqueue(2);
      const peeked = queue.peek();
      expect(peeked).toBe(1);
      expect(queue.size()).toBe(2);
    });

    it('should return undefined for empty queue', () => {
      const queue = new Queue<number>();
      const peeked = queue.peek();
      expect(peeked).toBeUndefined();
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty queue', () => {
      const queue = new Queue<number>();
      expect(queue.isEmpty()).toBe(true);
    });

    it('should return false for non-empty queue', () => {
      const queue = new Queue<number>();
      queue.enqueue(1);
      expect(queue.isEmpty()).toBe(false);
    });
  });

  describe('size', () => {
    it('should return 0 for empty queue', () => {
      const queue = new Queue<number>();
      expect(queue.size()).toBe(0);
    });

    it('should return correct size after enqueues', () => {
      const queue = new Queue<number>();
      queue.enqueue(1);
      queue.enqueue(2);
      expect(queue.size()).toBe(2);
    });

    it('should return correct size after dequeues', () => {
      const queue = new Queue<number>();
      queue.enqueue(1);
      queue.enqueue(2);
      queue.dequeue();
      expect(queue.size()).toBe(1);
    });
  });
});

describe('reverseQueue', () => {
  it('should reverse an empty queue', () => {
    const queue = new Queue<number>();
    const reversed = reverseQueue(queue);
    expect(reversed.isEmpty()).toBe(true);
  });

  it('should reverse a queue with one element', () => {
    const queue = new Queue<number>();
    queue.enqueue(1);
    const reversed = reverseQueue(queue);
    expect(reversed.size()).toBe(1);
    expect(reversed.peek()).toBe(1);
  });

  it('should reverse a queue with multiple elements', () => {
    const queue = new Queue<number>();
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);
    const reversed = reverseQueue(queue);
    expect(reversed.size()).toBe(3);
    expect(reversed.dequeue()).toBe(3);
    expect(reversed.dequeue()).toBe(2);
    expect(reversed.dequeue()).toBe(1);
  });

  it('should not modify the original queue', () => {
    const queue = new Queue<number>();
    queue.enqueue(1);
    queue.enqueue(2);
    const reversed = reverseQueue(queue);
    expect(queue.size()).toBe(0); // Original queue is emptied during reversal
    expect(reversed.size()).toBe(2);
  });
});

describe('LinkedListQueue', () => {
  describe('enqueue', () => {
    it('should enqueue an item to the queue', () => {
      const queue = new LinkedListQueue<number>();
      queue.enqueue(1);
      expect(queue.size()).toBe(1);
      expect(queue.peek()).toBe(1);
    });

    it('should enqueue multiple items', () => {
      const queue = new LinkedListQueue<number>();
      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);
      expect(queue.size()).toBe(3);
      expect(queue.peek()).toBe(1);
    });
  });

  describe('dequeue', () => {
    it('should dequeue the front item from the queue', () => {
      const queue = new LinkedListQueue<number>();
      queue.enqueue(1);
      queue.enqueue(2);
      const dequeued = queue.dequeue();
      expect(dequeued).toBe(1);
      expect(queue.size()).toBe(1);
      expect(queue.peek()).toBe(2);
    });

    it('should return null when dequeuing from empty queue', () => {
      const queue = new LinkedListQueue<number>();
      const dequeued = queue.dequeue();
      expect(dequeued).toBeNull();
    });
  });

  describe('peek', () => {
    it('should return the front item without removing it', () => {
      const queue = new LinkedListQueue<number>();
      queue.enqueue(1);
      queue.enqueue(2);
      const peeked = queue.peek();
      expect(peeked).toBe(1);
      expect(queue.size()).toBe(2);
    });

    it('should return null for empty queue', () => {
      const queue = new LinkedListQueue<number>();
      const peeked = queue.peek();
      expect(peeked).toBeNull();
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty queue', () => {
      const queue = new LinkedListQueue<number>();
      expect(queue.isEmpty()).toBe(true);
    });

    it('should return false for non-empty queue', () => {
      const queue = new LinkedListQueue<number>();
      queue.enqueue(1);
      expect(queue.isEmpty()).toBe(false);
    });
  });

  describe('size', () => {
    it('should return 0 for empty queue', () => {
      const queue = new LinkedListQueue<number>();
      expect(queue.size()).toBe(0);
    });

    it('should return correct size after enqueues', () => {
      const queue = new LinkedListQueue<number>();
      queue.enqueue(1);
      queue.enqueue(2);
      expect(queue.size()).toBe(2);
    });

    it('should return correct size after dequeues', () => {
      const queue = new LinkedListQueue<number>();
      queue.enqueue(1);
      queue.enqueue(2);
      queue.dequeue();
      expect(queue.size()).toBe(1);
    });
  });
});
