import { describe, expect, it } from "vitest";
import { binarySearch } from "./0-growth-rate";

describe('Binary Search', () => {
    it('should find the existing element in a sorted array', () => {
        const sortedArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const result1 = binarySearch(sortedArray, 1);
        expect(result1).toBe(0); // The index of the target value in the sorted array

        const result2 = binarySearch(sortedArray, 2);
        expect(result2).toBe(1); // The index of the target value in the sorted array

        const result3 = binarySearch(sortedArray, 3);
        expect(result3).toBe(2); // The index of the target value in the sorted array

        const result4 = binarySearch(sortedArray, 4);
        expect(result4).toBe(3); // The index of the target value in the sorted array

        const result5 = binarySearch(sortedArray, 5);
        expect(result5).toBe(4); // The index of the target value in the sorted array

        const result6 = binarySearch(sortedArray, 6);
        expect(result6).toBe(5); // The index of the target value in the sorted array

        const result7 = binarySearch(sortedArray, 7);
        expect(result7).toBe(6); // The index of the target value in the sorted array

        const result8 = binarySearch(sortedArray, 8);
        expect(result8).toBe(7); // The index of the target value in the sorted array

        const result9 = binarySearch(sortedArray, 9);
        expect(result9).toBe(8); // The index of the target value in the sorted array

        const result10 = binarySearch(sortedArray, 10);
        expect(result10).toBe(9); // The index of the target value in the sorted array
    });

    it('should return -1 for a non-existing element in a sorted array', () => {
        const sortedArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const result = binarySearch(sortedArray, 11);
        expect(result).toBe(-1); // The target value is not found in the sorted array
    });

    it('should return -1 for an empty array', () => {
        const emptyArray: number[] = [];
        const result = binarySearch(emptyArray, 1);
        expect(result).toBe(-1); // The target value is not found in the empty array
    });

    it('should return -1 for an array with one element that does not match the target', () => {
        const singleElementArray = [1];
        const result = binarySearch(singleElementArray, 2);
        expect(result).toBe(-1); // The target value is not found in the single element array
    });

    it('should return 0 for an array with one element that matches the target', () => {
        const singleElementArray = [1];
        const result = binarySearch(singleElementArray, 1);
        expect(result).toBe(0); // The index of the target value in the single element array
    });

    it ('should return correct index for arrays with odd number of elements', () => {
        const sortedArray = [1, 2, 3, 4, 5, 6, 7];
        const result1 = binarySearch(sortedArray, 1);
        expect(result1).toBe(0); // The index of the target value in the sorted array

        const result2 = binarySearch(sortedArray, 2);
        expect(result2).toBe(1); // The index of the target value in the sorted array

        const result3 = binarySearch(sortedArray, 3);
        expect(result3).toBe(2); // The index of the target value in the sorted array

        const result4 = binarySearch(sortedArray, 4);
        expect(result4).toBe(3); // The index of the target value in the sorted array

        const result5 = binarySearch(sortedArray, 5);
        expect(result5).toBe(4); // The index of the target value in the sorted array

        const result6 = binarySearch(sortedArray, 6);
        expect(result6).toBe(5); // The index of the target value in the sorted array

        const result7 = binarySearch(sortedArray, 7);
        expect(result7).toBe(6); // The index of the target value in the sorted array
    });
});