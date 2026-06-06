import { createSlice } from "@reduxjs/toolkit";
import {
  createLoanApplication,
  getLoanApplications,
  getUserLoans,
  getLoanApplicationById,
  getPendingLoanApplications,
  getApprovedLoanApplications,
  getRejectedLoanApplications,
  approveLoanApplication,
  rejectLoanApplication,
  createLoanGuarantor,
  createLoanCollateral,
  createLoanDocument,
  createLoanRepayment,
  createLoanPenalty,
  getLoanGuarantors,
  getLoanAuditLogs,
  getActiveLoanRepayments,
  getOverdueLoanApplications,
} from "./thunk";

const initialState = {
  loans: [],
  loading: false,
  error: null,
  pendingLoans: [],
  pendingLoansLoading: false,
  pendingLoansError: null,
  approvedLoans: [],
  approvedLoansLoading: false,
  approvedLoansError: null,
  rejectedLoans: [],
  rejectedLoansLoading: false,
  rejectedLoansError: null,
  overdueLoans: [],
  overdueLoanLoading: false,
  overdueLoanError: null,
  userLoans: [],
  userLoansLoading: false,
  userLoansError: null,
  selectedLoan: null,
  selectedLoanLoading: false,
  selectedLoanError: null,
  createLoan: {
    loading: false,
    error: null,
    success: false,
  },
  guarantors: [],
  guarantorsLoading: false,
  guarantorsError: null,
  createGuarantor: {
    loading: false,
    error: null,
    success: false,
  },
  createCollateral: {
    loading: false,
    error: null,
    success: false,
  },
  createDocument: {
    loading: false,
    error: null,
    success: false,
  },
  createRepayment: {
    loading: false,
    error: null,
    success: false,
  },
  loanAuditLogs: [],
  loanAuditLogsLoading: false,
  loanAuditLogsError: null,
  activeLoanRepayments: [],
  activeLoanRepaymentsLoading: false,
  activeLoanRepaymentsError: null,
};

