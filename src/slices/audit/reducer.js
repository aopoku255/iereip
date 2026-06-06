import { createSlice } from "@reduxjs/toolkit";
import { getAuditLogs } from "./thunk";

const initialState = {
  auditLogs: [],
  loading: false,
  error: null,
  total: 0,
};

export const auditSlice = createSlice({
  name: "audit",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getAuditLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.auditLogs = action.payload.logs;
        state.total = action.payload.total;
      })
      .addCase(getAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default auditSlice.reducer;
