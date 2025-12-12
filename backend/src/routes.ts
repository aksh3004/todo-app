import { Router, Request, Response } from "express";
import { db } from "./store";
import { HTTPError } from "./middleware";
import type { StatusFilter, SortKey } from "./types";

const router = Router();

// Get all todos
router.get("/todos", (req, res) => {
  const status = req.query.status as StatusFilter | "all";
  const sortBy = req.query.sortBy as SortKey | "dueDate";
  const categoryId = req.query.categoryId as string | undefined;
  const search = (req.query.search as string | undefined)?.toLowerCase();

  let items = db.getAllTodos();

  if (status === "pending") {
    items = items.filter((item) => !item.completed);
  } else if (status === "completed") {
    items = items.filter((item) => item.completed);
  }

  if (categoryId) {
    items = items.filter((item) => item.categoryId === categoryId);
  }

  if (search && search.trim()) {
    const term = search.trim();
    items = items.filter((item) => {
      const title = item.title.toLowerCase();
      const description = (item.description ?? "").toLowerCase();
      return title.includes(term) || description.includes(term);
    });
  }

  items = [...items].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    return aVal.localeCompare(bVal);
  });

  res.json(items);
});

// Get todo by ID
router.get("/todos/:id", (req, res) => {
  const todo = db.getTodoById(req.params.id);

  if (!todo) {
    throw new HTTPError(404, "Todo not found");
  }
  res.json(todo);
});

// Create todo
router.post("/todos", (req, res, next) => {
  try {
    const { title, description, categoryId, dueDate } = req.body;

    if (!title || !title.trim() || typeof title !== "string") {
      throw new HTTPError(400, "Todo title is required");
    }

    if (!categoryId || typeof categoryId !== "string") {
      throw new HTTPError(400, "Category ID is required");
    }

    if (
      !dueDate ||
      typeof dueDate !== "string" ||
      Number.isNaN(Date.parse(dueDate))
    ) {
      throw new HTTPError(400, "Valid due date is required");
    }

    if (!db.getCategoryById(categoryId)) {
      throw new HTTPError(400, "Category not found");
    }

    const todo = db.addTodo({
      title: title.trim(),
      description: description ? String(description.trim()) : "",
      dueDate: new Date(dueDate).toISOString(),
      categoryId: categoryId,
    });

    res.status(201).json(todo);
  } catch (err) {
    next(err);
  }
});

// Update todo
router.patch("/todos/:id", (req, res) => {
  const todo = db.updateTodo(req.params.id, req.body);
  res.json(todo);
});

// Delete todo
router.delete("/todos/:id", (req, res) => {
  db.deleteTodo(req.params.id);
  res.status(204).send();
});

// Get all categories
router.get("/categories", (req, res) => {
  res.json(db.getAllCategories());
});

// Get category by ID
router.get("/categories/:id", (req, res) => {
  const category = db.getCategoryById(req.params.id);

  if (!category) {
    throw new HTTPError(404, "Category not found");
  }
  res.json(category);
});

// Create category
router.post("/categories", (req, res, next) => {
  const { name } = req.body;
  try {
    if (!name || !name.trim() || typeof name !== "string") {
      throw new HTTPError(400, "Category name is required");
    }
    const category = db.addCategory(name.trim());
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
});

// Update category
router.patch("/categories/:id", (req, res) => {
  const category = db.updateCategory(req.params.id, req.body);
  res.json(category);
});

// Delete category
router.delete("/categories/:id", (req, res) => {
  db.deleteCategory(req.params.id);
  res.status(204).send();
});

export default router;
