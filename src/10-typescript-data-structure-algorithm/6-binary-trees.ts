export class TreeNode<T> {
  value: T;
  left: TreeNode<T> | null;
  right: TreeNode<T> | null;

  constructor(value: T) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

export class BinaryTree<T> {
  root: TreeNode<T> | null;

  constructor() {
    this.root = null;
  }

  insert(value: T) {
    const newNode = new TreeNode(value);
    if (!this.root) {
      this.root = newNode;
      return;
    }
    let current = this.root;
    while (true) {
      if (value < current.value) {
        if (!current.left) {
          current.left = newNode;
          return;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          return;
        }
        current = current.right;
      }
    }
  }

  find(value: T): TreeNode<T> | null {
    let current = this.root;
    while (current) {
      if (value === current.value) {
        return current;
      }
      if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
    return null;
  }

  delete(value: T) {
    this.root = this.deleteNode(this.root, value);
  }

  private deleteNode(node: TreeNode<T> | null, value: T): TreeNode<T> | null {
    if (!node) return null;
    if (value < node.value) {
      node.left = this.deleteNode(node.left, value);
    } else if (value > node.value) {
      node.right = this.deleteNode(node.right, value);
    } else {
      if (!node.left) return node.right;
      if (!node.right) return node.left;
      const minLargerNode = this.findMin(node.right);
      node.value = minLargerNode.value;
      node.right = this.deleteNode(node.right, minLargerNode.value);
    }
    return node;
  }

  private findMin(node: TreeNode<T>): TreeNode<T> {
    while (node.left) {
      node = node.left;
    }
    return node;
  } 


}

  export function traversePreOrder<T>(
    node: TreeNode<T> | null,
    visit: (node: TreeNode<T>) => void,
  ) {
    if (node) {
      visit(node);
      traversePreOrder(node.left, visit);
      traversePreOrder(node.right, visit);
    }
  }

  export function traversePostOrder<T>(
    node: TreeNode<T> | null,
    visit: (node: TreeNode<T>) => void,
  ) {
    if (node) {
      traversePostOrder(node.left, visit);
      traversePostOrder(node.right, visit);
      visit(node);
    }
  }

  export function traverseInOrder<T>(
    node: TreeNode<T> | null,
    visit: (node: TreeNode<T>) => void,
  ) {
    if (node) {
      traverseInOrder(node.left, visit);
      visit(node);
      traverseInOrder(node.right, visit);
    }
  }

  export function traverseLevelOrder<T>(
    root: TreeNode<T> | null,
    visit: (node: TreeNode<T>) => void,
  ) {
    if (!root) return;
    const queue: TreeNode<T>[] = [root];
    while (queue.length > 0) {
      const node = queue.shift()!;
      visit(node);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }

  export function binaryTreeHeight<T>(node: TreeNode<T> | null): number {
    if (!node) return -1;
    const leftHeight = binaryTreeHeight(node.left);
    const rightHeight = binaryTreeHeight(node.right);
    return Math.max(leftHeight, rightHeight) + 1;
  }
