import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface intialStateType {
  name: string;
  email: string;
}

const initialState: intialStateType = {
  name: "",
  email: "",
};

export const userSlice = createSlice({
  initialState: initialState,
  name: "users",
  reducers: {
    setUser: (state, action: PayloadAction<intialStateType>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
