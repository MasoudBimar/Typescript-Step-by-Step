import { describe, expect, it } from "vitest";
import { BinaryTree, binaryTreeHeight, traverseInOrder, traverseLevelOrder, traversePostOrder, traversePreOrder } from "./6-binary-trees";

let bt = new BinaryTree<number>();
bt.insert(20);
bt.insert(10);
bt.insert(30);
bt.insert(6);
bt.insert(14);
bt.insert(3);
bt.insert(8);
bt.insert(24);
bt.insert(26);

describe('BinaryTree', () => {
    it('should find existing values', () => {
        expect(bt.find(10)?.value).toBe(10);
        expect(bt.find(30)?.value).toBe(30);
        expect(bt.find(6)?.value).toBe(6);
    });

    it('should return null for non-existing values', () => {
        expect(bt.find(100)).toBeNull();
        expect(bt.find(0)).toBeNull();
    });
});

describe('BinaryTree PreOrder Traversal', () => {
    it('should traverse in pre-order', () => {
        const result: number[] = [];
        traversePreOrder(bt.root, (node) => result.push(node.value));
        expect(result).toEqual([20, 10, 6, 3, 8, 14, 30, 24, 26]);
    });
});

describe('BinaryTree InOrder Traversal', () => {
    it('should traverse in in-order', () => {
        const result: number[] = [];
        traverseInOrder(bt.root, (node) => result.push(node.value));
        expect(result).toEqual([3, 6, 8, 10, 14, 20, 24, 26, 30]);
    });
});

describe('BinaryTree PostOrder Traversal', () => {
    it('should traverse in post-order', () => {
        const result: number[] = [];
        traversePostOrder(bt.root, (node) => result.push(node.value));
        expect(result).toEqual([3, 8, 6, 14, 10, 26, 24, 30, 20]);
    });
});

describe('BinaryTree LevelOrder Traversal', () => {
    it('should traverse in level-order', () => {
        const result: number[] = [];
        traverseLevelOrder(bt.root, (node) => result.push(node.value));
        expect(result).toEqual([20, 10, 30, 6, 14, 24, 3, 8, 26]);
    });
});

describe('BinaryTree Delete', () => {
    it('should delete a leaf node', () => {
        bt.delete(3);
        expect(bt.find(3)).toBeNull();
    });

    it('should delete a node with one child', () => {
        bt.delete(6);
        expect(bt.find(6)).toBeNull();
    });

    it('should delete a node with two children', () => {
        bt.delete(10);
        expect(bt.find(10)).toBeNull();
    });

    it('should delete the root node', () => {
        bt.delete(20);
        expect(bt.find(20)).toBeNull();
    });
});

describe('BinaryTree Height', () => {
    it('should calculate the height of the tree', () => {
        expect(binaryTreeHeight(bt.root)).toBe(2);
    });
});
