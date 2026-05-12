export function mergeSort(arr: number[]): number[] {
    // 1. divide the array into halves until we have arrays of length 1 (could be recursive)
    // 2. sort each half
    // 3. merge the sorted halves back together

    let middle = Math.floor(arr.length / 2);
    if (arr.length <= 1) {
        return arr;
    }

    let left = mergeSort(arr.slice(0, middle));
    let right = mergeSort(arr.slice(middle));

    return merge(left, right);
}

export function merge(left: number[], right: number[]): number[] {
    let result: number[] = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
        if (left[i] < right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }

    // If there are remaining elements in left or right, add them to the result
    return result.concat(left.slice(i)).concat(right.slice(j));
}