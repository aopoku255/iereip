import { createSlice } from "@reduxjs/toolkit";
import { getSystemAccounts, getUserSavingsAccounts, createSystemAccount, createUserSavingsAccount, issueBooklet, contributeSavings, withdrawSavings, earlyWithdrawSavings, getSavingsStatement, getTransactions, getTransactionById } from "./thunk";

const initialState = {
  accounts: [],
  userSavingsAccounts: [],
  loading: false,
  error: null,
  userSavingsLoading: false,
  userSavingsError: null,
  createLoading: false,
  createError: null,
  createSuccess: false,
  contributeLoading: false,
  contributeError: null,
  contributeSuccess: false,
  withdrawLoading: false,
  withdrawError: null,
  withdrawSuccess: false,
  earlyWithdrawLoading: false,
  earlyWithdrawError: null,
  earlyWithdrawSuccess: false,
  statementLoading: false,
  statementError: null,
  statementData: null,
  transactionsLoading: false,
  transactionsError: null,
  transactions: [],
  transactionDetailsLoading: false,
  transactionDetailsError: null,
  transactionDetails: null,
  createUserAccount: {
    loading: false,
    error: null,
    success: false,
  },
  issueBooklet: {
    loading: false,
    error: null,
    success: false,
  },
};

const savingsAccountsSlice = createSlice({
  name: "savingsAccounts",
  initialState,
  reducers: {
    resetCreateUserAccountStatus: (state) => {
      state.createUserAccount = {
        loading: false,
        error: null,
        success: false,
      };
    },
    resetIssueBookletStatus: (state) => {
      state.issueBooklet = {
        loading: false,
        error: null,
        success: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSystemAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSystemAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload;
      })
      .addCase(getSystemAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Failed to fetch system accounts";
      })
      .addCase(getUserSavingsAccounts.pending, (state) => {
        state.userSavingsLoading = true;
        state.userSavingsError = null;
      })
      .addCase(getUserSavingsAccounts.fulfilled, (state, action) => {
        state.userSavingsLoading = false;
        state.userSavingsAccounts = action.payload;
      })
      .addCase(getUserSavingsAccounts.rejected, (state, action) => {
        state.userSavingsLoading = false;
        state.userSavingsError = action.payload || action.error?.message || "Failed to fetch savings accounts";
      })
      .addCase(createSystemAccount.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createSuccess = false;
      })
      .addCase(createSystemAccount.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createSuccess = true;
        if (action.payload) {
          state.accounts = [action.payload, ...state.accounts];
        }
      })
      .addCase(createSystemAccount.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload || action.error?.message || "Failed to create system account";
        state.createSuccess = false;
      })
      .addCase(createUserSavingsAccount.pending, (state) => {
        state.createUserAccount = state.createUserAccount || {
          loading: false,
          error: null,
          success: false,
        };
        state.createUserAccount.loading = true;
        state.createUserAccount.error = null;
        state.createUserAccount.success = false;
      })
      .addCase(createUserSavingsAccount.fulfilled, (state, action) => {
        state.createUserAccount = state.createUserAccount || {
          loading: false,
          error: null,
          success: false,
        };
        state.createUserAccount.loading = false;
        state.createUserAccount.success = true;
      })
      .addCase(createUserSavingsAccount.rejected, (state, action) => {
        state.createUserAccount = state.createUserAccount || {
          loading: false,
          error: null,
          success: false,
        };
        state.createUserAccount.loading = false;
        state.createUserAccount.error = action.payload || action.error?.message;
        state.createUserAccount.success = false;
      })
      .addCase(issueBooklet.pending, (state) => {
        state.issueBooklet = state.issueBooklet || {
          loading: false,
          error: null,
          success: false,
        };
        state.issueBooklet.loading = true;
        state.issueBooklet.error = null;
        state.issueBooklet.success = false;
      })
      .addCase(issueBooklet.fulfilled, (state, action) => {
        state.issueBooklet = state.issueBooklet || {
          loading: false,
          error: null,
          success: false,
        };
        state.issueBooklet.loading = false;
        state.issueBooklet.success = true;
      })
      .addCase(issueBooklet.rejected, (state, action) => {
        state.issueBooklet = state.issueBooklet || {
          loading: false,
          error: null,
          success: false,
        };
        state.issueBooklet.loading = false;
        state.issueBooklet.error = action.payload || action.error?.message;
        state.issueBooklet.success = false;
      })
      .addCase(contributeSavings.pending, (state) => {
        state.contributeLoading = true;
        state.contributeError = null;
        state.contributeSuccess = false;
      })
      .addCase(contributeSavings.fulfilled, (state, action) => {
        state.contributeLoading = false;
        state.contributeSuccess = true;
        state.contributeError = null;
      })
      .addCase(contributeSavings.rejected, (state, action) => {
        state.contributeLoading = false;
        state.contributeSuccess = false;
        state.contributeError = action.payload || action.error?.message || "Failed to contribute";
      })
      .addCase(withdrawSavings.pending, (state) => {
        state.withdrawLoading = true;
        state.withdrawError = null;
        state.withdrawSuccess = false;
      })
      .addCase(withdrawSavings.fulfilled, (state, action) => {
        state.withdrawLoading = false;
        state.withdrawSuccess = true;
        state.withdrawError = null;
      })
      .addCase(withdrawSavings.rejected, (state, action) => {
        state.withdrawLoading = false;
        state.withdrawSuccess = false;
        state.withdrawError = action.payload || action.error?.message || "Failed to withdraw";
      })
      .addCase(earlyWithdrawSavings.pending, (state) => {
        state.earlyWithdrawLoading = true;
        state.earlyWithdrawError = null;
        state.earlyWithdrawSuccess = false;
      })
      .addCase(earlyWithdrawSavings.fulfilled, (state, action) => {
        state.earlyWithdrawLoading = false;
        state.earlyWithdrawSuccess = true;
        state.earlyWithdrawError = null;
      })
      .addCase(earlyWithdrawSavings.rejected, (state, action) => {
        state.earlyWithdrawLoading = false;
        state.earlyWithdrawSuccess = false;
        state.earlyWithdrawError = action.payload || action.error?.message || "Failed to early withdraw";
      })
      .addCase(getSavingsStatement.pending, (state) => {
        state.statementLoading = true;
        state.statementError = null;
        state.statementData = null;
      })
      .addCase(getSavingsStatement.fulfilled, (state, action) => {
        state.statementLoading = false;
        state.statementData = action.payload;
        state.statementError = null;
      })
      .addCase(getSavingsStatement.rejected, (state, action) => {
        state.statementLoading = false;
        state.statementError = action.payload || action.error?.message || "Failed to fetch statement";
        state.statementData = null;
      })
      .addCase(getTransactions.pending, (state) => {
        state.transactionsLoading = true;
        state.transactionsError = null;
        state.transactions = [];
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.transactionsLoading = false;
        state.transactions = action.payload;
        state.transactionsError = null;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.transactionsLoading = false;
        state.transactionsError = action.payload || action.error?.message || "Failed to fetch transactions";
        state.transactions = [];
      })
      .addCase(getTransactionById.pending, (state) => {
        state.transactionDetailsLoading = true;
        state.transactionDetailsError = null;
        state.transactionDetails = null;
      })
      .addCase(getTransactionById.fulfilled, (state, action) => {
        state.transactionDetailsLoading = false;
        state.transactionDetails = action.payload;
        state.transactionDetailsError = null;
      })
      .addCase(getTransactionById.rejected, (state, action) => {
        state.transactionDetailsLoading = false;
        state.transactionDetailsError = action.payload || action.error?.message || "Failed to fetch transaction details";
        state.transactionDetails = null;
      });
  },
});

export const { resetCreateUserAccountStatus, resetIssueBookletStatus } = savingsAccountsSlice.actions;
export default savingsAccountsSlice.reducer;
