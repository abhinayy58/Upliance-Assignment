import { configureStore } from "@reduxjs/toolkit";
import formBuilderReducer from "./slices/formBuilder";

export const store = configureStore({
  reducer: {
    formBuilder: formBuilderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
