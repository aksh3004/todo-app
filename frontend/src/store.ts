import { configureStore } from "@reduxjs/toolkit";
import todosReducer from "../slices/todosSlice";
import categoriesReducer from "../slices/categoriesSlice";

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    categories: categoriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;