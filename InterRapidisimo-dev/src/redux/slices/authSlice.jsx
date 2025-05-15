import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "authState",
  initialState: {
    token: null,
    nombre: null,
    role: null,
    estudianteId: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.nombre = action.payload.nombre;
      state.role = action.payload.role;
      state.estudianteId = action.payload.estudianteId;
    },
    logout: (state) => {
      state.token = null;
      state.nombre = null;
      state.role = null;
      state.estudianteId = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
