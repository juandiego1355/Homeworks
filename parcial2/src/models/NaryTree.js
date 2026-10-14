import { TreeNode, NodeType } from "./TreeNode.js";

export const ROOT_ID = "root";

/**
 * Árbol n-ario implementado desde cero (sin librerías).
 */
export class NaryTree {
  constructor() {
    this.root = new TreeNode({ id: ROOT_ID, name: "/", type: NodeType.FOLDER });
  }

  /** Búsqueda DFS por id. */
  find(id, node = this.root) {
    if (node.id === id) return node;
    for (const child of node.children) {
      const found = this.find(id, child);
      if (found) return found;
    }
    return null;
  }

  /** Inserta un nodo bajo el padre indicado (valida que el padre sea carpeta). */
  insert(parentId, node) {
    const parent = this.find(parentId);
    if (!parent) throw new Error("La carpeta destino no existe.");
    return parent.addChild(node);
  }

  /** Elimina un nodo y todo su subárbol. Devuelve los ids eliminados. */
  remove(id) {
    if (id === ROOT_ID) throw new Error("No se puede eliminar la raíz.");
    const target = this.find(id);
    if (!target) throw new Error("El nodo no existe.");
    const parent = this.find(target.parentId ?? ROOT_ID);
    parent.removeChild(id);
    return this.collectIds(target);
  }

  /** Ids de un nodo y todos sus descendientes (recorrido en preorden). */
  collectIds(node) {
    const ids = [node.id];
    for (const child of node.children) ids.push(...this.collectIds(child));
    return ids;
  }

  /** Ruta legible hasta un nodo, ej: /Docs/Tareas */
  pathOf(id) {
    const parts = [];
    let current = this.find(id);
    while (current && current.id !== ROOT_ID) {
      parts.unshift(current.name);
      current = this.find(current.parentId ?? ROOT_ID);
    }
    return "/" + parts.join("/");
  }

  /** Reconstruye el árbol a partir de la lista plana guardada en la BD. */
  static fromList(list) {
    const tree = new NaryTree();
    const nodes = list.map((d) => new TreeNode(d));
    const byId = new Map(nodes.map((n) => [n.id, n]));

    nodes
      .sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0))
      .forEach((node) => {
        const parent = node.parentId ? byId.get(node.parentId) : tree.root;
        if (!parent || parent.isFile) return; // dato inválido: se ignora
        parent.children.push(node);
      });

    return tree;
  }
}
