import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//Import Icons
import FeatherIcon from "feather-icons-react";

const Navdata = () => {
  const history = useNavigate();
  //state data
  const [isDashboard, setIsDashboard] = useState(false);
  const [isApps, setIsApps] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [isPages, setIsPages] = useState(false);
  const [isBaseUi, setIsBaseUi] = useState(false);
  const [isAdvanceUi, setIsAdvanceUi] = useState(false);
  const [isForms, setIsForms] = useState(false);
  const [isTables, setIsTables] = useState(false);
  const [isCharts, setIsCharts] = useState(false);
  const [isIcons, setIsIcons] = useState(false);
  const [isMaps, setIsMaps] = useState(false);
  const [isMultiLevel, setIsMultiLevel] = useState(false);

  // Staff Management
  const [isStaffManagement, setIsStaffManagement] = useState(false);
  const [isRoles, setIsRoles] = useState(false);
  const [isPermissions, setIsPermissions] = useState(false);

  // Users Management
  const [isUsersManagement, setIsUsersManagement] = useState(false);

  // SMS
  const [isSMS, setIsSMS] = useState(false);

  // Configurations
  const [isConfigurations, setIsConfigurations] = useState(false);

  // Audit Logs
  const [isAuditLogs, setIsAuditLogs] = useState(false);

  //Calender
  const [isCalender, setCalender] = useState(false);

  // Apps
  const [isEmail, setEmail] = useState(false);
  const [isSubEmail, setSubEmail] = useState(false);
  const [isEcommerce, setIsEcommerce] = useState(false);
  const [isProjects, setIsProjects] = useState(false);
  const [isTasks, setIsTasks] = useState(false);
  const [isCRM, setIsCRM] = useState(false);
  const [isCrypto, setIsCrypto] = useState(false);
  const [isInvoices, setIsInvoices] = useState(false);
  const [isSupportTickets, setIsSupportTickets] = useState(false);
  const [isNFTMarketplace, setIsNFTMarketplace] = useState(false);

  const [isJobs, setIsJobs] = useState(false);
  const [isJobList, setIsJobList] = useState(false);
  const [isCandidateList, setIsCandidateList] = useState(false);

  // Authentication
  const [isSignIn, setIsSignIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [isPasswordCreate, setIsPasswordCreate] = useState(false);
  const [isLockScreen, setIsLockScreen] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);
  const [isVerification, setIsVerification] = useState(false);
  const [isError, setIsError] = useState(false);

  // Pages
  const [isProfile, setIsProfile] = useState(false);
  const [isLanding, setIsLanding] = useState(false);
  const [isTransactions, setIsTransactions] = useState(false);
  const [isRepayments, setIsRepayments] = useState(false);
  const [isActiveLoansSub, setIsActiveLoansSub] = useState(false);
  const [isOverdueLoansSub, setIsOverdueLoansSub] = useState(false);
  const [isLoanApplication, setIsLoanApplication] = useState(false);

  // Charts
  const [isApex, setIsApex] = useState(false);

  // Multi Level
  const [isLevel1, setIsLevel1] = useState(false);
  const [isLevel2, setIsLevel2] = useState(false);

  const [iscurrentState, setIscurrentState] = useState("Dashboard");

  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul = document.getElementById("two-column-menu");
      const iconItems = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("subitems");
        if (document.getElementById(id))
          document.getElementById(id).classList.remove("show");
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");
    if (iscurrentState !== "Dashboard") {
      setIsDashboard(false);
    }
    if (iscurrentState !== "Apps") {
      setIsApps(false);
    }
    if (iscurrentState !== "Auth") {
      setIsAuth(false);
    }
    if (iscurrentState !== "Pages") {
      setIsPages(false);
    }
    if (iscurrentState !== "BaseUi") {
      setIsBaseUi(false);
    }
    if (iscurrentState !== "AdvanceUi") {
      setIsAdvanceUi(false);
    }

    if (iscurrentState !== "Forms") {
      setIsForms(false);
    }
    if (iscurrentState !== "Tables") {
      setIsTables(false);
    }
    if (iscurrentState !== "Charts") {
      setIsCharts(false);
    }
    if (iscurrentState !== "Icons") {
      setIsIcons(false);
    }
    if (iscurrentState !== "Maps") {
      setIsMaps(false);
    }
    if (iscurrentState !== "MuliLevel") {
      setIsMultiLevel(false);
    }
    if (iscurrentState !== "StaffManagement") {
      setIsStaffManagement(false);
    }
    if (iscurrentState !== "UsersManagement") {
      setIsUsersManagement(false);
    }
    if (iscurrentState !== "SMS") {
      setIsSMS(false);
    }
    if (iscurrentState === "Widgets") {
      history("/widgets");
      document.body.classList.add("twocolumn-panel");
    }
    if (iscurrentState === "Landing") {
      setIsLanding(false);
    }
    if (iscurrentState !== "Transactions") {
      setIsTransactions(false);
    }
    if (iscurrentState !== "Repayments") {
      setIsRepayments(false);
      setIsActiveLoansSub(false);
      setIsOverdueLoansSub(false);
    }
    if (iscurrentState !== "LoanApplication") {
      setIsLoanApplication(false);
    }
  }, [
    history,
    iscurrentState,
    isDashboard,
    isApps,
    isAuth,
    isPages,
    isBaseUi,
    isAdvanceUi,
    isForms,
    isTables,
    isCharts,
    isIcons,
    isMaps,
    isMultiLevel,
    isStaffManagement,
    isUsersManagement,
    isSMS,
    isRepayments,
    isActiveLoansSub,
    isOverdueLoansSub,
  ]);

  const menuItems = [
    {
      label: "Menu",
      isHeader: true,
    },
    {
      id: "dashboard",
      label: "Dashboards",
      icon: <FeatherIcon icon="home" className="icon-dual" />,
      link: "/#",
      stateVariables: isDashboard,
      permissions: [
        "manage_admins",
        "view_admins",
        "manage_roles",
        "view_roles",
        "manage_users",
        "view_users",
        "manage_branches",
        "view_branches",
        "manage_savings",
        "view_savings",
        "approve_early_withdrawal",
        "manage_loans",
        "view_loans",
        "manage_configurations",
        "view_configurations",
        "view_reports",
        "generate_statements",
      ],

      click: function (e) {
        e.preventDefault();
        setIsDashboard(!isDashboard);
        setIscurrentState("Dashboard");
        updateIconSidebar(e);
      },
      subItems: [
    
        {
          id: "projects",
          label: "Overview",
          link: "/dashboard",
          parentId: "dashboard",
          documentTitle: "Dashboard | IEREIP Enterprice",
        },
       
      ],
    },
    
     {
      id: "usersmanagement",
      label: "Users Management",
      icon: <FeatherIcon icon="users" className="icon-dual" />,
      link: "/#",
      permissions: ["manage_users", "view_users"],
      click: function (e) {
        e.preventDefault();
        setIsUsersManagement(!isUsersManagement);
        setIscurrentState("UsersManagement");
        updateIconSidebar(e);
      },
      stateVariables: isUsersManagement,
      subItems: [
        {
          id: "listusers",
          label: "List Users",
          link: "/users-list",
          parentId: "usersmanagement",
          permissions: ["view_users"],
        },
        {
          id: "createuser",
          label: "Create User",
          link: "/users-create",
          parentId: "usersmanagement",
          permissions: ["manage_users"],
        },
      ],
    },
  
    {
      id: "system-account",
      label: "System Account",
      icon: <i className="ri-bank-card-line" />,
      link: "/list-system-account",
    },
    {
      id: "landing",
      label: "Savings Account",
      icon: <i className="ri-rocket-line" />,
      link: "/#",
      stateVariables: isLanding,
      click: function (e) {
        e.preventDefault();
        setIsLanding(!isLanding);
        setIscurrentState("Landing");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "savingsAccountSubmenu",
          label: "Savings Account",
          link: "/savings-account",
          parentId: "landing",
        },
        
      ],
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: <i className="ri-exchange-line" />,
      link: "/#",
      stateVariables: isTransactions,
      click: function (e) {
        e.preventDefault();
        setIsTransactions(!isTransactions);
        setIscurrentState("Transactions");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "listTransactions",
          label: "List Transactions",
          link: "/list-transactions",
          parentId: "transactions",
        },
      ],
    },
    {
      id: "repayments",
      label: "Repayments",
      icon: <i className="ri-money-dollar-circle-line" />,
      link: "/#",
      stateVariables: isRepayments,
      click: function (e) {
        e.preventDefault();
        setIsRepayments(!isRepayments);
        setIscurrentState("Repayments");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "listRepayments",
          label: "List Repayments",
          link: "/list-repayments",
          parentId: "repayments",
        },
        {
          id: "activeLoans",
          label: "Active Loans",
          link: "/active-loans",
          parentId: "repayments",
        },
        {
          id: "overdueLoans",
          label: "Overdue Loans",
          link: "/overdue-loans",
          parentId: "repayments",
        },
      ],
    },
    {
      id: "loanApplication",
      label: "Loan Application",
      icon: <i className="ri-file-list-line" />,
      link: "/#",
      stateVariables: isLoanApplication,
      click: function (e) {
        e.preventDefault();
        setIsLoanApplication(!isLoanApplication);
        setIscurrentState("LoanApplication");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "allApplications",
          label: "All Applications",
          link: "/loan/applications",
          parentId: "loanApplication",
        },
        {
          id: "newApplication",
          label: "New Application",
          link: "/loan/new-application",
          parentId: "loanApplication",
        },
        {
          id: "pendingApplications",
          label: "Pending Applications",
          link: "/loan/pending-applications",
          parentId: "loanApplication",
        },
        {
          id: "approvedApplications",
          label: "Approved",
          link: "/loan/approved",
          parentId: "loanApplication",
        },
        {
          id: "rejectedApplications",
          label: "Rejected",
          link: "/loan/rejected",
          parentId: "loanApplication",
        },
      ],
    },
  
    {
      id: "advanceUi",
      label: "Branches",
      icon: <FeatherIcon icon="layers" className="icon-dual" />,
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsAdvanceUi(!isAdvanceUi);
        setIscurrentState("AdvanceUi");
        updateIconSidebar(e);
      },
      stateVariables: isAdvanceUi,
      subItems: [
        {
          id: "nestablelist",
          label: "List Branches",
          link: "/all-branches",
          parentId: "advanceUi",
        },
       
      ],
    },
  
    {
      id: "staffmanagement",
      label: "Staff Management",
      icon: (
        <i className="ri-user-settings-line align-middle fs-18 text-muted me-2"></i>
      ),
      link: "/#",
      permissions: ["manage_admins", "view_admins"],
      click: function (e) {
        e.preventDefault();
        setIsStaffManagement(!isStaffManagement);
        setIscurrentState("StaffManagement");
        updateIconSidebar(e);
      },
      stateVariables: isStaffManagement,
      subItems: [
        {
          id: "allstaff",
          label: "All Staff",
          link: "/all-staff",
          parentId: "staffmanagement",
          permissions: ["view_admins"],
        },
        {
          id: "allpermissions",
          label: "Roles & Permissions",
          link: "/all-permissions",
          parentId: "staffmanagement",
          permissions: ["manage_roles", "view_roles"],
        },
      ],
    },
      {
      id: "sms",
      label: "SMS",
      icon: <FeatherIcon icon="message-square" className="icon-dual" />,
      link: "/#",
      permissions: ["manage_users", "view_users"],
      click: function (e) {
        e.preventDefault();
        setIsSMS(!isSMS);
        setIscurrentState("SMS");
        updateIconSidebar(e);
      },
      stateVariables: isSMS,
      subItems: [
        {
          id: "sendsms",
          label: "Send SMS",
          link: "/sms/send",
          parentId: "sms",
          permissions: ["view_users"],
        },
        {
          id: "broadcastsms",
          label: "Broadcast",
          link: "/sms/broadcast",
          parentId: "sms",
          permissions: ["manage_users"],
        },
        {
          id: "smslogs",
          label: "SMS Logs",
          link: "/sms/logs",
          parentId: "sms",
          permissions: ["view_users"],
        },
      ],
    },
   
    {
      id: "auditlogs",
      label: "Audit Logs",
      icon: <i className="ri-file-history-line" />,
      link: "/audit-logs",
      permissions: ["view_audit_logs"],
    },
    {
      id: "configurations",
      label: "Configurations",
      icon: <FeatherIcon icon="settings" className="icon-dual" />,
      link: "/configurations",
      permissions: ["manage_configurations", "view_configurations"],
    },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
