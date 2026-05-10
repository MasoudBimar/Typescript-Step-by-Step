import { describe, expect, it } from "vitest";
import { reverseArray } from "./1-arrays";

describe("reverseArray Function", () => {
  it("should reverse the elements of an array in place", () => {
    const arr: number[] = [1, 2, 3, 4, 5];
    reverseArray(arr);
    expect(arr).toEqual([5, 4, 3, 2, 1]);
  });

  it("should handle an empty array", () => {
    const arr: number[] = [];
    reverseArray(arr);
    expect(arr).toEqual([]);
  });

  it("should handle an array with one element", () => {
    const arr: number[] = [42];
    reverseArray(arr);
    expect(arr).toEqual([42]);
  });

  it("should handle an array with an even number of elements", () => {
    const arr: number[] = [1, 2, 3, 4];
    reverseArray(arr);
    expect(arr).toEqual([4, 3, 2, 1]);
  });

  it("should handle an array with an odd number of elements", () => {
    const arr: number[] = [1, 2, 3, 4, 5];
    reverseArray(arr);
    expect(arr).toEqual([5, 4, 3, 2, 1]);
  });

    it("should handle an array with an big even number of elements", () => {
    const arr: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
    reverseArray(arr);
    expect(arr).toEqual([8, 7, 6, 5, 4, 3, 2, 1]);
  });
});
