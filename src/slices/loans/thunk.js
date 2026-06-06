import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIClient } from "../../helpers/api_helper";

export const createLoanApplication = createAsyncThunk(
  "loans/createLoanApplication",
  async (payload, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.create("https://iereip-api.deducesolutions.com/api/v1/loans", payload);
      const result = response || {};

      if (result?.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to create loan application");
      }

      return result.data || result;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to create loan application");
    }
  }
);

export const getUserLoans = createAsyncThunk(
  "loans/getUserLoans",
  async (user_id, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.get(`https://iereip-api.deducesolutions.com/api/v1/loans/user/${user_id}`);
      const result = response || {};

      if (result?.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to fetch user loans");
      }

      const loans = result.data || [];
      return Array.isArray(loans) ? loans : [];
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch user loans");
    }
  }
);

export const getLoanApplications = createAsyncThunk(
  "loans/getLoanApplications",
  async (_, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.get("https://iereip-api.deducesolutions.com/api/v1/loans");
      const result = response || {};

      if (result?.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to fetch loan applications");
      }

      const loans = result.data || [];
      return Array.isArray(loans) ? loans : [];
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch loan applications");
    }
  }
);

export const getPendingLoanApplications = createAsyncThunk(
  "loans/getPendingLoanApplications",
  async (_, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.get("https://iereip-api.deducesolutions.com/api/v1/loans", { status: "pending_approval" });
      const result = response || {};

      if (result?.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to fetch pending loan applications");
      }

      const loans = result.data || [];
      return Array.isArray(loans) ? loans : [];
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch pending loan applications");
    }
  }
);

export const getApprovedLoanApplications = createAsyncThunk(
  "loans/getApprovedLoanApplications",
  async (_, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.get("https://iereip-api.deducesolutions.com/api/v1/loans", { status: "active" });
      const result = response || {};

      if (result?.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to fetch approved loan applications");
      }

      const loans = result.data || [];
      return Array.isArray(loans) ? loans : [];
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch approved loan applications");
    }
  }
);

export const getRejectedLoanApplications = createAsyncThunk(
  "loans/getRejectedLoanApplications",
  async (_, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.get("https://iereip-api.deducesolutions.com/api/v1/loans", { status: "closed" });
      const result = response || {};

      if (result?.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to fetch rejected loan applications");
      }

      const loans = result.data || [];
      return Array.isArray(loans) ? loans : [];
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch rejected loan applications");
    }
  }
);

export const approveLoanApplication = createAsyncThunk(
  "loans/approveLoanApplication",
  async (loan_id, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.create(`https://iereip-api.deducesolutions.com/api/v1/loans/${loan_id}/approve`, {});
      const result = response || {};

      if (result?.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to approve loan application");
      }

      return result.data || result;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to approve loan application");
    }
  }
);

export const rejectLoanApplication = createAsyncThunk(
  "loans/rejectLoanApplication",
  async ({ loan_id, reason }, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const payload = { status: "rejected" };
      if (reason) payload.reason = reason;
      const response = await api.create(`https://iereip-api.deducesolutions.com/api/v1/loans/${loan_id}/reject`, payload);
      const result = response || {};

      if (result?.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to reject loan application");
      }

      return result.data || result;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to reject loan application");
    }
  }
);

export const getLoanApplicationById = createAsyncThunk(
  "loans/getLoanApplicationById",
  async (loan_id, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.get(`https://iereip-api.deducesolutions.com/api/v1/loans/${loan_id}`);
      const result = response || {};

      if (result?.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to fetch loan application details");
      }

      return result.data || {};
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch loan application details");
    }
  }
);

export const createLoanCollateral = createAsyncThunk(
  "loans/createLoanCollateral",
  async ({ loan_id, formData }, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const config = formData instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined;
      const response = await api.create(`https://iereip-api.deducesolutions.com/api/v1/loans/${loan_id}/collateral`, formData, config);
      const result = response || {};

      if (result?.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to create collateral");
      }

      return result.data || result;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to create collateral");
    }
  }
);

