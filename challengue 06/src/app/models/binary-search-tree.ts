export interface TreeNodeView {
  name: string;
  children?: TreeNodeView[];
}

export class TreeNode {
  value: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;

  constructor(value: number) {
    this.value = value;
  }
}

export class BinarySearchTree {
  root: TreeNode | null = null;

  insert(value: number): void {
    const nuevoNodo = new TreeNode(value);

    if (!this.root) {
      this.root = nuevoNodo;
      return;
    }

    let actual = this.root;

    while (actual) {
      if (value < actual.value) {
        if (!actual.left) {
          actual.left = nuevoNodo;
          return;
        }
        actual = actual.left;
        continue;
      }

      if (value > actual.value) {
        if (!actual.right) {
          actual.right = nuevoNodo;
          return;
        }
        actual = actual.right;
        continue;
      }

      return;
    }
  }

  contains(value: number): boolean {
    let actual = this.root;

    while (actual) {
      if (value === actual.value) return true;
      if (value < actual.value) {
        actual = actual.left;
      } else {
        actual = actual.right;
      }
    }

    return false;
  }

  inorder(): number[] {
    const resultado: number[] = [];

    const recorrer = (nodo: TreeNode | null): void => {
      if (!nodo) return;
      recorrer(nodo.left);
      resultado.push(nodo.value);
      recorrer(nodo.right);
    };

    recorrer(this.root);
    return resultado;
  }

  preorder(): number[] {
    const resultado: number[] = [];

    const recorrer = (nodo: TreeNode | null): void => {
      if (!nodo) return;
      resultado.push(nodo.value);
      recorrer(nodo.left);
      recorrer(nodo.right);
    };

    recorrer(this.root);
    return resultado;
  }

  postorder(): number[] {
    const resultado: number[] = [];

    const recorrer = (nodo: TreeNode | null): void => {
      if (!nodo) return;
      recorrer(nodo.left);
      recorrer(nodo.right);
      resultado.push(nodo.value);
    };

    recorrer(this.root);
    return resultado;
  }

  toHierarchy(): TreeNodeView | null {
    const buildNode = (nodo: TreeNode | null): TreeNodeView | null => {
      if (!nodo) return null;

      return {
        name: String(nodo.value),
        children: [
          buildNode(nodo.left),
          buildNode(nodo.right),
        ].filter((child): child is TreeNodeView => child !== null),
      };
    };

    return buildNode(this.root);
  }
}
