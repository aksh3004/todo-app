export interface Todo {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
