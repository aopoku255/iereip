import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIClient } from "../../helpers/api_helper";

export const getDashboardMetrics = createAsyncThunk(
  "dashboardMetrics/getDashboardMetrics",
  async (_, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.get("https://iereip-api.deducesolutions.com/api/v1/dashboard");
      const result = response || {};

      if (result?.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to fetch dashboard metrics");
      }

      return result.data || result;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch dashboard metrics");
    }
  }
);
