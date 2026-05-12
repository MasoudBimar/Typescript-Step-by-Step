import { describe, expect, it } from "vitest";
import { insertionSort } from "./13-insertion-sort";

describe('insertionSort', () => {
  describe('edge cases', () => {
    it('should handle empty array', () => {
      const result = insertionSort([]);
      expect(result).toEqual([]);
    });

    it('should handle array with a single element', () => {
      const result = insertionSort([5]);
      expect(result).toEqual([5]);
    });
  });

  describe('already sorted arrays', () => {
    it('should leave an already sorted ascending array unchanged', () => {
      const result = insertionSort([1, 2, 3, 4, 5]);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should sort a descending array', () => {
      const result = insertionSort([5, 4, 3, 2, 1]);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('unsorted arrays', () => {
    it('should sort a two-element array', () => {
      const result = insertionSort([2, 1]);
      expect(result).toEqual([1, 2]);
    });

    it('should sort a random unsorted array', () => {
      const result = insertionSort([3, 1, 4, 1, 5, 9, 2, 6]);
      expect(result).toEqual([1, 1, 2, 3, 4, 5, 6, 9]);
    });

    it('should sort a fully reversed array', () => {
      const result = insertionSort([9, 8, 7, 6, 5, 4, 3, 2, 1]);
      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
  });

  describe('arrays with duplicates', () => {
    it('should preserve duplicate values', () => {
      const result = insertionSort([3, 1, 3, 1, 2, 2]);
      expect(result).toEqual([1, 1, 2, 2, 3, 3]);
    });

    it('should handle arrays with all identical elements', () => {
      const result = insertionSort([5, 5, 5, 5, 5]);
      expect(result).toEqual([5, 5, 5, 5, 5]);
    });
  });

  describe('arrays with negative numbers', () => {
    it('should sort negative numbers correctly', () => {
      const result = insertionSort([-3, -1, -4, -1, -5]);
      expect(result).toEqual([-5, -4, -3, -1, -1]);
    });

    it('should sort mixed negative and positive numbers', () => {
      const result = insertionSort([3, -1, 4, -5, 2]);
      expect(result).toEqual([-5, -1, 2, 3, 4]);
    });

    it('should sort zeros along with negative numbers', () => {
      const result = insertionSort([0, -5, 3, -2, 0]);
      expect(result).toEqual([-5, -2, 0, 0, 3]);
    });
  });

  describe('large arrays', () => {
    it('should sort a large random array', () => {
      const arr = Array.from({ length: 100 }, () => Math.floor(Math.random() * 100));
      const expected = [...arr].sort((a, b) => a - b);
      const result = insertionSort([...arr]);
      expect(result).toEqual(expected);
    });

    it('should handle a large already sorted array', () => {
      const arr = Array.from({ length: 50 }, (_, i) => i);
      const result = insertionSort([...arr]);
      expect(result).toEqual(arr);
    });
  });

  describe('mutability', () => {
    it('should sort the original array in place', () => {
      const arr = [3, 1, 2];
      const result = insertionSort(arr);
      expect(result).toBe(arr);
      expect(arr).toEqual([1, 2, 3]);
    });
  });

  describe('specific insertion sort scenarios', () => {
    it('should sort an array with minimal required swaps', () => {
      const result = insertionSort([1, 2, 3, 4, 5, 6, 7, 8]);
      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it('should sort an array with maximal shift operations', () => {
      const result = insertionSort([8, 7, 6, 5, 4, 3, 2, 1]);
      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it('should sort an array with alternating high and low values', () => {
      const result = insertionSort([1, 9, 2, 8, 3, 7, 4, 6, 5]);
      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
  });
});
