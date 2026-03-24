import { createSlice } from "@reduxjs/toolkit";

const highlightSlice = createSlice({
  name: "highlight",
  initialState: {
    selectedText: "",
    noteComment: "",
    search : "",
    category : "All",
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
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;  
    }
  }
});

export const { setSelectedText, setNoteComment, clearHighlight, setSearch, setCategory } =
  highlightSlice.actions;

export default highlightSlice.reducer;