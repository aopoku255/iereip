import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIClient } from "../../helpers/api_helper";

export const getStaff = createAsyncThunk(
  "staff/getStaff",
  async (_, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.get("/admin/admins");
      const admins = response.data || [];

      const mappedStaff = admins.map((admin, index) => {
        const lastLoginDate = admin.last_login ? new Date(admin.last_login) : null;
        const createdDate = admin.created_at ? new Date(admin.created_at) : null;
        const today = new Date();

        let lastActive = "Today";
        if (lastLoginDate && lastLoginDate.toDateString() !== today.toDateString()) {
          const diffDays = Math.floor((today - lastLoginDate) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) lastActive = "Yesterday";
          else if (diffDays > 1 && diffDays < 7) lastActive = `${diffDays} days ago`;
          else lastActive = lastLoginDate.toLocaleDateString();
        }

        return {
          id: admin.id,
          name: admin.full_name || `${admin.first_name || ""} ${admin.last_name || ""}`.trim(),
          email: admin.email,
          avatar: `avatar-${(index % 8) + 1}.jpg`,
          description: admin.role?.description || "No description",
          role: admin.role?.name
            ? admin.role.name.charAt(0).toUpperCase() + admin.role.name.slice(1)
            : "User",
          department: admin.role?.name ? admin.role.name.charAt(0).toUpperCase() + admin.role.name.slice(1) : "General",
          permissions: admin.permissions || [],
          status: admin.is_active ? "ACTIVE" : "INACTIVE",
          lastActive,
          joined: createdDate
            ? createdDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "-",
        };
      });

      return mappedStaff;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch staff");
    }
  }
);

export const getStaffById = createAsyncThunk(
  "staff/getStaffById",
  async (adminId, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.get(`/admin/admins/${adminId}`);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch staff details");
    }
  }
);

export const getRoles = createAsyncThunk(
  "staff/getRoles",
  async (_, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.get("/admin/roles");
      const apiRoles = response.data || response || [];
      const mappedRoles = Array.isArray(apiRoles)
        ? apiRoles.map((role) => ({
            id: role.id,
            name: role.name || `Role ${role.id}`,
            description: role.description || "",
          }))
        : [];
      return mappedRoles;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch roles");
    }
  }
);

export const createStaff = createAsyncThunk(
  "staff/createStaff",
  async (staff, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.create("/admin/admins", staff);
      const payload = response.data || response;
      if (payload.code && payload.code !== "00") {
        return rejectWithValue(payload.message || "Failed to create staff");
      }
      return payload.data || payload;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create staff");
    }
  }
);

export const updateStaff = createAsyncThunk(
  "staff/updateStaff",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.put(`/admin/admins/${id}`, payload);
      const result = response.data || response;
      if (result.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to update staff");
      }
      return { id, staff: result.data || result };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update staff");
    }
  }
);

export const toggleStaffStatus = createAsyncThunk(
  "staff/toggleStaffStatus",
  async (adminId, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.update(`/admin/admins/${adminId}/toggle-status`);
      const result = response.data || response;
      if (result.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to toggle staff status");
      }
      return adminId;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to toggle staff status");
    }
  }
);

export const createRole = createAsyncThunk(
  "staff/createRole",
  async (role, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.create("/admin/roles", role);
      const result = response.data || response;
      if (result.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to create role");
      }
      return result.data || result;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create role");
    }
  }
);
