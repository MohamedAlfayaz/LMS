import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiSlice';
import highlightReducer from './highlightSlice';
import createArticleReducer from './createArticleSlice';


export const store = configureStore({
  reducer: {
    ui : uiReducer,
    highlight : highlightReducer,
    createArticle : createArticleReducer
  },
});