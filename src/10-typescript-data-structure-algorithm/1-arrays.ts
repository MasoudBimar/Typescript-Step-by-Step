// Array common operations and their time complexities:

// Array lookup: O(1)
let myArray: number[] = [1, 2, 3, 4, 5];

const valueAtIndex2 = myArray[2]; // O(1) -- Accessing an element by index is constant time

// Array Insert: O(n)

myArray.push(1); // O(1) -- Insert at the end of the array, rarely causes resizing
myArray.unshift(1); // O(n) -- Insert at the beginning of the array
myArray.push(1, 2, 3); // O(n) -- Insert multiple elements at the end of the array, may cause resizing
myArray.splice(1, 0, 1); // O(n) -- Insert at a specific index in the array

// Array Delete: O(n)

myArray.pop(); // O(1) -- Delete the last element of the array
myArray.shift(); // O(n) -- Delete the first element of the array: worst case O(n) because it requires shifting all remaining elements to the left
myArray.splice(1, 1); // O(n) -- Delete an element at a specific index in the array: worst case O(n) because it requires shifting all remaining elements to the left

// Exercise: Implement a function to reverse an array in place and analyze its time complexity.

export function reverseArray(arr: number[]): void {
  for (let idx = 0; idx <= Math.floor((arr.length - 1) / 2); idx++) {
    let tmp = arr[idx];
    arr[idx] = arr[arr.length - 1 - idx];
    arr[arr.length - 1 - idx] = tmp;
  }
}

// Time complexity: O(n) -- The function iterates through half of the array, which results in a linear time complexity.

export class CustomArray {
  private data: number[] = [];

  constructor(...args: number[]) {
    this.data = [...args];
  }

  insert(...numbers: number[]) {
    this.data.push(...numbers);
    return this;
  }

  removeAt(index: number) {
    this.data.splice(index, 1);
    return this;
  }

  print() {
    for (const element of this.data) {
      console.log(element);
    }
  }
}

let ca = new CustomArray(1, 2, 3);

ca.insert(4).insert(5).removeAt(1).print();
