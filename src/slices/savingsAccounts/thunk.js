import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIClient } from "../../helpers/api_helper";

export const getSystemAccounts = createAsyncThunk(
  "savingsAccounts/getSystemAccounts",
  async (_, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.get("/savings/system-accounts");
      const accounts = response?.data || [];
      return Array.isArray(accounts) ? accounts : [];
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch system accounts");
    }
  }
);

export const getUserSavingsAccounts = createAsyncThunk(
  "savingsAccounts/getUserSavingsAccounts",
  async (userId, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.get(`/savings/accounts/user/${userId}`);
      const result = response || {};

      if (result?.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to fetch savings accounts");
      }

      return result.data || [];
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch savings accounts");
    }
  }
);

export const createSystemAccount = createAsyncThunk(
  "savingsAccounts/createSystemAccount",
  async (payload, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.create("/savings/system-accounts", payload);
      const account = response?.data;
      return account || null;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create system account");
    }
  }
);

export const contributeSavings = createAsyncThunk(
  "savingsAccounts/contributeSavings",
  async (payload, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.create("/savings/contribute", payload);
      const result = response || {};

      if (result?.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to contribute savings");
      }

      return result.data || result;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to contribute savings");
    }
  }
);

export const withdrawSavings = createAsyncThunk(
  "savingsAccounts/withdrawSavings",
  async (payload, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.create("/savings/withdraw", payload);
      const result = response || {};

      if (result?.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to withdraw savings");
      }

      return result.data || result;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to withdraw savings");
    }
  }
);

export const earlyWithdrawSavings = createAsyncThunk(
  "savingsAccounts/earlyWithdrawSavings",
  async (payload, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.create("/savings/early-withdraw", payload);
      const result = response || {};

      if (result?.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to early withdraw savings");
      }

      return result.data || result;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to early withdraw savings");
    }
  }
);

export const getSavingsStatement = createAsyncThunk(
  "savingsAccounts/getSavingsStatement",
  async (payload, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.create("/savings/statement", payload);
      const result = response || {};

      if (result?.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to fetch statement");
      }

      return result.data || result;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch statement");
    }
  }
);

export const createUserSavingsAccount = createAsyncThunk(
  "savingsAccounts/createUserSavingsAccount",
  async (payload, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.create("/savings/accounts", payload);
      const result = response || {};

      if (result?.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to create savings account");
      }

      return result.data || result;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to create savings account");
    }
  }
);

export const issueBooklet = createAsyncThunk(
  "savingsAccounts/issueBooklet",
  async (payload, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.create("/savings/booklet", payload);
      const result = response || {};

      if (result?.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to issue booklet");
      }

      return result.data || result;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to issue booklet");
    }
  }
);

export const getTransactions = createAsyncThunk(
  "savingsAccounts/getTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.get("/savings/transactions");
      const result = response || {};

      if (result?.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to fetch transactions");
      }

      return result.data || [];
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch transactions");
    }
  }
);

export const getTransactionById = createAsyncThunk(
  "savingsAccounts/getTransactionById",
  async (transactionId, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.get(`/savings/transactions/${transactionId}`);
      const result = response || {};

      if (result?.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to fetch transaction details");
      }

      return result.data || null;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch transaction details");
    }
  }
);
