import React from "react";
import { Navigate } from "react-router-dom";

//Dashboard

import DashboardProject from "../pages/DashboardProject";



//AuthenticationInner pages
import BasicSignIn from '../pages/AuthenticationInner/Login/BasicSignIn';
import CoverSignIn from '../pages/AuthenticationInner/Login/CoverSignIn';
import BasicSignUp from '../pages/AuthenticationInner/Register/BasicSignUp';
import CoverSignUp from "../pages/AuthenticationInner/Register/CoverSignUp";
import BasicPasswReset from '../pages/AuthenticationInner/PasswordReset/BasicPasswReset';
//pages


import CoverPasswReset from '../pages/AuthenticationInner/PasswordReset/CoverPasswReset';
import BasicLockScreen from '../pages/AuthenticationInner/LockScreen/BasicLockScr';
import CoverLockScreen from '../pages/AuthenticationInner/LockScreen/CoverLockScr';
import BasicLogout from '../pages/AuthenticationInner/Logout/BasicLogout';
import CoverLogout from '../pages/AuthenticationInner/Logout/CoverLogout';
import BasicSuccessMsg from '../pages/AuthenticationInner/SuccessMessage/BasicSuccessMsg';
import CoverSuccessMsg from '../pages/AuthenticationInner/SuccessMessage/CoverSuccessMsg';
import BasicTwosVerify from '../pages/AuthenticationInner/TwoStepVerification/BasicTwosVerify';
import CoverTwosVerify from '../pages/AuthenticationInner/TwoStepVerification/CoverTwosVerify';
import Basic404 from '../pages/AuthenticationInner/Errors/Basic404';
import Cover404 from '../pages/AuthenticationInner/Errors/Cover404';
import Alt404 from '../pages/AuthenticationInner/Errors/Alt404';
import Error500 from '../pages/AuthenticationInner/Errors/Error500';

import BasicPasswCreate from "../pages/AuthenticationInner/PasswordCreate/BasicPasswCreate";
import CoverPasswCreate from "../pages/AuthenticationInner/PasswordCreate/CoverPasswCreate";
import Offlinepage from "../pages/AuthenticationInner/Errors/Offlinepage";

//login
import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";



// Landing Index
// import OnePage from "../pages/Landing/OnePage";



// User Profile
import UserProfile from "../pages/Authentication/user-profile";
import AdminProfile from "../pages/Authentication/AdminProfile";

// Staff Management
import AllStaff from "../pages/StaffManagement/AllStaff";
import AllPermissions from "../pages/StaffManagement/AllPermissions";
import SystemAccounts from "../pages/Landing/OnePage/SystemAccounts";
import SavingsAccount from "../pages/Landing/OnePage/SavingsAccount";
import ListTransactions from "../pages/Landing/OnePage/ListTransactions";
import ListRepayments from "../pages/Loans/ListRepayments";
import ActiveLoans from "../pages/Loans/ActiveLoans";
import OverdueLoans from "../pages/Loans/OverdueLoans";
import ListUsers from "../pages/Users/ListUsers";
import CreateUser from "../pages/Users/CreateUser";
import ViewUser from "../pages/Users/ViewUser";
import EditUser from "../pages/Users/EditUser";
import SendSMS from "../pages/SMS/SendSMS";
import Broadcast from "../pages/SMS/Broadcast";
import SMSLogs from "../pages/SMS/SMSLogs";

import LoanApplicationList from "../pages/Loans/LoanApplicationList";
import LoanApplicationView from "../pages/Loans/LoanApplicationView";
import LoanApplications from "../pages/Loans/LoanApplications";
import PendingApplications from "../pages/Loans/PendingApplications";
import LoanUserLoans from "../pages/Loans/LoanUserLoans";
import LoanApplicationDetails from "../pages/Loans/LoanApplicationDetails";
import ApprovedApplications from "../pages/Loans/ApprovedApplications";
import RejectedApplications from "../pages/Loans/RejectedApplications";
import LoanAuditLogs from "../pages/Loans/LoanAuditLogs";

import ViewSavingsAccount from "../pages/Landing/OnePage/ViewSavingsAccount";
import SavingsAccountStatement from "../pages/Landing/OnePage/SavingsAccountStatement";







//APi Key
// import APIKey from "../pages/APIKey/index";
import ListBranches from "../pages/Branches/ListBranches";
import Configurations from "../pages/Configurations/Configurations";
import AuditLogs from "../pages/AuditLogs/AuditLogs";

