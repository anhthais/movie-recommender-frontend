import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/user.type";

type AuthState = {
  user: User | null;
};

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticatedUser: (state, action: PayloadAction<User>) => {
      const user = action.payload;
      state.user = user;
    },
    logOut: (state) => {
      state.user = null;
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    },
    renewToken: (state, action: PayloadAction<string>) => {
      console.log("Renew token", action.payload);
      console.log("Renew token", state);
    },
  },
});

export const { setAuthenticatedUser, logOut, renewToken } = authSlice.actions;

export default authSlice.reducer;

export const getCurrentAuthentication = (state: any): User => state.auth.user;
