import "./styles/main.scss";
import { NaryTree, ROOT_ID } from "./models/NaryTree.js";
import { login, register, logout, onUserChange, friendlyAuthError } from "./services/authService.js";
import { loadNodes, createNode, deleteNodes } from "./services/treeRepository.js";
import { renderTree } from "./ui/treeView.js";

const $ = (id) => document.getElementById(id);

const state = { user: null, tree: new NaryTree(), selectedId: ROOT_ID };

/* ---------- Render ---------- */
function render() {
  const canEdit = !!state.user;

  $("auth-panel").hidden = canEdit;
  $("editor-panel").hidden = !canEdit;
  $("target-label").textContent = state.tree.pathOf(state.selectedId);

  $("session").replaceChildren();
  if (canEdit) {
    const span = document.createElement("span");
    span.textContent = state.user.email;
    const btn = document.createElement("button");
    btn.className = "btn small";
    btn.textContent = "Salir";
    btn.addEventListener("click", () => logout());
    $("session").append(span, btn);
  }

  renderTree($("tree"), state.tree, {
    selectedId: state.selectedId,
    canEdit,
    onSelect: (node) => {
      state.selectedId = node.id;
      render();
    },
    onDelete: handleDelete,
  });
}

async function refresh() {
  state.tree = NaryTree.fromList(await loadNodes());
  if (!state.tree.find(state.selectedId)) state.selectedId = ROOT_ID;
  render();
}

/* ---------- Auth ---------- */
async function handleAuth(action) {
  const email = $("email").value.trim();
  const password = $("password").value;
  try {
    $("auth-msg").textContent = "";
    await action(email, password);
    $("auth-form").reset();
  } catch (e) {
    $("auth-msg").textContent = friendlyAuthError(e);
  }
}

$("auth-form").addEventListener("submit", (e) => {
  e.preventDefault();
  handleAuth(login);
});
$("btn-register").addEventListener("click", () => handleAuth(register));

/* ---------- Crear / eliminar ---------- */
$("create-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = $("create-msg");
  msg.textContent = "";

  try {
    if (!state.user) throw new Error("Debes iniciar sesión para crear.");

    const name = $("node-name").value.trim();
    const type = $("node-type").value;
    const parent = state.tree.find(state.selectedId);

    // Validaciones del árbol ANTES de guardar
    if (parent.isFile) throw new Error("Un archivo no puede tener hijos. Selecciona una carpeta.");
    if (parent.hasChildNamed(name)) throw new Error(`Ya existe "${name}" en esta carpeta.`);

    const parentId = parent.id === ROOT_ID ? null : parent.id;
    await createNode({ name, type, parentId }, state.user);

    $("node-name").value = "";
    await refresh();
  } catch (err) {
    msg.textContent = err.message;
  }
});

async function handleDelete(node) {
  if (!confirm(`¿Eliminar "${node.name}"${node.children.length ? " y todo su contenido" : ""}?`)) return;
  try {
    await deleteNodes(state.tree.collectIds(node), state.user);
    await refresh();
  } catch (err) {
    $("create-msg").textContent = err.message;
  }
}

/* ---------- Inicio ---------- */
onUserChange((user) => {
  state.user = user;
  render();
});
refresh();
