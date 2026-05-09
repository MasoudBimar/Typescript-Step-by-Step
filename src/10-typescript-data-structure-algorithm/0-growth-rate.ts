// O(1) -- Constant rate

let array = [1, 2, 3, 4, 5];

console.log(array[0]); // O(1) -- Constant time complexity no matter the size of the array

// O(log n) -- Logarithmic rate

let sortedArray = [1, 2, 3, 4, 5];

export function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const value = arr[mid];
    if (value === undefined) {
      return -1; // The target value is not found in the sorted array
    }
    if (value === target) {
      return mid; // Return the index of the target value in the sorted array
    } else if (value < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}

// O(n) -- Linear rate

export function linearSearch(arr: number[], target: number): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i; // Return the index of the target value in the array
    }
  }
  return -1; // The target value is not found in the array
}

// O(n log n) -- Log-linear rate

export function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) {
    return arr;
  }
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    const leftValue = left[i]!;
    const rightValue = right[j]!;
    if (leftValue <= rightValue) {
      result.push(leftValue);
      i++;
    } else {
      result.push(rightValue);
      j++;
    }
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}

// O(n^2) -- Quadratic rate

export function bubbleSort(arr: number[]): number[] {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      let leftValue = arr[j];
      let rightValue = arr[j + 1];
      if (leftValue !== undefined && rightValue !== undefined) {
        if (leftValue > rightValue) {
          // Swap arr[j] and arr[j + 1]
          const temp = leftValue;
          arr[j] = rightValue;
          arr[j + 1] = temp;
        }
      }
    }
  }
  return arr;
}

// O(2^n) -- Exponential rate

export function fibonacci(n: number): number {
  if (n <= 1) {
    return n;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// O(n!) -- Factorial rate

export function factorial(n: number): number {
  if (n === 0) {
    return 1;
  }
  let result = 1;
  for (let i = 1; i <= n; i++) {
    result *= i;
  }
  return result;
}
