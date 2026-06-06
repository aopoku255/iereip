import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  error: "",
  success: "",
  user: {},
  adminProfile: null,
  adminError: null,
  adminLoading: false
};

const ProfileSlice = createSlice({
  name: "Profile",
  initialState,
  reducers: { 
    profileSuccess(state, action) {
      state.success = action.payload.status;
      state.user = { ...action.payload.data, roles: ['superadmin'] }; // Set superadmin role
    },
    profileError(state, action) {
        state.error = action.payload
    },
    editProfileChange(state){
      state = { ...state };
    },
    resetProfileFlagChange(state){
      state.success = null
    },
    adminProfileSuccess(state, action) {
      state.adminLoading = false;
      state.adminProfile = action.payload;
      state.adminError = null;
    },
    adminProfileError(state, action) {
      state.adminLoading = false;
      state.adminError = action.payload;
      state.adminProfile = null;
    },
    adminProfileLoading(state) {
      state.adminLoading = true;
      state.adminError = null;
    }
  },
});

export const {
    profileSuccess,
    profileError,
    editProfileChange,
    resetProfileFlagChange,
    adminProfileSuccess,
    adminProfileError,
    adminProfileLoading
} = ProfileSlice.actions

export default ProfileSlice.reducer;