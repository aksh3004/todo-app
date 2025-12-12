import { Category, Todo } from "./types";

let todoIDCounter = 1;
let categoryIDCounter = 1;

const todos: Todo[] = [];
const categories: Category[] = [];

export const db = {
  getAllTodos() {
    return todos;
  },
  getAllCategories() {
    return categories;
  },
  getTodoById(id: string): Todo | undefined {
    return todos.find((todo) => todo.id === id);
  },
  getCategoryById(id: string): Category | undefined {
    return categories.find((category) => category.id === id);
  },
  addTodo(
    inputTodo: Omit<Todo, "id" | "createdAt" | "updatedAt" | "completed">
  ): Todo {
    const todo: Todo = {
      id: String(todoIDCounter++),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completed: false,
      ...inputTodo,
    };
    todos.push(todo);
    return todo;
  },
  updateTodo(
    id: string,
    updatedFields: Partial<Omit<Todo, "id" | "createdAt">>
  ): Todo | undefined {
    const index = todos.findIndex((todo) => todo.id === id);
    if (index === -1) return undefined;
    todos[index] = {
      ...todos[index],
      ...updatedFields,
    };
    return todos[index];
  },
  deleteTodo(id: string): boolean {
    const index = todos.findIndex((todo) => todo.id === id);
    if (index === -1) return false;
    todos.splice(index, 1);
    return true;
  },
  addCategory(name: string): Category {
    const category: Category = {
      id: String(categoryIDCounter++),
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    categories.push(category);
    return category;
  },
  updateCategory(
    id: string,
    updatedFields: Partial<Omit<Category, "id" | "createdAt">>
  ): Category | undefined {
    const index = categories.findIndex((category) => category.id === id);
    if (index === -1) return undefined;
    categories[index] = {
      ...categories[index],
      ...updatedFields,
    };
    return categories[index];
  },
  deleteCategory(id: string): boolean {
    const categoryIndex = categories.findIndex((category) => category.id === id);
    if (categoryIndex === -1) return false;
    for (let index = todos.length - 1; index >= 0; index--) {
      if (todos[index].categoryId === id) {
        todos.splice(index, 1);
      }
    }
    categories.splice(categoryIndex, 1);
    return true;
  },
};
