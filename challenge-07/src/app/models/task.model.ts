export interface Task {
  id: string;
  title: string;
  description: string;
  done: boolean;
  userId: string;
  createdAt: number;
}

export type TaskInput = Pick<Task, 'title' | 'description'>;
