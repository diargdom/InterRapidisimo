import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "authState",
  initialState: {
    token: null,
    nombre: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.nombre = action.payload.nombre;
    },
    logout: (state) => {
      (state.token = null), (state.role = null);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
