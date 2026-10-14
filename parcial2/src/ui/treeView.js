import { ROOT_ID } from "../models/NaryTree.js";

/** Dibuja el árbol de forma recursiva usando DOM seguro (textContent). */
export function renderTree(container, tree, { selectedId, canEdit, onSelect, onDelete }) {
  container.replaceChildren(buildList([tree.root], 0));

  function buildList(nodes, depth) {
    const ul = document.createElement("ul");
    ul.className = depth === 0 ? "tree" : "tree__children";

    for (const node of nodes) {
      const li = document.createElement("li");
      li.className = "tree__item";

      const row = document.createElement("div");
      row.className = "tree__row";
      row.classList.toggle("is-selected", node.id === selectedId);
      row.classList.toggle("is-folder", node.isFolder);

      const label = document.createElement("button");
      label.type = "button";
      label.className = "tree__label";
      label.textContent = `${node.isFolder ? "📁" : "📄"} ${node.id === ROOT_ID ? "Raíz" : node.name}`;
      label.addEventListener("click", () => onSelect(node));
      row.append(label);

      if (node.createdBy) {
        const meta = document.createElement("span");
        meta.className = "tree__meta";
        meta.textContent = node.createdBy;
        row.append(meta);
      }

      if (canEdit && node.id !== ROOT_ID) {
        const del = document.createElement("button");
        del.type = "button";
        del.className = "tree__delete";
        del.title = "Eliminar";
        del.textContent = "🗑";
        del.addEventListener("click", () => onDelete(node));
        row.append(del);
      }

      li.append(row);
      if (node.children.length) li.append(buildList(node.children, depth + 1));
      ul.append(li);
    }
    return ul;
  }
}
