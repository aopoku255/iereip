import { createSlice } from "@reduxjs/toolkit";
import { getDashboardMetrics } from "./thunk";

export const initialState = {
  metrics: null,
  loading: false,
  error: null
};

const DashboardMetricsSlice = createSlice({
  name: 'DashboardMetrics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload;
      })
      .addCase(getDashboardMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch metrics";
      });
  }
});

export default DashboardMetricsSlice.reducer;
