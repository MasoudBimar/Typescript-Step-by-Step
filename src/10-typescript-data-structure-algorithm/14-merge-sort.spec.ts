import { describe, expect, it } from "vitest";
import { mergeSort, merge } from "./14-merge-sort";

describe('mergeSort', () => {
	describe('edge cases', () => {
		it('should handle an empty array', () => {
			const result = mergeSort([]);
			expect(result).toEqual([]);
		});

		it('should handle a single element array', () => {
			const result = mergeSort([5]);
			expect(result).toEqual([5]);
		});
	});

	describe('already sorted arrays', () => {
		it('should keep an already sorted array unchanged', () => {
			const result = mergeSort([1, 2, 3, 4, 5]);
			expect(result).toEqual([1, 2, 3, 4, 5]);
		});

		it('should sort a descending array', () => {
			const result = mergeSort([5, 4, 3, 2, 1]);
			expect(result).toEqual([1, 2, 3, 4, 5]);
		});
	});

	describe('unsorted arrays', () => {
		it('should sort a two-element array', () => {
			const result = mergeSort([2, 1]);
			expect(result).toEqual([1, 2]);
		});

		it('should sort a random unsorted array', () => {
			const result = mergeSort([3, 1, 4, 1, 5, 9, 2, 6]);
			expect(result).toEqual([1, 1, 2, 3, 4, 5, 6, 9]);
		});

		it('should sort a fully reversed array', () => {
			const result = mergeSort([9, 8, 7, 6, 5, 4, 3, 2, 1]);
			expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
		});
	});

	describe('arrays with duplicates', () => {
		it('should handle arrays with identical values', () => {
			const result = mergeSort([5, 5, 5, 5, 5]);
			expect(result).toEqual([5, 5, 5, 5, 5]);
		});

		it('should sort arrays containing duplicate values', () => {
			const result = mergeSort([3, 1, 3, 1, 2, 2]);
			expect(result).toEqual([1, 1, 2, 2, 3, 3]);
		});

		it('should sort arrays with duplicated values at different positions', () => {
			const result = mergeSort([5, 2, 8, 2, 5, 1]);
			expect(result).toEqual([1, 2, 2, 5, 5, 8]);
		});
	});

	describe('negative numbers', () => {
		it('should sort negative values correctly', () => {
			const result = mergeSort([-3, -1, -4, -1, -5]);
			expect(result).toEqual([-5, -4, -3, -1, -1]);
		});

		it('should sort mixed negative and positive values', () => {
			const result = mergeSort([3, -1, 4, -5, 2]);
			expect(result).toEqual([-5, -1, 2, 3, 4]);
		});

		it('should sort arrays containing zero and negative numbers', () => {
			const result = mergeSort([0, -5, 3, -2, 0]);
			expect(result).toEqual([-5, -2, 0, 0, 3]);
		});
	});

	describe('large arrays', () => {
		it('should sort a large random array correctly', () => {
			const arr = Array.from({ length: 100 }, () => Math.floor(Math.random() * 100));
			const expected = [...arr].sort((a, b) => a - b);
			const result = mergeSort([...arr]);
			expect(result).toEqual(expected);
		});

		it('should sort a large already sorted array', () => {
			const arr = Array.from({ length: 50 }, (_, i) => i);
			const result = mergeSort([...arr]);
			expect(result).toEqual(arr);
		});
	});

	describe('immutability and return behavior', () => {
		it('should return a new sorted array without mutating the original', () => {
			const original = [3, 1, 2];
			const copy = [...original];
			const result = mergeSort(original);
			expect(result).toEqual([1, 2, 3]);
			expect(original).toEqual(copy);
			expect(result).not.toBe(original);
		});
	});
});

describe('merge', () => {
	it('should merge two empty arrays', () => {
		expect(merge([], [])).toEqual([]);
	});

	it('should merge an empty left and non-empty right array', () => {
		expect(merge([], [1, 2, 3])).toEqual([1, 2, 3]);
	});

	it('should merge a non-empty left and empty right array', () => {
		expect(merge([1, 2, 3], [])).toEqual([1, 2, 3]);
	});

	it('should merge two sorted arrays into one sorted array', () => {
		expect(merge([1, 3, 5], [2, 4, 6])).toEqual([1, 2, 3, 4, 5, 6]);
	});

	it('should merge sorted arrays with duplicate values', () => {
		expect(merge([1, 3, 5], [1, 2, 5])).toEqual([1, 1, 2, 3, 5, 5]);
	});
});