const loansSlice = createSlice({
  name: "Loans",
  initialState,
  reducers: {
    resetCreateLoanStatus: (state) => {
      state.createLoan = {
        loading: false,
        error: null,
        success: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createLoanApplication.pending, (state) => {
        state.createLoan.loading = true;
        state.createLoan.error = null;
        state.createLoan.success = false;
      })
      .addCase(createLoanApplication.fulfilled, (state, action) => {
        state.createLoan.loading = false;
        state.createLoan.success = true;
        state.loans.push(action.payload);
      })
      .addCase(createLoanApplication.rejected, (state, action) => {
        state.createLoan.loading = false;
        state.createLoan.error = action.payload || action.error?.message;
        state.createLoan.success = false;
      })
      .addCase(getLoanApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLoanApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.loans = action.payload;
      })
      .addCase(getLoanApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      })
      .addCase(getPendingLoanApplications.pending, (state) => {
        state.pendingLoansLoading = true;
        state.pendingLoansError = null;
      })
      .addCase(getPendingLoanApplications.fulfilled, (state, action) => {
        state.pendingLoansLoading = false;
        state.pendingLoans = action.payload;
      })
      .addCase(getPendingLoanApplications.rejected, (state, action) => {
        state.pendingLoansLoading = false;
        state.pendingLoansError = action.payload || action.error?.message;
      })
      .addCase(getApprovedLoanApplications.pending, (state) => {
        state.approvedLoansLoading = true;
        state.approvedLoansError = null;
      })
      .addCase(getApprovedLoanApplications.fulfilled, (state, action) => {
        state.approvedLoansLoading = false;
        state.approvedLoans = action.payload;
      })
      .addCase(getApprovedLoanApplications.rejected, (state, action) => {
        state.approvedLoansLoading = false;
        state.approvedLoansError = action.payload || action.error?.message;
      })
      .addCase(getRejectedLoanApplications.pending, (state) => {
        state.rejectedLoansLoading = true;
        state.rejectedLoansError = null;
      })
      .addCase(getRejectedLoanApplications.fulfilled, (state, action) => {
        state.rejectedLoansLoading = false;
        state.rejectedLoans = action.payload;
      })
      .addCase(getRejectedLoanApplications.rejected, (state, action) => {
        state.rejectedLoansLoading = false;
        state.rejectedLoansError = action.payload || action.error?.message;
      })
      .addCase(getOverdueLoanApplications.pending, (state) => {
        state.overdueLoanLoading = true;
        state.overdueLoanError = null;
      })
      .addCase(getOverdueLoanApplications.fulfilled, (state, action) => {
        state.overdueLoanLoading = false;
        state.overdueLoans = action.payload;
      })
      .addCase(getOverdueLoanApplications.rejected, (state, action) => {
        state.overdueLoanLoading = false;
        state.overdueLoanError = action.payload || action.error?.message;
      })
      .addCase(approveLoanApplication.pending, (state) => {
        // UI triggers refresh; nothing to set here
      })
      .addCase(approveLoanApplication.fulfilled, (state, action) => {
        const updated = action.payload || {};
        // attempt to remove updated loan from pending list
        state.pendingLoans = state.pendingLoans.filter((l) => {
          return !(l.loan_id && updated.loan_id && l.loan_id === updated.loan_id) && !(l.id && updated.id && l.id === updated.id);
        });
      })
      .addCase(approveLoanApplication.rejected, (state, action) => {
        // no-op
      })
      .addCase(rejectLoanApplication.pending, (state) => {
        // no-op
      })
      .addCase(rejectLoanApplication.fulfilled, (state, action) => {
        const updated = action.payload || {};
        state.pendingLoans = state.pendingLoans.filter((l) => {
          return !(l.loan_id && updated.loan_id && l.loan_id === updated.loan_id) && !(l.id && updated.id && l.id === updated.id);
        });
      })
      .addCase(rejectLoanApplication.rejected, (state, action) => {
        // no-op
      })
      .addCase(getUserLoans.pending, (state) => {
        state.userLoansLoading = true;
        state.userLoansError = null;
      })
      .addCase(getUserLoans.fulfilled, (state, action) => {
        state.userLoansLoading = false;
        state.userLoans = action.payload;
      })
      .addCase(getUserLoans.rejected, (state, action) => {
        state.userLoansLoading = false;
        state.userLoansError = action.payload || action.error?.message;
      })
      .addCase(getLoanApplicationById.pending, (state) => {
        state.selectedLoanLoading = true;
        state.selectedLoanError = null;
      })
      .addCase(getLoanApplicationById.fulfilled, (state, action) => {
        state.selectedLoanLoading = false;
        state.selectedLoan = action.payload;
      })
      .addCase(getLoanApplicationById.rejected, (state, action) => {
        state.selectedLoanLoading = false;
        state.selectedLoanError = action.payload || action.error?.message;
      })
      .addCase(createLoanGuarantor.pending, (state) => {
        if (!state.createGuarantor) {
          state.createGuarantor = {
            loading: false,
            error: null,
            success: false,
          };
        }
        state.createGuarantor.loading = true;
        state.createGuarantor.error = null;
        state.createGuarantor.success = false;
      })
      .addCase(createLoanGuarantor.fulfilled, (state, action) => {
        if (!state.createGuarantor) {
          state.createGuarantor = {
            loading: false,
            error: null,
            success: false,
          };
        }
        state.createGuarantor.loading = false;
        state.createGuarantor.success = true;
        // Refresh guarantors list
        if (state.selectedLoan && state.selectedLoan.guarantors) {
          if (!Array.isArray(state.selectedLoan.guarantors)) {
            state.selectedLoan.guarantors = [state.selectedLoan.guarantors];
          }
          state.selectedLoan.guarantors.push(action.payload);
        }
      })
      .addCase(createLoanGuarantor.rejected, (state, action) => {
        if (!state.createGuarantor) {
          state.createGuarantor = {
            loading: false,
            error: null,
            success: false,
          };
        }
        state.createGuarantor.loading = false;
        state.createGuarantor.error = action.payload || action.error?.message;
        state.createGuarantor.success = false;
      })
      .addCase(createLoanCollateral.pending, (state) => {
        if (!state.createCollateral) {
          state.createCollateral = {
            loading: false,
            error: null,
            success: false,
          };
        }
        state.createCollateral.loading = true;
        state.createCollateral.error = null;
        state.createCollateral.success = false;
      })
      .addCase(createLoanCollateral.fulfilled, (state, action) => {
        if (!state.createCollateral) {
          state.createCollateral = {
            loading: false,
            error: null,
            success: false,
          };
        }
        state.createCollateral.loading = false;
        state.createCollateral.success = true;
        // Refresh collateral list
        if (state.selectedLoan && state.selectedLoan.collateral) {
          if (!Array.isArray(state.selectedLoan.collateral)) {
            state.selectedLoan.collateral = [state.selectedLoan.collateral];
          }
          state.selectedLoan.collateral.push(action.payload);
        }
      })
      .addCase(createLoanCollateral.rejected, (state, action) => {
        if (!state.createCollateral) {
          state.createCollateral = {
            loading: false,
            error: null,
            success: false,
          };
        }
        state.createCollateral.loading = false;
        state.createCollateral.error = action.payload || action.error?.message;
        state.createCollateral.success = false;
      })
      .addCase(createLoanDocument.pending, (state) => {
        if (!state.createDocument) {
          state.createDocument = {
            loading: false,
            error: null,
            success: false,
          };
        }
        state.createDocument.loading = true;
        state.createDocument.error = null;
        state.createDocument.success = false;
      })
      .addCase(createLoanDocument.fulfilled, (state, action) => {
        if (!state.createDocument) {
          state.createDocument = {
            loading: false,
            error: null,
            success: false,
          };
        }
        state.createDocument.loading = false;
        state.createDocument.success = true;
        if (state.selectedLoan) {
          if (!Array.isArray(state.selectedLoan.documents)) {
            state.selectedLoan.documents = state.selectedLoan.documents ? [state.selectedLoan.documents] : [];
          }
          state.selectedLoan.documents.push(action.payload);
        }
      })
      .addCase(createLoanDocument.rejected, (state, action) => {
        if (!state.createDocument) {
          state.createDocument = {
            loading: false,
            error: null,
            success: false,
          };
        }
        state.createDocument.loading = false;
        state.createDocument.error = action.payload || action.error?.message;
        state.createDocument.success = false;
      })
      .addCase(createLoanRepayment.pending, (state) => {
        if (!state.createRepayment) {
          state.createRepayment = {
            loading: false,
            error: null,
            success: false,
          };
        }
        state.createRepayment.loading = true;
        state.createRepayment.error = null;
        state.createRepayment.success = false;
      })
      .addCase(createLoanRepayment.fulfilled, (state, action) => {
        if (!state.createRepayment) {
          state.createRepayment = {
            loading: false,
            error: null,
            success: false,
          };
        }
        state.createRepayment.loading = false;
        state.createRepayment.success = true;
        if (state.selectedLoan) {
          if (!Array.isArray(state.selectedLoan.repayments)) {
            state.selectedLoan.repayments = state.selectedLoan.repayments ? [state.selectedLoan.repayments] : [];
          }
          state.selectedLoan.repayments.unshift(action.payload);
        }
      })
      .addCase(createLoanRepayment.rejected, (state, action) => {
        if (!state.createRepayment) {
          state.createRepayment = {
            loading: false,
            error: null,
            success: false,
          };
        }
        state.createRepayment.loading = false;
        state.createRepayment.error = action.payload || action.error?.message;
        state.createRepayment.success = false;
      })
      .addCase(createLoanPenalty.pending, (state) => {
        if (!state.createPenalty) {
          state.createPenalty = {
            loading: false,
            error: null,
            success: false,
          };
        }
        state.createPenalty.loading = true;
        state.createPenalty.error = null;
        state.createPenalty.success = false;
      })
      .addCase(createLoanPenalty.fulfilled, (state, action) => {
        if (!state.createPenalty) {
          state.createPenalty = {
            loading: false,
            error: null,
            success: false,
          };
        }
        state.createPenalty.loading = false;
        state.createPenalty.success = true;
      })
      .addCase(createLoanPenalty.rejected, (state, action) => {
        if (!state.createPenalty) {
          state.createPenalty = {
            loading: false,
            error: null,
            success: false,
          };
        }
        state.createPenalty.loading = false;
        state.createPenalty.error = action.payload || action.error?.message;
        state.createPenalty.success = false;
      })
      .addCase(getLoanGuarantors.pending, (state) => {
        state.guarantorsLoading = true;
        state.guarantorsError = null;
      })
      .addCase(getLoanGuarantors.fulfilled, (state, action) => {
        state.guarantorsLoading = false;
        state.guarantors = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getLoanGuarantors.rejected, (state, action) => {
        state.guarantorsLoading = false;
        state.guarantorsError = action.payload || action.error?.message;
      })
      .addCase(getLoanAuditLogs.pending, (state) => {
        state.loanAuditLogsLoading = true;
        state.loanAuditLogsError = null;
      })
      .addCase(getLoanAuditLogs.fulfilled, (state, action) => {
        state.loanAuditLogsLoading = false;
        state.loanAuditLogs = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getLoanAuditLogs.rejected, (state, action) => {
        state.loanAuditLogsLoading = false;
        state.loanAuditLogsError = action.payload || action.error?.message;
      })
      .addCase(getActiveLoanRepayments.pending, (state) => {
        state.activeLoanRepaymentsLoading = true;
        state.activeLoanRepaymentsError = null;
      })
      .addCase(getActiveLoanRepayments.fulfilled, (state, action) => {
        state.activeLoanRepaymentsLoading = false;
        state.activeLoanRepayments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getActiveLoanRepayments.rejected, (state, action) => {
        state.activeLoanRepaymentsLoading = false;
        state.activeLoanRepaymentsError = action.payload || action.error?.message;
      });
  },
});

export const { resetCreateLoanStatus } = loansSlice.actions;
export default loansSlice.reducer;
