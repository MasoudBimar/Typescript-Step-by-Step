# Data Structures and Algorithms with TypeScript

- [Data Structures and Algorithms with TypeScript](#data-structures-and-algorithms-with-typescript)
  - [Growth Rate](#growth-rate)
    - [Big O Notation](#big-o-notation)
    - [Common Growth Rates](#common-growth-rates)
    - [Time Complexity](#time-complexity)
    - [Space Complexity](#space-complexity)
  - [Data Structures](#data-structures)
    - [Arrays](#arrays)
    - [Linked Lists](#linked-lists)
    - [Stacks](#stacks)
    - [Queues](#queues)
    - [Hash Tables](#hash-tables)
    - [Binary Trees](#binary-trees)
    - [AVL Trees](#avl-trees)
    - [Heaps](#heaps)
    - [Tries](#tries)
    - [Graphs](#graphs)
  - [Graph Algorithms](#graph-algorithms)
    - [Graph Traversal](#graph-traversal)
    - [Spanning Tree](#spanning-tree)
    - [Minimum Spanning Tree](#minimum-spanning-tree)
    - [Dijkstra Algorithm](#dijkstra-algorithm)
    - [Other Important Graph Algorithms](#other-important-graph-algorithms)
  - [Sorting Algorithms](#sorting-algorithms)
    - [Bubble Sort](#bubble-sort)
    - [Selection Sort](#selection-sort)
    - [Insertion Sort](#insertion-sort)
    - [Merge Sort](#merge-sort)
    - [Other Important Sorting Algorithms](#other-important-sorting-algorithms)

## Growth Rate

Growth rate describes how an algorithm behaves when the input size grows.
If an array has `n` items, we ask:

- How many operations are needed when `n` becomes larger?
- How much extra memory is needed when `n` becomes larger?

This is more useful than measuring seconds, because seconds depend on hardware, runtime, and implementation details.

### Big O Notation

Big O notation describes the upper bound of an algorithm's growth.
It focuses on the dominant part of the work and ignores constants.

```ts
function firstItem<T>(items: T[]): T | undefined {
  return items[0]; // O(1)
}

function printAll<T>(items: T[]): void {
  for (const item of items) {
    console.log(item); // O(n)
  }
}
```

> [!NOTE]
> `O(2n)` becomes `O(n)` and `O(n + 10)` becomes `O(n)`, because Big O cares about growth, not exact operation count.

### Common Growth Rates

| Big O        | Name        | Example                    | Meaning                                      |
| ------------ | ----------- | -------------------------- | -------------------------------------------- |
| `O(1)`       | Constant    | Access array item by index | Same work no matter input size               |
| `O(log n)`   | Logarithmic | Binary search              | Input is usually cut in half each step       |
| `O(n)`       | Linear      | Linear search              | Work grows directly with input size          |
| `O(n log n)` | Log-linear  | Merge sort                 | Common for efficient comparison sorting      |
| `O(n^2)`     | Quadratic   | Bubble sort                | Nested loops over the same input             |
| `O(2^n)`     | Exponential | Naive recursive Fibonacci  | Work doubles with each extra input           |
| `O(n!)`      | Factorial   | Brute force permutations   | Very slow growth, only useful for tiny input |

### Time Complexity

Time complexity measures how many operations an algorithm performs.

```ts
function linearSearch<T>(items: T[], target: T): number {
  for (let i = 0; i < items.length; i++) {
    if (items[i] === target) {
      return i;
    }
  }

  return -1;
}
```

`linearSearch` is `O(n)` because in the worst case it checks every item.

```ts
function binarySearch(items: number[], target: number): number {
  let left = 0;
  let right = items.length - 1;

  while (left <= right) {
    const middle = Math.floor((left + right) / 2);
    const value = items[middle];

    if (value === target) return middle;
    if (value === undefined) return -1;
    if (value < target) left = middle + 1;
    else right = middle - 1;
  }

  return -1;
}
```

`binarySearch` is `O(log n)` because every step removes half of the remaining search space.
It only works correctly when the input is sorted.

### Space Complexity

Space complexity measures how much extra memory an algorithm uses.

```ts
function sum(items: number[]): number {
  let total = 0;

  for (const item of items) {
    total += item;
  }

  return total;
}
```

This function uses `O(1)` extra space because it only creates one variable.

```ts
function copyItems<T>(items: T[]): T[] {
  return [...items];
}
```

This function uses `O(n)` extra space because it creates a new array with all items.

> [!TIP]
> Recursive algorithms also use space on the call stack. For example, merge sort usually uses `O(n)` extra array space and `O(log n)` call stack space.

## Data Structures

A data structure is a way to organize data so it can be used efficiently.
Different structures make different operations faster or easier.

### Arrays

An array stores items in order and gives each item an index.

```ts
const numbers: number[] = [10, 20, 30];

numbers.push(40);
const first = numbers[0];
```

Common complexity:

| Operation                        | Complexity     |
| -------------------------------- | -------------- |
| Access by index                  | `O(1)`         |
| Search unsorted array            | `O(n)`         |
| Insert/remove at end             | Usually `O(1)` |
| Insert/remove at start or middle | `O(n)`         |

Use cases:

- Lists of items
- Ordered data
- Fast access by index
- Implementing stacks, queues, heaps, and graph adjacency lists

### Linked Lists

A linked list stores nodes where each node points to the next node.
In a doubly linked list, each node also points to the previous node.

```ts
type ListNode<T> = {
  value: T;
  next: ListNode<T> | null;
};
```

Common complexity:

| Operation                      | Complexity |
| ------------------------------ | ---------- |
| Access by index                | `O(n)`     |
| Search                         | `O(n)`     |
| Insert/remove at head          | `O(1)`     |
| Insert/remove after known node | `O(1)`     |

Use cases:

- Frequent insertions/removals at the start
- Queues
- Undo/redo history
- Situations where resizing arrays would be expensive

> [!NOTE]
> JavaScript arrays are already dynamic, so linked lists are less common in daily TypeScript code, but they are important for understanding memory and pointer-based structures.

### Stacks

A stack is a Last In, First Out structure (FILO).
The last item added is the first item removed.

Main operations:

- `push`: add item to the top
- `pop`: remove item from the top
- `peek`: read the top item

```ts
const stack: string[] = [];

stack.push("first");
stack.push("second");
stack.pop(); // "second"
```

Common complexity:

| Operation | Complexity |
| --------- | ---------- |
| Push      | `O(1)`     |
| Pop       | `O(1)`     |
| Peek      | `O(1)`     |

Searching is not a normal stack operation.
If the stack is backed by an array, you can scan it in `O(n)`, but that breaks the main stack idea: only the top item should be directly accessible.

Use cases:

- Undo/redo
- Browser back button
- Function call stack
- Parsing expressions
- Depth-first search

### Queues

A queue is a First In, First Out structure (FIFO).
The first item added is the first item removed.

Main operations:

- `enqueue`: add item to the back
- `dequeue`: remove item from the front
- `peek`: read the front item

```ts
const queue: string[] = [];

queue.push("first");
queue.push("second");
queue.shift(); // "first"
```

> [!TIP]
> `Array.shift()` is `O(n)` because all remaining items must move. For a real queue, keep a `head` index or use a linked list.

Common complexity with a proper queue implementation:

| Operation | Complexity |
| --------- | ---------- |
| Enqueue   | `O(1)`     |
| Dequeue   | `O(1)`     |
| Peek      | `O(1)`     |
| Search    | `O(n)`     |

Use cases:

- Task scheduling
- Message processing
- Breadth-first search
- Print queues
- Producer/consumer workflows

### Hash Tables

A hash table stores key-value pairs.
In JavaScript and TypeScript, `Map` is usually the best built-in hash table.

```ts
const usersById = new Map<number, string>();

usersById.set(1, "Sara");
usersById.set(2, "Ali");

const user = usersById.get(1);
```

Common complexity:

| Operation         | Average Complexity |
| ----------------- | ------------------ |
| Insert            | `O(1)`             |
| Lookup            | `O(1)`             |
| Delete            | `O(1)`             |
| Iterate all items | `O(n)`             |

Use cases:

- Fast lookup by key
- Counting frequencies
- Removing duplicates
- Caching
- Indexing data by id

> [!NOTE]
> Hash tables can degrade when many keys collide, but good hash table implementations keep average operations close to `O(1)`.

Hash tables collision resolution strategies:

- Separate chaining: store colliding items in a list at the same index
- Open addressing: find another index for the colliding item using probing
- Cuckoo hashing: use multiple hash functions and move items around to resolve collisions

### Binary Trees

A binary tree is a tree where each node has at most two children.
A Binary Search Tree, or BST, is a binary tree where smaller values go left and larger values go right.

```ts
type TreeNode<T> = {
  value: T;
  left: TreeNode<T> | null;
  right: TreeNode<T> | null;
};
```

Common BST complexity:

| Operation | Balanced Tree | Unbalanced Tree |
| --------- | ------------- | --------------- |
| Search    | `O(log n)`    | `O(n)`          |
| Insert    | `O(log n)`    | `O(n)`          |
| Delete    | `O(log n)`    | `O(n)`          |
| Traversal | `O(n)`        | `O(n)`          |

Common traversals:

- In-order: left, root, right. In a BST this returns sorted values(DFS).
- Pre-order: root, left, right. Useful for copying trees (DFS).
- Post-order: left, right, root. Useful for deleting/freeing nodes (DFS).
- Level-order: visit by levels. Uses a queue(BFS).

Use cases:

- Hierarchical data
- Sorted data
- Searching ranges
- Expression trees
- File systems and document models

### AVL Trees

An AVL tree is a self-balancing Binary Search Tree (AVL is an abbreviation of Adelson-Velsky and Landis).
After insertions or deletions, it rotates nodes to keep the tree height balanced.

The balance factor is:

```txt
height(left subtree) - height(right subtree)
```

For an AVL tree, the balance factor of every node must be `-1`, `0`, or `1`.

Common complexity:

| Operation | Complexity |
| --------- | ---------- |
| Search    | `O(log n)` |
| Insert    | `O(log n)` |
| Delete    | `O(log n)` |
| Traversal | `O(n)`     |

Use cases:

- Data that must stay sorted
- Fast lookup with predictable worst-case performance
- Databases and indexes
- In-memory ordered collections

> [!TIP]
> AVL trees are stricter than some other balanced trees, so lookup is very fast, but insert/delete may do more rotations.

Rotation types:

- Left rotation: when the right subtree is too tall
- Right rotation: when the left subtree is too tall
- Left-right rotation: when the left subtree's right child is too tall
- Right-left rotation: when the right subtree's left child is too tall

### Heaps

A heap is a tree-like structure usually stored in an array.
The most common heap is a binary heap.

Heap types:

- Min heap: parent is smaller than or equal to children
- Max heap: parent is larger than or equal to children

Array index relationships:

```txt
left child  = 2 * index + 1
right child = 2 * index + 2
parent      = Math.floor((index - 1) / 2)
```

Common complexity:

| Operation             | Complexity |
| --------------------- | ---------- |
| Peek min/max          | `O(1)`     |
| Insert                | `O(log n)` |
| Remove min/max        | `O(log n)` |
| Build heap from array | `O(n)`     |

Use cases:

- Priority queues
- Scheduling by priority
- Dijkstra algorithm
- Heap sort
- Finding top `k` items

> [!NOTE]
> For finding the top `k` max/min items in an unsoreted/sorted array, a heap can be more efficient than sorting the entire array.

### Tries

A trie is a tree for storing strings by character.
Each path from the root can represent a word or prefix.

```ts
type TrieNode = {
  children: Map<string, TrieNode>;
  isWord: boolean;
};
```

--b --> a --> g (isWord: true)
\--> a --> t (isWord: true)
\--> a --> n (isWord: true)

Common complexity where `m` is the length of the word:

| Operation     | Complexity |
| ------------- | ---------- |
| Insert word   | `O(m)`     |
| Search word   | `O(m)`     |
| Prefix search | `O(m)`     |

Use cases:

- Autocomplete
- Spell checking
- Prefix matching
- Search suggestions
- Dictionary-like word storage

> [!NOTE]
> Tries can use more memory than hash tables because every character may need a node.

### Graphs

A graph is a set of vertices connected by edges.

Graph types:

- Directed graph: edges have direction
- Undirected graph: edges do not have direction
- Weighted graph: edges have costs
- Unweighted graph: edges do not have costs
- Cyclic graph: contains cycles
- Acyclic graph: does not contain cycles

Common representations:

```ts
type AdjacencyList = Map<string, string[]>;

const graph: AdjacencyList = new Map([
  ["A", ["B", "C"]],
  ["B", ["A", "D"]],
  ["C", ["A"]],
  ["D", ["B"]],
]);
```

Weighted graph:

```ts
type WeightedGraph = Map<string, Array<{ node: string; weight: number }>>;
```

Representation complexity:

| Representation   | Space      | Check Edge  | Iterate Neighbors |
| ---------------- | ---------- | ----------- | ----------------- |
| Adjacency list   | `O(V + E)` | `O(degree)` | Fast              |
| Adjacency matrix | `O(V^2)`   | `O(1)`      | `O(V)`            |

Use cases:

- Maps and route planning
- Social networks
- Dependency graphs
- Recommendation systems
- Network routing
- Build systems and package managers

## Graph Algorithms

Graph algorithms solve problems about connection, reachability, shortest paths, and networks.

### Graph Traversal

**Depth-first search (DFS)** uses a stack or recursion.
It explores as far as possible before backtracking.

Use cases:

- Detect cycles
- Explore connected components
- Topological sorting
- Solving mazes

Breadth-first search (BFS) uses a queue.
It visits nearby vertices before farther vertices.

Use cases:

- Shortest path in an unweighted graph
- Level-order traversal
- Finding nearest matching item
- Web crawlers

Complexity for both BFS and DFS with an adjacency list:

```txt
Time:  O(V + E)
Space: O(V)
```

### Spanning Tree

A spanning tree connects all vertices in an undirected connected graph without cycles.
If a graph has `V` vertices, a spanning tree has exactly `V - 1` edges.

Use cases:

- Network design
- Removing cycles while keeping connectivity
- Understanding the structure of a connected graph

### Minimum Spanning Tree

A Minimum Spanning Tree, or MST, is a spanning tree with the smallest possible total edge weight.

Important algorithms:

- Kruskal algorithm: sort edges by weight, add the smallest edge that does not create a cycle
- Prim algorithm: start from one vertex and keep adding the cheapest edge that expands the tree

Common complexity:

| Algorithm | Typical Complexity | Common Data Structure |
| --------- | ------------------ | --------------------- |
| Kruskal   | `O(E log E)`       | Union-Find            |
| Prim      | `O(E log V)`       | Priority Queue        |

Use cases:

- Laying cables with minimum cost
- Connecting network nodes
- Clustering
- Approximation algorithms

### Dijkstra Algorithm

Dijkstra algorithm finds the shortest path from one starting vertex to all other vertices in a weighted graph with non-negative edge weights.

Main idea:

1. Start with distance `0` for the source and `Infinity` for every other vertex.
2. Use a priority queue to always process the closest unvisited vertex.
3. Relax its outgoing edges by checking whether a shorter path was found.

Complexity with adjacency list and priority queue:

```txt
Time:  O((V + E) log V)
Space: O(V)
```

Use cases:

- GPS route planning
- Network routing
- Cheapest path in a graph
- Game pathfinding when all weights are non-negative

> [!NOTE]
> Dijkstra does not work correctly with negative edge weights. Use Bellman-Ford for graphs with negative weights.

### Other Important Graph Algorithms

| Algorithm        | Use Case                                     | Complexity                  |
| ---------------- | -------------------------------------------- | --------------------------- |
| Bellman-Ford     | Shortest path with negative weights          | `O(VE)`                     |
| Floyd-Warshall   | Shortest paths between all pairs             | `O(V^3)`                    |
| Topological sort | Order tasks with dependencies                | `O(V + E)`                  |
| Union-Find       | Detect cycles and group connected components | Almost `O(1)` per operation |
| A\* search       | Shortest path with heuristic guidance        | Depends on heuristic        |

## Sorting Algorithms

Sorting puts items into a defined order.
For numbers, this usually means ascending or descending order.

Important sorting terms:

- In-place: uses only a small amount of extra memory
- Stable: equal items keep their original relative order
- Comparison sort: sorts by comparing pairs of values

### Bubble Sort

Bubble sort repeatedly compares neighboring items and swaps them if they are in the wrong order.
Large values slowly move to the end.

```ts
function bubbleSort(items: number[]): number[] {
  for (let i = 0; i < items.length - 1; i++) {
    for (let j = 0; j < items.length - i - 1; j++) {
      if (items[j]! > items[j + 1]!) {
        [items[j], items[j + 1]] = [items[j + 1]!, items[j]!];
      }
    }
  }

  return items;
}
```

Complexity:

| Case    | Complexity                          |
| ------- | ----------------------------------- |
| Best    | `O(n)` with early-exit optimization |
| Average | `O(n^2)`                            |
| Worst   | `O(n^2)`                            |
| Space   | `O(1)`                              |

Use cases:

- Learning sorting basics
- Very small arrays
- Rarely used in production

### Selection Sort

Selection sort repeatedly finds the smallest item from the unsorted part and moves it to the front.

```ts
function selectionSort(items: number[]): number[] {
  for (let i = 0; i < items.length - 1; i++) {
    let minIndex = i;

    for (let j = i + 1; j < items.length; j++) {
      if (items[j]! < items[minIndex]!) {
        minIndex = j;
      }
    }

    [items[i], items[minIndex]] = [items[minIndex]!, items[i]!];
  }

  return items;
}
```

Complexity:

| Case    | Complexity |
| ------- | ---------- |
| Best    | `O(n^2)`   |
| Average | `O(n^2)`   |
| Worst   | `O(n^2)`   |
| Space   | `O(1)`     |

Use cases:

- Small arrays
- When minimizing swaps matters
- Teaching selection-based sorting

### Insertion Sort

Insertion sort builds the sorted result one item at a time.
It takes the next item and inserts it into the correct position in the sorted part.

```ts
function insertionSort(items: number[]): number[] {
  for (let i = 1; i < items.length; i++) {
    const current = items[i]!;
    let j = i - 1;

    while (j >= 0 && items[j]! > current) {
      items[j + 1] = items[j]!;
      j--;
    }

    items[j + 1] = current;
  }

  return items;
}
```

Complexity:

| Case    | Complexity |
| ------- | ---------- |
| Best    | `O(n)`     |
| Average | `O(n^2)`   |
| Worst   | `O(n^2)`   |
| Space   | `O(1)`     |

Use cases:

- Small arrays
- Nearly sorted data
- Sorting small partitions inside more advanced algorithms

### Merge Sort

Merge sort splits the array into halves, sorts each half, and merges the sorted halves.

```ts
function mergeSort(items: number[]): number[] {
  if (items.length <= 1) {
    return items;
  }

  const middle = Math.floor(items.length / 2);
  const left = mergeSort(items.slice(0, middle));
  const right = mergeSort(items.slice(middle));

  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (left[i]! <= right[j]!) {
      result.push(left[i]!);
      i++;
    } else {
      result.push(right[j]!);
      j++;
    }
  }

  return result.concat(left.slice(i), right.slice(j));
}
```

Complexity:

| Case    | Complexity   |
| ------- | ------------ |
| Best    | `O(n log n)` |
| Average | `O(n log n)` |
| Worst   | `O(n log n)` |
| Space   | `O(n)`       |

Use cases:

- Large datasets
- Stable sorting
- Linked list sorting
- When predictable `O(n log n)` performance matters

### Other Important Sorting Algorithms

| Algorithm     | Average Time  | Worst Time    | Space      | Notes                                           |
| ------------- | ------------- | ------------- | ---------- | ----------------------------------------------- |
| Quick sort    | `O(n log n)`  | `O(n^2)`      | `O(log n)` | Very fast in practice with good pivot selection |
| Heap sort     | `O(n log n)`  | `O(n log n)`  | `O(1)`     | Uses a heap, not stable                         |
| Counting sort | `O(n + k)`    | `O(n + k)`    | `O(k)`     | Good when values are integers in a small range  |
| Radix sort    | `O(d(n + k))` | `O(d(n + k))` | `O(n + k)` | Sorts numbers/strings by digits or characters   |

> [!TIP]
> In real TypeScript projects, prefer the built-in `Array.prototype.sort()` unless you are learning algorithms or need a custom data-structure implementation.
