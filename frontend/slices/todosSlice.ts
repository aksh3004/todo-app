import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Todo, StatusFilter, SortKey } from "../src/types";
import * as api from "../src/api";
import type { RootState } from "../src/store";
import { deleteCategory } from "./categoriesSlice";

interface todosSlice {
  items: Todo[];
  loading: boolean;
  error: string | null;
  statusFilter: StatusFilter;
  sortBy: SortKey;
  searchTerm: string;
}

const initialState: todosSlice = {
  items: [],
  loading: false,
  error: null,
  statusFilter: "all",
  sortBy: "dueDate",
  searchTerm: "",
};

export const loadTodos = createAsyncThunk<Todo[], void, { state: RootState }>(
  "todos/loadTodos",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const { statusFilter, sortBy, searchTerm } = state.todos;
    const selectedCategoryId = state.categories.selectedCategoryId;
    return await api.fetchTodos({
      status: statusFilter,
      sortBy: sortBy,
      categoryId: selectedCategoryId || undefined,
      search: searchTerm || undefined,
    });
  }
);

export const addTodo = createAsyncThunk(
  "todos/addTodo",
  async (payload: {
    title: string;
    description: string;
    dueDate: string;
    categoryId: string;
  }) => {
    return await api.createTodo(payload);
  }
);

export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async (payload: {
    id: string;
    updates: Partial<Omit<Todo, "id" | "createdAt" | "updatedAt">>;
  }) => {
    return await api.updateTodo(payload.id, payload.updates);
  }
);

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (id: string) => {
    await api.deleteTodo(id);
    return id;
  }
);

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setStatusFilter(state, action: PayloadAction<StatusFilter>) {
      state.statusFilter = action.payload;
    },
    setSortBy(state, action: PayloadAction<SortKey>) {
      state.sortBy = action.payload;
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load todos";
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (todo) => todo.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.items = state.items.filter((todo) => todo.id !== action.payload);
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (todo) => todo.categoryId !== action.payload
        );
      });
  },
});

export const { setStatusFilter, setSortBy, setSearchTerm } = todosSlice.actions;
export default todosSlice.reducer;
