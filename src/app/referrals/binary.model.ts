export interface BinaryTreeNode {
  id: string;
  firstName: string;
  lastName: string;
  username: string | null;
  leftCount: number;
  rightCount: number;
  position: 'Left' | 'Right' | null;
}

export interface BinaryTree {
  root: BinaryTreeNode | null;
  left: BinaryTreeNode | null;
  right: BinaryTreeNode | null;
}

export interface BinaryStats {
  leftCount: number;
  rightCount: number;
  matchedPairs: number;
  totalEarned: number;
}

export interface BinaryPair {
  id: string;
  pairsMatched: number;
  commissionAmount: number;
  createdAt: string;
  paidAt: string | null;
}
