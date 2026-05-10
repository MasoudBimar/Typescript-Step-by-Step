import { describe, expect, it } from "vitest";
import { LinkedList, Node } from "./2-linked-list";

describe('LinkedList', () => {
  describe('append', () => {
    it('should append to an empty list', () => {
      const list = new LinkedList<number>();
      list.append(1);
      expect(list.length).toBe(1);
      expect(list.head?.value).toBe(1);
      expect(list.tail?.value).toBe(1);
    });

    it('should append to a list with one element', () => {
      const list = new LinkedList<number>();
      list.append(1);
      list.append(2);
      expect(list.length).toBe(2);
      expect(list.head?.value).toBe(1);
      expect(list.tail?.value).toBe(2);
      expect(list.head?.next?.value).toBe(2);
    });

    it('should append multiple elements', () => {
      const list = new LinkedList<number>();
      list.append(1);
      list.append(2);
      list.append(3);
      expect(list.length).toBe(3);
      expect(list.head?.value).toBe(1);
      expect(list.tail?.value).toBe(3);
      expect(list.toArray()).toEqual([1, 2, 3]);
    });
  });

  describe('prepend', () => {
    it('should prepend to an empty list', () => {
      const list = new LinkedList<number>();
      list.prepend(1);
      expect(list.length).toBe(1);
      expect(list.head?.value).toBe(1);
      expect(list.tail?.value).toBe(1);
    });

    it('should prepend to a list with one element', () => {
      const list = new LinkedList<number>();
      list.append(1);
      list.prepend(2);
      expect(list.length).toBe(2);
      expect(list.head?.value).toBe(2);
      expect(list.tail?.value).toBe(1);
      expect(list.head?.next?.value).toBe(1);
    });

    it('should prepend multiple elements', () => {
      const list = new LinkedList<number>();
      list.append(1);
      list.prepend(2);
      list.prepend(3);
      expect(list.length).toBe(3);
      expect(list.head?.value).toBe(3);
      expect(list.tail?.value).toBe(1);
      expect(list.toArray()).toEqual([3, 2, 1]);
    });
  });

  describe('delete', () => {
    it('should delete the head element', () => {
      const list = new LinkedList<number>();
      list.append(1);
      list.append(2);
      list.delete(1);
      expect(list.length).toBe(1);
      expect(list.head?.value).toBe(2);
      expect(list.tail?.value).toBe(2);
    });

    it('should delete a middle element', () => {
      const list = new LinkedList<number>();
      list.append(1);
      list.append(2);
      list.append(3);
      list.delete(2);
      expect(list.length).toBe(2);
      expect(list.head?.value).toBe(1);
      expect(list.tail?.value).toBe(3);
      expect(list.head?.next?.value).toBe(3);
    });

    it('should delete the tail element', () => {
      const list = new LinkedList<number>();
      list.append(1);
      list.append(2);
      list.delete(2);
      expect(list.length).toBe(1);
      expect(list.head?.value).toBe(1);
      expect(list.tail?.value).toBe(1);
    });

    it('should do nothing if value not found', () => {
      const list = new LinkedList<number>();
      list.append(1);
      list.append(2);
      list.delete(3);
      expect(list.length).toBe(2);
      expect(list.toArray()).toEqual([1, 2]);
    });
  });

  describe('find', () => {
    it('should find the head element', () => {
      const list = new LinkedList<number>();
      list.append(1);
      list.append(2);
      const node = list.find(1);
      expect(node?.value).toBe(1);
    });

    it('should find a middle element', () => {
      const list = new LinkedList<number>();
      list.append(1);
      list.append(2);
      list.append(3);
      const node = list.find(2);
      expect(node?.value).toBe(2);
    });

    it('should find the tail element', () => {
      const list = new LinkedList<number>();
      list.append(1);
      list.append(2);
      const node = list.find(2);
      expect(node?.value).toBe(2);
    });

    it('should return null if value not found', () => {
      const list = new LinkedList<number>();
      list.append(1);
      list.append(2);
      const node = list.find(3);
      expect(node).toBe(null);
    });
  });

  describe('toArray', () => {
    it('should return empty array for empty list', () => {
      const list = new LinkedList<number>();
      expect(list.toArray()).toEqual([]);
    });

    it('should return array with one element', () => {
      const list = new LinkedList<number>();
      list.append(1);
      expect(list.toArray()).toEqual([1]);
    });

    it('should return array with multiple elements', () => {
      const list = new LinkedList<number>();
      list.append(1);
      list.append(2);
      list.append(3);
      expect(list.toArray()).toEqual([1, 2, 3]);
    });
  });

  describe('reverse', () => {
    it('should reverse an empty list', () => {
      const list = new LinkedList<number>();
      list.reverse();
      expect(list.length).toBe(0);
      expect(list.head).toBe(null);
      expect(list.tail).toBe(null);
    });

    it('should reverse a list with one element', () => {
      const list = new LinkedList<number>();
      list.append(1);
      list.reverse();
      expect(list.length).toBe(1);
      expect(list.head?.value).toBe(1);
      expect(list.tail?.value).toBe(1);
    });

    it('should reverse a list with two elements', () => {
      const list = new LinkedList<number>();
      list.append(1);
      list.append(2);
      list.reverse();
      expect(list.length).toBe(2);
      expect(list.head?.value).toBe(2);
      expect(list.tail?.value).toBe(1);
      expect(list.toArray()).toEqual([2, 1]);
    });

    it('should reverse a list with multiple elements', () => {
      const list = new LinkedList<number>();
      list.append(1);
      list.append(2);
      list.append(3);
      list.append(4);
      list.reverse();
      expect(list.length).toBe(4);
      expect(list.head?.value).toBe(4);
      expect(list.tail?.value).toBe(1);
      expect(list.toArray()).toEqual([4, 3, 2, 1]);
    });
  });
});
