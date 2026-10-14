import {
  collection,
  addDoc,
  getDocs,
  writeBatch,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase.js";

const COL = collection(db, "nodes");

/** Lee todos los nodos (lista plana). */
export async function loadNodes() {
  const snap = await getDocs(COL);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name,
      type: data.type,
      parentId: data.parentId ?? null,
      createdBy: data.createdBy,
      createdAt: data.createdAt?.toMillis?.() ?? 0,
    };
  });
}

/** Crea un nodo. Exige usuario autenticado y guarda su correo como validador. */
export async function createNode({ name, type, parentId }, user) {
  if (!user?.email) throw new Error("Debes iniciar sesión para crear.");
  const ref = await addDoc(COL, {
    name: name.trim(),
    type,
    parentId,
    createdBy: user.email,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/** Elimina varios nodos (subárbol completo) en una sola operación. */
export async function deleteNodes(ids, user) {
  if (!user?.email) throw new Error("Debes iniciar sesión para eliminar.");
  const batch = writeBatch(db);
  ids.forEach((id) => batch.delete(doc(db, "nodes", id)));
  await batch.commit();
}
