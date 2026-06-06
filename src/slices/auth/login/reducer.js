import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  user: {},
  permissions: [],
  error: "", // for error message
  loading: false,
  isUserLogout: false,
  errorMsg: false, // for error
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    loginLoading(state) {
      state.loading = true;
      state.error = "";
      state.errorMsg = false;
    },
    apiError(state, action) {
      const payload = action.payload;
      state.error =
        payload?.data?.message ||
        payload?.message ||
        payload?.data ||
        payload ||
        "Login failed.";
      state.loading = false;
      state.isUserLogout = false;
      state.errorMsg = true;
    },
    loginSuccess(state, action) {
      state.user = action.payload?.data?.admin || action.payload?.admin || action.payload; // Set admin data
      state.permissions = action.payload?.data?.permissions || action.payload?.permissions || []; // Store permissions
      state.loading = false;
      state.errorMsg = false;
    },
    logoutUserSuccess(state, action) {
      state.isUserLogout = true
    },
    reset_login_flag(state) {
      state.error = null
      state.loading = false;
      state.errorMsg = false;
    }
  },
});

export const {
  apiError,
  loginSuccess,
  logoutUserSuccess,
  reset_login_flag,
  loginLoading
} = loginSlice.actions

export default loginSlice.reducer;