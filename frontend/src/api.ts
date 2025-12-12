import axios from "axios";
import type { Todo, Category, StatusFilter, SortKey } from "./types";

const api = axios.create({
  baseURL: "http://localhost:4000",
});

export interface FetchTodosPayload {
  status?: StatusFilter;
  sortBy?: SortKey;
  categoryId?: string;
}

export const fetchTodos = async (
  params: FetchTodosPayload = {}
): Promise<Todo[]> => {
  const response = await api.get<Todo[]>("/todos", { params });
  return response.data;
};

export const createTodo = async (todo: {
  title: string;
  description: string;
  dueDate: string;
  categoryId: string;
}): Promise<Todo> => {
  const response = await api.post<Todo>("/todos", todo);
  return response.data;
};

export const updateTodo = async (
  id: string,
  updates: Partial<Omit<Todo, "id" | "createdAt" | "updatedAt">>
): Promise<Todo> => {
  const response = await api.patch<Todo>(`/todos/${id}`, updates);
  return response.data;
};

export const deleteTodo = async (id: string): Promise<void> => {
  await api.delete(`/todos/${id}`);
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>("/categories");
  return response.data;
};

export const createCategory = async (name: string): Promise<Category> => {
  const response = await api.post<Category>("/categories", { name });
  return response.data;
};

export const updateCategory = async (
  id: string,
  updates: Partial<Omit<Category, "id" | "createdAt" | "updatedAt">>
): Promise<Category> => {
  const response = await api.patch<Category>(`/categories/${id}`, updates);
  return response.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`);
};
