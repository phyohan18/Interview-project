import { configureStore } from "@reduxjs/toolkit";
import imageReducer from '../features/imageSlice'
import modalReducer from '../features/modalSlice'

export const store = configureStore({
    reducer:{
        image: imageReducer,
        modal: modalReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false})
});
