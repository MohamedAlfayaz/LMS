import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    active: "Dashboard",
  },
  reducers: {
    setActive(state, action){
        state.active = action.payload;
    }
  },
});

export const { setActive } = uiSlice.actions;

export default uiSlice.reducer;