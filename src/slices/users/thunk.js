import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIClient } from "../../helpers/api_helper";

export const getUsers = createAsyncThunk(
  "users/getUsers",
  async (_, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.get("https://iereip-api.deducesolutions.com/api/v1/users");

      // APIClient returns the axios response payload (or the response itself).
      // The expected shape is: { code, status, message, data: [...] }
      const payload = response || {};

      if (payload?.code && payload.code !== "00") {
        return rejectWithValue(payload.message || "Failed to fetch users");
      }

      const users = payload.data || [];
      return Array.isArray(users) ? users : [];
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch users");
    }
  }
);

export const getUserById = createAsyncThunk(
  "users/getUserById",
  async (user_id, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.get(`https://iereip-api.deducesolutions.com/api/v1/users/${user_id}`);
      const payload = response || {};

      if (payload?.code && payload.code !== "00") {
        return rejectWithValue(payload.message || "Failed to fetch user details");
      }

      return payload.data || {};
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch user details");
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ user_id, payload }, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.put(`https://iereip-api.deducesolutions.com/api/v1/users/${user_id}`, payload);
      const result = response || {};

      if (result?.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to update user");
      }

      return result.data || {};
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to update user");
    }
  }
);

export const updateAccountType = createAsyncThunk(
  "users/updateAccountType",
  async ({ user_id, payload }, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.update(
        `https://iereip-api.deducesolutions.com/api/v1/users/${user_id}/account-type`,
        payload
      );
      const result = response || {};

      if (result?.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to update account type");
      }

      return result.data || {};
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to update account type");
    }
  }
);

export const uploadUserPhoto = createAsyncThunk(
  "users/uploadUserPhoto",
  async ({ user_id, file }, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const formData = new FormData();
      formData.append("photo", file);

      const response = await api.create(
        `https://iereip-api.deducesolutions.com/api/v1/users/${user_id}/photo`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const result = response || {};

      if (result?.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to upload photo");
      }

      return result.data || {};
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to upload photo");
    }
  }
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (payload, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const config = payload instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined;
      const response = await api.create("https://iereip-api.deducesolutions.com/api/v1/users", payload, config);
      const result = response || {};

      if (result?.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to create user");
      }

      return result.data || {};
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to create user");
    }
  }
);
