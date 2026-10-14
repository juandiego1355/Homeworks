/**
 * Nodo de un árbol n-ario.
 * - Una carpeta (folder) puede tener N hijos.
 * - Un archivo (file) NUNCA puede tener hijos.
 */
export const NodeType = Object.freeze({ FILE: "file", FOLDER: "folder" });

export class TreeNode {
  constructor({ id, name, type, parentId = null, createdBy = "", createdAt = null }) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.parentId = parentId;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.children = [];
  }

  get isFolder() {
    return this.type === NodeType.FOLDER;
  }

  get isFile() {
    return this.type === NodeType.FILE;
  }

  hasChildNamed(name) {
    const n = name.trim().toLowerCase();
    return this.children.some((c) => c.name.toLowerCase() === n);
  }

  addChild(node) {
    if (this.isFile) {
      throw new Error("Un archivo no puede tener hijos.");
    }
    if (this.hasChildNamed(node.name)) {
      throw new Error(`Ya existe "${node.name}" en esta carpeta.`);
    }
    node.parentId = this.id === "root" ? null : this.id;
    this.children.push(node);
    return node;
  }

  removeChild(id) {
    const idx = this.children.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    return this.children.splice(idx, 1)[0];
  }
}
