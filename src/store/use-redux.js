import { createSlice, configureStore } from "@reduxjs/toolkit";

const initialState = { isUpdateClicked: false };

const updateSlice = createSlice({
  name: "update",
  initialState: initialState,
  reducers: {
    update(state) {
      state.isUpdateClicked = true;
    },
  },
});

const store = configureStore({ reducer: updateSlice.reducer });

export const updateAction = updateSlice.actions;

export default store;