export const createLoanGuarantor = createAsyncThunk(
  "loans/createLoanGuarantor",
  async ({ loan_id, formData }, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      console.log("createLoanGuarantor thunk called for loan_id:", loan_id);
      const config = formData instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined;
      const response = await api.create(
        `https://iereip-api.deducesolutions.com/api/v1/loans/${loan_id}/guarantors`,
        formData,
        config
      );
      const result = response || {};

      if (result?.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to create guarantor");
      }

      return result.data || result;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to create guarantor");
    }
  }
);

export const createLoanDocument = createAsyncThunk(
  "loans/createLoanDocument",
  async ({ loan_id, formData }, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.create(
        `https://iereip-api.deducesolutions.com/api/v1/loans/${loan_id}/documents`,
        formData
      );
      const result = response || {};

      if (result?.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to upload loan documents");
      }

      return result.data || result;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to upload loan documents");
    }
  }
);

export const createLoanRepayment = createAsyncThunk(
  "loans/createLoanRepayment",
  async ({ loan_id, amount, narration }, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const payload = {
        loan_id,
        amount,
        narration,
      };
      const response = await api.create(
        "https://iereip-api.deducesolutions.com/api/v1/loans/repayments",
        payload
      );
      const result = response || {};

      if (result?.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to create repayment");
      }

      return result.data || result;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to create repayment");
    }
  }
);

export const getLoanGuarantors = createAsyncThunk(
  "loans/getLoanGuarantors",
  async (loan_id, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.get(`https://iereip-api.deducesolutions.com/api/v1/loans/${loan_id}/guarantors`);
      const result = response || {};

      if (result?.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to fetch guarantors");
      }

      const guarantors = result.data || [];
      return Array.isArray(guarantors) ? guarantors : [];
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch guarantors");
    }
  }
);

export const getLoanAuditLogs = createAsyncThunk(
  "loans/getLoanAuditLogs",
  async (loan_id, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.get(`https://iereip-api.deducesolutions.com/api/v1/loans/${loan_id}/logs`);
      const result = response || {};

      if (result?.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to fetch loan audit logs");
      }

      const logs = result.data || [];
      return Array.isArray(logs) ? logs : [];
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch loan audit logs");
    }
  }
);

export const getActiveLoanRepayments = createAsyncThunk(
  "loans/getActiveLoanRepayments",
  async (_, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.get("https://iereip-api.deducesolutions.com/api/v1/loans?status=active");
      const result = response || {};

      if (result?.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to fetch active loans");
      }

      const loans = result.data || [];
      return Array.isArray(loans) ? loans : [];
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch active loans");
    }
  }
);

export const getOverdueLoanApplications = createAsyncThunk(
  "loans/getOverdueLoanApplications",
  async (_, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const response = await api.get("https://iereip-api.deducesolutions.com/api/v1/loans", { status: "overdue" });
      const result = response || {};

      if (result?.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to fetch overdue loan applications");
      }

      const loans = result.data || [];
      return Array.isArray(loans) ? loans : [];
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch overdue loan applications");
    }
  }
);

export const createLoanPenalty = createAsyncThunk(
  "loans/createLoanPenalty",
  async ({ loan_id, penalty_type, narration, manual_amount }, { rejectWithValue }) => {
    try {
      const api = new APIClient();
      const payload = {
        loan_id,
        penalty_type,
        narration,
        manual_amount: manual_amount || 0,
      };
      const response = await api.create(
        "https://iereip-api.deducesolutions.com/api/v1/loans/penalties",
        payload
      );
      const result = response || {};

      if (result?.code && result.code !== "00") {
        return rejectWithValue(result.message || "Failed to create penalty");
      }

      return result.data || result;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to create penalty");
    }
  }
);
