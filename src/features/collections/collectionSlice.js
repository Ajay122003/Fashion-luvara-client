import { createSlice } from "@reduxjs/toolkit";

const collectionSlice = createSlice({
  name: "collections",
  initialState: { items: [] },
  reducers: {
    setCollections: (state, action) => {
      state.items = action.payload;
    },
  },
});


export const { setCollections } = collectionSlice.actions;
export default collectionSlice.reducer;
