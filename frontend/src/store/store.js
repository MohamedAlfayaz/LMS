import { configureStore } from '@reduxjs/toolkit';
import highlightReducer from './highlightSlice';
import createArticleReducer from './createArticleSlice';
import modalReducer from './modalSlice';


export const store = configureStore({
  reducer: {
    highlight : highlightReducer,
    createArticle : createArticleReducer,
    modal : modalReducer
  },
});