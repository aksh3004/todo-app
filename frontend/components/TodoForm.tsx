import { type FormEvent, useState } from "react";
import type { Category, Todo } from "../src/types";
import { useAppDispatch } from "../src/hooks";
import { addCategory } from "../slices/categoriesSlice";
import { addTodo, updateTodo, deleteTodo } from "../slices/todosSlice";

function formatForInput(dateString: string) {
  return dateString.slice(0, 10);
}

type TodoFormProps = {
  categories: Category[];
};

function TodoForm({ categories }: TodoFormProps) {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [categoryId, setCategoryId] = useState<string>("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate || !categoryId) return;

    dispatch(
      addTodo({
        title: title.trim(),
        description: description.trim(),
        dueDate: new Date(dueDate).toISOString(),
        categoryId,
      })
    );

    setTitle("");
    setDescription("");
    setDueDate(new Date().toISOString().slice(0, 10));
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <h3>Add New Todo</h3>
      <input
        value={title}
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        value={description}
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="row">
        <label>
          Due Date
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </label>
        <label>
          Category
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button type="submit" disabled={!title || !dueDate || !categoryId}>
        Create
      </button>
    </form>
  );
}

function TodoItem({ todo }: { todo: Todo }) {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || "");
  const [dueDate, setDueDate] = useState(formatForInput(todo.dueDate));

  const toggleComplete = () => {
    dispatch(
      updateTodo({
        id: todo.id,
        updates: { completed: !todo.completed },
      })
    );
  };

  const handleDelete = () => {
    dispatch(deleteTodo(todo.id));
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !dueDate) return;

    dispatch(
      updateTodo({
        id: todo.id,
        updates: {
          title: title.trim(),
          description: description.trim(),
          dueDate: new Date(dueDate).toISOString(),
        },
      })
    );
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <form className="todo-item editing" onSubmit={handleSave}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <div className="actions">
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <h4>{todo.title}</h4>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={toggleComplete}
      />
      <div>
        <div className="todo-title">{todo.title}</div>
        {todo.description && (
          <div className="todo-desc">{todo.description}</div>
        )}
        <div className="todo-meta">
          Due: {formatForInput(todo.dueDate)} Created:{" "}
          {formatForInput(todo.createdAt)}
        </div>
      </div>
      <div className="actions">
        <button type="button" onClick={() => setIsEditing(true)}>
          Edit
        </button>
        <button type="button" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}

function CategoryForm() {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    dispatch(addCategory(name.trim()));
    setName("");
  };

  return (
    <form className="category-form" onSubmit={handleSubmit}>
      <h3>Add New Category</h3>
      <input
        value={name}
        placeholder="Category Name"
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit" disabled={!name.trim()}>
        Add category
      </button>
    </form>
  );
}

const exported = {
  TodoForm,
  TodoItem,
  CategoryForm,
};
export default exported;
