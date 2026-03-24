import { createSlice } from "@reduxjs/toolkit";

const createArticleSlice = createSlice({
    name: "createArticle",
    initialState: {
        title: "",
        category: "Science",
        blocks: []
    },
    reducers: {
        setTitle: (state, action) => {
            state.title = action.payload;
        },
        setCategory: (state, action) => {
            state.category = action.payload;
        },
        addBlock: (state, action) => {
            state.blocks.push({ type: action.payload, value: "" });
        },
        updateBlock: (state, action) => {
            const { index, value, highlights } = action.payload;

            state.blocks[index].value = value;

            if (highlights) {
                state.blocks[index].highlights = highlights;
            }
        },
        removeBlock: (state, action) => {
            const index = action.payload;
            state.blocks.splice(index, 1);
        },
        resetArticle: (state) => {
            state.title = "";
            state.category = "Science";
            state.blocks = [];
        },
        setAllBlocks: (state, action) => {
            state.blocks = action.payload;
        },
    }
});

export const {
    setTitle,
    setCategory,
    addBlock,
    updateBlock,
    removeBlock,
    resetArticle,
    setAllBlocks
} = createArticleSlice.actions;

export default createArticleSlice.reducer;