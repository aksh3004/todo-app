import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import { loadCategories, selectCategory } from "../slices/categoriesSlice";
import { loadTodos, setStatusFilter } from "../slices/todosSlice";
import type { StatusFilter, Todo } from "./types";
import TodoForm from "../components/TodoForm";
import "./index.css";

function App() {
  const dispatch = useAppDispatch();
  const { items: categories, selectedCategoryId } = useAppSelector(
    (state) => state.categories
  );
  const {
    items: todos,
    loading,
    error,
    statusFilter,
  } = useAppSelector((state) => state.todos);

  useEffect(() => {
    dispatch(loadCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadTodos());
  }, [dispatch, selectedCategoryId, statusFilter]);

  const grouped: Record<string, Todo[]> = {};
  for (const todo of todos) {
    const key = todo.categoryId || "Uncategorized";
    grouped[key] = grouped[key] || [];
    grouped[key].push(todo);
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>Categories</h2>

        <button
          className={!selectedCategoryId ? "selected" : ""}
          onClick={() => dispatch(selectCategory(null))}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={selectedCategoryId === category.id ? "selected" : ""}
            onClick={() => dispatch(selectCategory(category.id))}
          >
            {category.name}
          </button>
        ))}
        <TodoForm.CategoryForm />
      </aside>

      <main className="main">
        <header className="toolbar">
          <div>
            <label>Status: </label>
            <select
              value={statusFilter}
              onChange={(e) =>
                dispatch(setStatusFilter(e.target.value as StatusFilter))
              }
            >
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </header>
        <section className="todo-section">
          <h2>Todos</h2>
          {loading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && todos.length === 0 && <p>No todos found.</p>}
          <TodoForm.TodoForm categories={categories} />

          <div className="todo-groups">
            {Object.entries(grouped).map(([categoryId, items]) => {
              const category = categories.find(
                (category) => category.id === categoryId
              );
              const label = category ? category.name : "Uncategorized";
              return (
                <div key={categoryId} className="todo-group">
                  <h3>{label}</h3>
                  {items.map((todo) => (
                    <TodoForm.TodoItem key={todo.id} todo={todo} />
                  ))}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
