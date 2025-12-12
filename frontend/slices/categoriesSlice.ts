import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Category } from "../src/types";
import * as api from "../src/api";

interface categoriesSlice {
  items: Category[];
  loading: boolean;
  error: string | null;
  selectedCategoryId: string | null;
}

const initialState: categoriesSlice = {
  items: [],
  loading: false,
  error: null,
  selectedCategoryId: null,
};

export const loadCategories = createAsyncThunk(
  "categories/loadCategories",
  async () => {
    return await api.fetchCategories();
  }
);

export const addCategory = createAsyncThunk(
  "categories/addCategory",
  async (name: string) => {
    return await api.createCategory(name);
  }
);

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async (payload: {
    id: string;
    updates: Partial<Omit<Category, "id" | "createdAt" | "updatedAt">>;
  }) => {
    return await api.updateCategory(payload.id, payload.updates);
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id: string) => {
    await api.deleteCategory(id);
    return id;
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    selectCategory(state, action: PayloadAction<string | null>) {
      state.selectedCategoryId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load categories";
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter((category) => category.id !== id);
        if (state.selectedCategoryId === id) {
          state.selectedCategoryId = null;
        }
      });
  },
});

export const { selectCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
