import { configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import imageReducer from "../features/imageSlice";
import modalReducer from "../features/modalSlice";

// Define the shape of the root state
export type RootState = ReturnType<typeof store.getState>;

// Create the Redux store with reducers and middleware
export const store = configureStore({
  reducer: {
    image: imageReducer,
    modal: modalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Disable serializableCheck middleware to allow for non-serializable values in state
      serializableCheck: false,
    }),
});

// Define the function to extract the image state from the Redux store
export const imageState = (state: RootState) => state.image;

// Define the function to extract the modal state from the Redux store
export const modalState = (state: RootState) => state.modal;