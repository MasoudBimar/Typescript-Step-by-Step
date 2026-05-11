export class TreeNode<T>{
    value: T;
    left: TreeNode<T> | null
    right: TreeNode<T> | null

    constructor(value: T) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

export class BinaryTree<T>{
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