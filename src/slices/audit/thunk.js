import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIClient } from "../../helpers/api_helper";

export const getAuditLogs = createAsyncThunk(
  "audit/getAuditLogs",
  async (params, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      
      // Build query string from params
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.offset !== undefined) queryParams.append("offset", params.offset);
      if (params.module) queryParams.append("module", params.module);
      if (params.admin_id) queryParams.append("admin_id", params.admin_id);
      if (params.entity_type) queryParams.append("entity_type", params.entity_type);
      if (params.entity_id) queryParams.append("entity_id", params.entity_id);

      const response = await api.get(`/audit?${queryParams.toString()}`);
      const result = response || {};

      if (result?.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to fetch audit logs");
      }

      return {
        logs: result.data || [],
        total: result.total || 0,
      };
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch audit logs");
    }
  }
);
