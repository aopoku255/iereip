import { createSlice } from "@reduxjs/toolkit";
import { getUsers, getUserById, updateUser, updateAccountType, uploadUserPhoto, createUser } from "./thunk";

const initialState = {
  users: [],
  loading: false,
  error: null,
  selectedUser: null,
  selectedUserLoading: false,
  selectedUserError: null,
  updateLoading: false,
  updateError: null,
  updateSuccess: false,
  createUser: {
    loading: false,
    error: null,
    success: false,
  },
  accountTypeLoading: false,
  accountTypeError: null,
  accountTypeSuccess: false,
  photoUploadLoading: false,
  photoUploadError: null,
  photoUploadSuccess: false,
  uploadedPhotoUrl: null,
};

const usersSlice = createSlice({
  name: "Users",
  initialState,
  reducers: {
    resetUserUpdateStatus: (state) => {
      state.updateSuccess = false;
      state.updateError = null;
    },
    resetAccountTypeStatus: (state) => {
      state.accountTypeSuccess = false;
      state.accountTypeError = null;
    },
    resetPhotoUploadStatus: (state) => {
      state.photoUploadSuccess = false;
      state.photoUploadError = null;
      state.uploadedPhotoUrl = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      })
      .addCase(getUserById.pending, (state) => {
        state.selectedUserLoading = true;
        state.selectedUserError = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.selectedUserLoading = false;
        state.selectedUser = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.selectedUserLoading = false;
        state.selectedUserError = action.payload || action.error?.message;
      })
      .addCase(updateUser.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        state.selectedUser = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload || action.error?.message;
        state.updateSuccess = false;
      })
      .addCase(updateAccountType.pending, (state) => {
        state.accountTypeLoading = true;
        state.accountTypeError = null;
        state.accountTypeSuccess = false;
      })
      .addCase(updateAccountType.fulfilled, (state, action) => {
        state.accountTypeLoading = false;
        state.accountTypeSuccess = true;
        state.selectedUser = action.payload || state.selectedUser;
      })
      .addCase(updateAccountType.rejected, (state, action) => {
        state.accountTypeLoading = false;
        state.accountTypeError = action.payload || action.error?.message;
        state.accountTypeSuccess = false;
      })
      .addCase(uploadUserPhoto.pending, (state) => {
        state.photoUploadLoading = true;
        state.photoUploadError = null;
        state.photoUploadSuccess = false;
      })
      .addCase(uploadUserPhoto.fulfilled, (state, action) => {
        state.photoUploadLoading = false;
        state.photoUploadSuccess = true;
        state.uploadedPhotoUrl = action.payload?.photo_url || null;
        if (state.selectedUser) {
          state.selectedUser.photo_url = action.payload?.photo_url || state.selectedUser.photo_url;
        }
      })
      .addCase(uploadUserPhoto.rejected, (state, action) => {
        state.photoUploadLoading = false;
        state.photoUploadError = action.payload || action.error?.message;
        state.photoUploadSuccess = false;
      })
      .addCase(createUser.pending, (state) => {
        state.createUser = state.createUser || { loading: false, error: null, success: false };
        state.createUser.loading = true;
        state.createUser.error = null;
        state.createUser.success = false;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.createUser = state.createUser || { loading: false, error: null, success: false };
        state.createUser.loading = false;
        state.createUser.success = true;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.createUser = state.createUser || { loading: false, error: null, success: false };
        state.createUser.loading = false;
        state.createUser.error = action.payload || action.error?.message;
        state.createUser.success = false;
      });
  },
});

export const { resetUserUpdateStatus, resetAccountTypeStatus, resetPhotoUploadStatus } = usersSlice.actions;
export default usersSlice.reducer;
