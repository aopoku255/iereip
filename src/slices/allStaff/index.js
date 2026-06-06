import { createSlice } from "@reduxjs/toolkit";
import {
  getStaff,
  getStaffById,
  getRoles,
  createStaff,
  updateStaff,
  toggleStaffStatus,
  createRole,
} from "./thunk";

const initialState = {
  users: [],
  roles: [],
  selectedStaff: null,
  loading: false,
  rolesLoading: false,
  selectedStaffLoading: false,
  addLoading: false,
  updateLoading: false,
  toggleStatusLoading: false,
  createRoleLoading: false,
  error: null,
  rolesError: null,
  selectedStaffError: null,
  addError: null,
  updateError: null,
  toggleStatusError: null,
  createRoleError: null,
};

const StaffSlice = createSlice({
  name: "Staff",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStaff.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getStaff.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(getStaff.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    });

    builder.addCase(getRoles.pending, (state) => {
      state.rolesLoading = true;
      state.rolesError = null;
    });
    builder.addCase(getRoles.fulfilled, (state, action) => {
      state.rolesLoading = false;
      state.roles = action.payload;
    });
    builder.addCase(getRoles.rejected, (state, action) => {
      state.rolesLoading = false;
      state.rolesError = action.payload || action.error.message;
    });

    builder.addCase(getStaffById.pending, (state) => {
      state.selectedStaffLoading = true;
      state.selectedStaffError = null;
    });
    builder.addCase(getStaffById.fulfilled, (state, action) => {
      state.selectedStaffLoading = false;
      state.selectedStaff = action.payload;
    });
    builder.addCase(getStaffById.rejected, (state, action) => {
      state.selectedStaffLoading = false;
      state.selectedStaffError = action.payload || action.error.message;
    });

    builder.addCase(createStaff.pending, (state) => {
      state.addLoading = true;
      state.addError = null;
    });
    builder.addCase(createStaff.fulfilled, (state) => {
      state.addLoading = false;
    });
    builder.addCase(createStaff.rejected, (state, action) => {
      state.addLoading = false;
      state.addError = action.payload || action.error.message;
    });

    builder.addCase(updateStaff.pending, (state) => {
      state.updateLoading = true;
      state.updateError = null;
    });
    builder.addCase(updateStaff.fulfilled, (state) => {
      state.updateLoading = false;
    });
    builder.addCase(updateStaff.rejected, (state, action) => {
      state.updateLoading = false;
      state.updateError = action.payload || action.error.message;
    });

    builder.addCase(toggleStaffStatus.pending, (state) => {
      state.toggleStatusLoading = true;
      state.toggleStatusError = null;
    });
    builder.addCase(toggleStaffStatus.fulfilled, (state) => {
      state.toggleStatusLoading = false;
    });
    builder.addCase(toggleStaffStatus.rejected, (state, action) => {
      state.toggleStatusLoading = false;
      state.toggleStatusError = action.payload || action.error.message;
    });

    builder.addCase(createRole.pending, (state) => {
      state.createRoleLoading = true;
      state.createRoleError = null;
    });
    builder.addCase(createRole.fulfilled, (state, action) => {
      state.createRoleLoading = false;
      if (action.payload?.id) {
        state.roles = [...state.roles, action.payload];
      }
    });
    builder.addCase(createRole.rejected, (state, action) => {
      state.createRoleLoading = false;
      state.createRoleError = action.payload || action.error.message;
    });
  },
});

export default StaffSlice.reducer;
