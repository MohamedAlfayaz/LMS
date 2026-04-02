import { createSlice } from "@reduxjs/toolkit";

const highlightSlice = createSlice({
  name: "highlight",
  initialState: {
    selectedText: "",
    noteComment: "",

    // 🔥 TABLE STATE
    search: "",
    category: "All",
    page: 1,
    perPage: 5,
  },

  reducers: {
    setSelectedText: (state, action) => {
      state.selectedText = action.payload;
    },

    setNoteComment: (state, action) => {
      state.noteComment = action.payload;
    },

    clearHighlight: (state) => {
      state.selectedText = "";
      state.noteComment = "";
    },

    // 🔥 SEARCH
    setSearch: (state, action) => {
      state.search = action.payload;
      state.page = 1; // reset page
    },

    // 🔥 CATEGORY FILTER
    setCategory: (state, action) => {
      state.category = action.payload;
      state.page = 1;
    },

    // 🔥 PAGINATION
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
});

export const {
  setSelectedText,
  setNoteComment,
  clearHighlight,
  setSearch,
  setCategory,
  setPage,
} = highlightSlice.actions;

export default highlightSlice.reducer;