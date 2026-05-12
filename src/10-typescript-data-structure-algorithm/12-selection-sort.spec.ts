import { describe, expect, it } from "vitest";
import { selectionSort } from "./12-selection-sort";

describe('selectionSort', () => {
  describe('edge cases', () => {
    it('should handle empty array', () => {
      const result = selectionSort([]);
      expect(result).toEqual([]);
    });

    it('should handle array with single element', () => {
      const result = selectionSort([5]);
      expect(result).toEqual([5]);
    });
  });

  describe('already sorted arrays', () => {
    it('should handle already sorted ascending array', () => {
      const result = selectionSort([1, 2, 3, 4, 5]);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle already sorted descending array', () => {
      const result = selectionSort([5, 4, 3, 2, 1]);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('unsorted arrays', () => {
    it('should sort array with two elements', () => {
      const result = selectionSort([2, 1]);
      expect(result).toEqual([1, 2]);
    });

    it('should sort array with multiple unsorted elements', () => {
      const result = selectionSort([3, 1, 4, 1, 5, 9, 2, 6]);
      expect(result).toEqual([1, 1, 2, 3, 4, 5, 6, 9]);
    });

    it('should sort completely reversed array', () => {
      const result = selectionSort([9, 8, 7, 6, 5, 4, 3, 2, 1]);
      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
  });

  describe('arrays with duplicates', () => {
    it('should sort array with all identical elements', () => {
      const result = selectionSort([5, 5, 5, 5, 5]);
      expect(result).toEqual([5, 5, 5, 5, 5]);
    });

    it('should sort array with multiple duplicate elements', () => {
      const result = selectionSort([3, 1, 3, 1, 2, 2]);
      expect(result).toEqual([1, 1, 2, 2, 3, 3]);
    });

    it('should sort array with duplicates at different positions', () => {
      const result = selectionSort([5, 2, 8, 2, 5, 1]);
      expect(result).toEqual([1, 2, 2, 5, 5, 8]);
    });
  });

  describe('arrays with negative numbers', () => {
    it('should sort array with negative numbers', () => {
      const result = selectionSort([-3, -1, -4, -1, -5]);
      expect(result).toEqual([-5, -4, -3, -1, -1]);
    });

    it('should sort array with mixed positive and negative numbers', () => {
      const result = selectionSort([3, -1, 4, -5, 2]);
      expect(result).toEqual([-5, -1, 2, 3, 4]);
    });

    it('should sort array with zero and negative numbers', () => {
      const result = selectionSort([0, -5, 3, -2, 0]);
      expect(result).toEqual([-5, -2, 0, 0, 3]);
    });
  });

  describe('large arrays', () => {
    it('should sort large unsorted array', () => {
      const arr = Array.from({ length: 100 }, () => Math.floor(Math.random() * 100));
      const result = selectionSort([...arr]);
      const expected = [...arr].sort((a, b) => a - b);
      expect(result).toEqual(expected);
    });

    it('should sort large already sorted array', () => {
      const arr = Array.from({ length: 50 }, (_, i) => i);
      const result = selectionSort([...arr]);
      expect(result).toEqual(arr);
    });
  });

  describe('mutability', () => {
    it('should modify the original array in place', () => {
      const arr = [3, 1, 2];
      const result = selectionSort(arr);
      expect(result).toBe(arr);
      expect(arr).toEqual([1, 2, 3]);
    });
  });

  describe('specific test cases', () => {
    it('should sort array with minimal swaps needed', () => {
      const result = selectionSort([1, 2, 3, 4, 5, 6, 7, 8]);
      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it('should sort array with maximal swaps needed', () => {
      const result = selectionSort([8, 7, 6, 5, 4, 3, 2, 1]);
      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it('should sort array with pivot element', () => {
      const result = selectionSort([1, 5, 3, 4, 2]);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should sort array with elements that form a valley', () => {
      const result = selectionSort([5, 4, 3, 2, 1, 2, 3, 4, 5]);
      expect(result).toEqual([1, 2, 2, 3, 3, 4, 4, 5, 5]);
    });

    it('should sort array with alternating high and low values', () => {
      const result = selectionSort([1, 9, 2, 8, 3, 7, 4, 6, 5]);
      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
  });
});
