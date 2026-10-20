import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { Task, TaskInput } from '../models/task.model';
import { useFirebase } from './use-firebase';

/** Hook: toda la lógica de Firestore para las tareas (CRUD + toggle). */
export function useFirestoreTasks() {
  const db = getFirestore(useFirebase());
  const tasksRef = collection(db, 'tasks');

  return {
    /** Escucha en tiempo real las tareas del usuario. Devuelve la función para cancelar. */
    listen: (userId: string, onData: (tasks: Task[]) => void, onError: (e: unknown) => void) =>
      onSnapshot(
        query(tasksRef, where('userId', '==', userId)),
        (snap) => {
          const tasks = snap.docs
            .map((d) => ({ id: d.id, ...(d.data() as Omit<Task, 'id'>) }))
            .sort((a, b) => b.createdAt - a.createdAt);
          onData(tasks);
        },
        onError,
      ),

    create: (userId: string, input: TaskInput) =>
      addDoc(tasksRef, {
        ...input,
        done: false,
        userId,
        createdAt: Date.now(),
      }),

    update: (id: string, input: TaskInput) => updateDoc(doc(db, 'tasks', id), { ...input }),

    toggle: (id: string, done: boolean) => updateDoc(doc(db, 'tasks', id), { done }),

    remove: (id: string) => deleteDoc(doc(db, 'tasks', id)),
  };
}
