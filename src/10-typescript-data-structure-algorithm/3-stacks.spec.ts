import { describe, expect, it } from "vitest";
import { Stack, reverseString, MinStack, LinkedListStack } from "./3-stacks";

describe('Stack', () => {
  describe('push', () => {
    it('should push an item onto the stack', () => {
      const stack = new Stack<number>();
      stack.push(1);
      expect(stack.size()).toBe(1);
      expect(stack.peek()).toBe(1);
    });

    it('should push multiple items', () => {
      const stack = new Stack<number>();
      stack.push(1);
      stack.push(2);
      stack.push(3);
      expect(stack.size()).toBe(3);
      expect(stack.peek()).toBe(3);
    });
  });

  describe('pop', () => {
    it('should pop the top item from the stack', () => {
      const stack = new Stack<number>();
      stack.push(1);
      stack.push(2);
      const popped = stack.pop();
      expect(popped).toBe(2);
      expect(stack.size()).toBe(1);
      expect(stack.peek()).toBe(1);
    });

    it('should return undefined when popping from empty stack', () => {
      const stack = new Stack<number>();
      const popped = stack.pop();
      expect(popped).toBeUndefined();
    });
  });

  describe('peek', () => {
    it('should return the top item without removing it', () => {
      const stack = new Stack<number>();
      stack.push(1);
      stack.push(2);
      const peeked = stack.peek();
      expect(peeked).toBe(2);
      expect(stack.size()).toBe(2);
    });

    it('should return undefined for empty stack', () => {
      const stack = new Stack<number>();
      const peeked = stack.peek();
      expect(peeked).toBeUndefined();
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty stack', () => {
      const stack = new Stack<number>();
      expect(stack.isEmpty()).toBe(true);
    });

    it('should return false for non-empty stack', () => {
      const stack = new Stack<number>();
      stack.push(1);
      expect(stack.isEmpty()).toBe(false);
    });
  });

  describe('size', () => {
    it('should return 0 for empty stack', () => {
      const stack = new Stack<number>();
      expect(stack.size()).toBe(0);
    });

    it('should return correct size after pushes', () => {
      const stack = new Stack<number>();
      stack.push(1);
      stack.push(2);
      expect(stack.size()).toBe(2);
    });

    it('should return correct size after pops', () => {
      const stack = new Stack<number>();
      stack.push(1);
      stack.push(2);
      stack.pop();
      expect(stack.size()).toBe(1);
    });
  });
});

describe('reverseString', () => {
  it('should reverse an empty string', () => {
    expect(reverseString('')).toBe('');
  });

  it('should reverse a single character string', () => {
    expect(reverseString('a')).toBe('a');
  });

  it('should reverse a string with multiple characters', () => {
    expect(reverseString('hello')).toBe('olleh');
  });

  it('should reverse a string with spaces', () => {
    expect(reverseString('hello world')).toBe('dlrow olleh');
  });

  it('should reverse a string with special characters', () => {
    expect(reverseString('123!@#')).toBe('#@!321');
  });
});

describe('MinStack', () => {
  describe('push', () => {
    it('should push an item and update min', () => {
      const minStack = new MinStack();
      minStack.push(5);
      expect(minStack.getMin()).toBe(5);
      expect(minStack.top()).toBe(5);
    });

    it('should push smaller item and update min', () => {
      const minStack = new MinStack();
      minStack.push(5);
      minStack.push(3);
      expect(minStack.getMin()).toBe(3);
      expect(minStack.top()).toBe(3);
    });

    it('should push larger item without changing min', () => {
      const minStack = new MinStack();
      minStack.push(3);
      minStack.push(5);
      expect(minStack.getMin()).toBe(3);
      expect(minStack.top()).toBe(5);
    });
  });

  describe('pop', () => {
    it('should pop the top item', () => {
      const minStack = new MinStack();
      minStack.push(5);
      minStack.push(3);
      minStack.pop();
      expect(minStack.top()).toBe(5);
      expect(minStack.getMin()).toBe(5);
    });

    it('should handle popping when min is removed', () => {
      const minStack = new MinStack();
      minStack.push(5);
      minStack.push(3);
      minStack.push(4);
      minStack.pop(); // remove 4
      expect(minStack.getMin()).toBe(3);
      minStack.pop(); // remove 3
      expect(minStack.getMin()).toBe(5);
    });
  });

  describe('top', () => {
    it('should return the top item', () => {
      const minStack = new MinStack();
      minStack.push(5);
      minStack.push(3);
      expect(minStack.top()).toBe(3);
    });

    it('should return undefined for empty stack', () => {
      const minStack = new MinStack();
      expect(minStack.top()).toBeUndefined();
    });
  });

  describe('getMin', () => {
    it('should return the minimum value', () => {
      const minStack = new MinStack();
      minStack.push(5);
      minStack.push(3);
      minStack.push(7);
      expect(minStack.getMin()).toBe(3);
    });

    it('should return undefined for empty stack', () => {
      const minStack = new MinStack();
      expect(minStack.getMin()).toBeUndefined();
    });
  });
});

describe('LinkedListStack', () => {
  describe('push', () => {
    it('should push an item onto the stack', () => {
      const stack = new LinkedListStack<number>();
      stack.push(1);
      expect(stack.size()).toBe(1);
      expect(stack.peek()).toBe(1);
    });

    it('should push multiple items', () => {
      const stack = new LinkedListStack<number>();
      stack.push(1);
      stack.push(2);
      stack.push(3);
      expect(stack.size()).toBe(3);
      expect(stack.peek()).toBe(3);
    });
  });

  describe('pop', () => {
    it('should pop the top item from the stack', () => {
      const stack = new LinkedListStack<number>();
      stack.push(1);
      stack.push(2);
      const popped = stack.pop();
      expect(popped).toBe(2);
      expect(stack.size()).toBe(1);
      expect(stack.peek()).toBe(1);
    });

    it('should return undefined when popping from empty stack', () => {
      const stack = new LinkedListStack<number>();
      const popped = stack.pop();
      expect(popped).toBeUndefined();
    });
  });

  describe('peek', () => {
    it('should return the top item without removing it', () => {
      const stack = new LinkedListStack<number>();
      stack.push(1);
      stack.push(2);
      const peeked = stack.peek();
      expect(peeked).toBe(2);
      expect(stack.size()).toBe(2);
    });

    it('should return undefined for empty stack', () => {
      const stack = new LinkedListStack<number>();
      const peeked = stack.peek();
      expect(peeked).toBeUndefined();
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty stack', () => {
      const stack = new LinkedListStack<number>();
      expect(stack.isEmpty()).toBe(true);
    });

    it('should return false for non-empty stack', () => {
      const stack = new LinkedListStack<number>();
      stack.push(1);
      expect(stack.isEmpty()).toBe(false);
    });
  });

  describe('size', () => {
    it('should return 0 for empty stack', () => {
      const stack = new LinkedListStack<number>();
      expect(stack.size()).toBe(0);
    });

    it('should return correct size after pushes', () => {
      const stack = new LinkedListStack<number>();
      stack.push(1);
      stack.push(2);
      expect(stack.size()).toBe(2);
    });

    it('should return correct size after pops', () => {
      const stack = new LinkedListStack<number>();
      stack.push(1);
      stack.push(2);
      stack.pop();
      expect(stack.size()).toBe(1);
    });
  });
});
