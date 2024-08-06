import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
  data: {
    CUST_ID: string;
    TOKEN: string;
    CODE: string;
    FNAME: string;
    LNAME: string;
    MPHONE: string;
    EMAIL: string;
  };
}

const initialState: UserState = {
  data: {
    CUST_ID: "",
    TOKEN: "",
    CODE: "",
    FNAME: "",
    LNAME: "",
    MPHONE: "",
    EMAIL: "",
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      console.log("State provided to store", action.payload);
      state.data = {
        ...state.data,
        ...action.payload,
      };
    },
    clearUserData: (state) => {
      state.data = initialState.data;
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;

export default userSlice.reducer;