const authProtectedRoutes = [


  { path: "/dashboard", component: <DashboardProject /> },

  // { path: "/apps-calendar", component: <Calendar /> },
  // { path: "/apps-calendar-month-grid", component: <MonthGrid /> },


  // { path: "/apps-file-manager", component: <FileManager /> },
  // { path: "/apps-todo", component: <ToDoList /> },


  { path: "/loan/approved", component: <ApprovedApplications /> },
  { path: "/loan/rejected", component: <RejectedApplications /> },



  // Staff Management
  { path: "/all-staff", component: <AllStaff /> },
  { path: "/all-permissions", component: <AllPermissions /> },
  { path: "/users-list", component: <ListUsers /> },
  { path: "/users-create", component: <CreateUser /> },
  { path: "/users-view/:id", component: <ViewUser /> },
  { path: "/sms/send", component: <SendSMS /> },
  { path: "/sms/broadcast", component: <Broadcast /> },
  { path: "/sms/logs", component: <SMSLogs /> },
  { path: "/users-edit/:id", component: <EditUser /> },
  { path: "/list-system-account", component: <SystemAccounts /> },
  { path: "/savings-account", component: <SavingsAccount /> },
  { path: "/savings-account/view/:id", component: <ViewSavingsAccount /> },
  { path: "/savings-account-statement", component: <SavingsAccountStatement /> },
  { path: "/list-transactions", component: <ListTransactions /> },
  { path: "/list-repayments", component: <ListRepayments /> },
  { path: "/active-loans", component: <ActiveLoans /> },
  { path: "/overdue-loans", component: <OverdueLoans /> },

  // Loan Application
  { path: "/loan/applications", component: <LoanApplications /> },
  { path: "/loan/pending-applications", component: <PendingApplications /> },
  { path: "/loan/user-loans/:id", component: <LoanUserLoans /> },
  { path: "/loan/audit-logs/:loanId", component: <LoanAuditLogs /> },
  { path: "/loan/application-details/:id", component: <LoanApplicationDetails /> },
  { path: "/loan/new-application", component: <LoanApplicationList /> },
  { path: "/loan/new-application/:id", component: <LoanApplicationView /> },

  // Branch Management
  { path: "/all-branches", component: <ListBranches /> },


  // Configurations
  { path: "/configurations", component: <Configurations /> },

  // Audit Logs
  { path: "/audit-logs", component: <AuditLogs /> },

  //User Profile
  { path: "/profile", component: <UserProfile /> },
  { path: "/admin-profile", component: <AdminProfile /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  { path: "*", component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <CoverSignIn /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/register", component: <Register /> },

  //AuthenticationInner pages
  // { path: "/auth-signin-basic", component: <BasicSignIn /> },
  // { path: "/auth-signin-cover", component: <CoverSignIn /> },
  // { path: "/auth-signup-basic", component: <BasicSignUp /> },
  // { path: "/auth-signup-cover", component: <CoverSignUp /> },
  // { path: "/auth-pass-reset-basic", component: <BasicPasswReset /> },
  // { path: "/auth-pass-reset-cover", component: <CoverPasswReset /> },
  // { path: "/auth-lockscreen-basic", component: <BasicLockScreen /> },
  // { path: "/auth-lockscreen-cover", component: <CoverLockScreen /> },
  { path: "/auth-logout-basic", component: <BasicLogout /> },
  // { path: "/auth-logout-cover", component: <CoverLogout /> },
  // { path: "/auth-success-msg-basic", component: <BasicSuccessMsg /> },
  // { path: "/auth-success-msg-cover", component: <CoverSuccessMsg /> },
  // { path: "/auth-twostep-basic", component: <BasicTwosVerify /> },
  // { path: "/auth-twostep-cover", component: <CoverTwosVerify /> },
  // { path: "/auth-404-basic", component: <Basic404 /> },
  // { path: "/auth-404-cover", component: <Cover404 /> },
  // { path: "/auth-404-alt", component: <Alt404 /> },
  // { path: "/auth-500", component: <Error500 /> },
  // { path: "/pages-maintenance", component: <Maintenance /> },
  // { path: "/pages-coming-soon", component: <ComingSoon /> },

  // { path: "/landing", component: <OnePage /> },
  // { path: "/nft-landing", component: <NFTLanding /> },
  // { path: "/jobs-landing", component: <JobsLanding /> },

  // { path: "/auth-pass-change-basic", component: <BasicPasswCreate /> },
  // { path: "/auth-pass-change-cover", component: <CoverPasswCreate /> },
  // { path: "/auth-offline", component: <Offlinepage /> },

];

export { authProtectedRoutes, publicRoutes };