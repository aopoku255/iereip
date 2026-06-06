import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, Col, Container, Form, Input, Label, Row, Spinner, Button, Table, Badge, Modal, ModalHeader, ModalBody, ModalFooter, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import { CSVLink } from "react-csv";
import "react-toastify/dist/ReactToastify.css";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { usePermission } from "../../hooks/usePermission";
import progileBg from "../../assets/images/profile-bg.jpg";
import { getUserById } from "../../slices/thunks";
import { getUserSavingsAccounts, contributeSavings, withdrawSavings, earlyWithdrawSavings, getSavingsStatement, issueBooklet } from "../../slices/savingsAccounts/thunk";

const ViewSavingsAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const canManageSavings = usePermission("manage_savings");
  const canApproveEarlyWithdrawal = usePermission("approve_early_withdrawal");

  const { selectedUser, selectedUserLoading, selectedUserError } = useSelector((state) => state.Users || {});
  const { userSavingsAccounts, userSavingsLoading, userSavingsError } = useSelector((state) => state.SavingsAccounts || {
    userSavingsAccounts: [],
    userSavingsLoading: false,
    userSavingsError: null,
  });

  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [selectedAccountForContribute, setSelectedAccountForContribute] = useState(null);
  const [contributeForm, setContributeForm] = useState({ amount: "", narration: "" });
  const [isContributing, setIsContributing] = useState(false);

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [selectedAccountForWithdraw, setSelectedAccountForWithdraw] = useState(null);
  const [withdrawForm, setWithdrawForm] = useState({ amount: "", narration: "" });
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const [isEarlyWithdrawModalOpen, setIsEarlyWithdrawModalOpen] = useState(false);
  const [selectedAccountForEarlyWithdraw, setSelectedAccountForEarlyWithdraw] = useState(null);
  const [earlyWithdrawForm, setEarlyWithdrawForm] = useState({ amount: "", narration: "" });
  const [isEarlyWithdrawing, setIsEarlyWithdrawing] = useState(false);

  const [selectedAccountForStatement, setSelectedAccountForStatement] = useState(null);
  const [statementForm, setStatementForm] = useState({ start_date: "", end_date: "" });
  const [isFetchingStatement, setIsFetchingStatement] = useState(false);

  const [issuingBooklet, setIssuingBooklet] = useState(false);
  const [isIssueBookletConfirmModalOpen, setIsIssueBookletConfirmModalOpen] = useState(false);
  const [selectedAccountForIssueBooklet, setSelectedAccountForIssueBooklet] = useState(null);

  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  const toggleDropdown = (accountId) => {
    setDropdownOpen(dropdownOpen === accountId ? null : accountId);
  };

  useEffect(() => {
    if (id) {
      dispatch(getUserById(id));
      dispatch(getUserSavingsAccounts(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (userSavingsError) {
      toast.error(userSavingsError, { position: "top-right", autoClose: 3000 });
    }
  }, [userSavingsError]);

  const profileImage = selectedUser?.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser?.full_name || "User")}&background=0D8ABC&color=fff&size=128`;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString();
  };

  const handleContributeClick = (account) => {
    setSelectedAccountForContribute(account);
    setContributeForm({ amount: "", narration: "" });
    setIsContributeModalOpen(true);
  };

  const handleContributeFormChange = (e) => {
    const { name, value } = e.target;
    setContributeForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContributeSubmit = async (e) => {
    e.preventDefault();

    if (!contributeForm.amount || contributeForm.amount <= 0) {
      toast.error("Please enter a valid amount", { position: "top-right", autoClose: 3000 });
      return;
    }

    setIsContributing(true);
    try {
      const payload = {
        savings_account_id: selectedAccountForContribute.id,
        amount: parseFloat(contributeForm.amount),
        narration: contributeForm.narration || "",
      };

      const result = await dispatch(contributeSavings(payload)).unwrap();
      toast.success("Contribution successful!", { position: "top-right", autoClose: 3000 });
      setIsContributeModalOpen(false);
      setContributeForm({ amount: "", narration: "" });
      // Refresh the savings accounts list
      dispatch(getUserSavingsAccounts(id));
    } catch (error) {
      toast.error(error || "Failed to contribute", { position: "top-right", autoClose: 3000 });
    } finally {
      setIsContributing(false);
    }
  };

  const handleWithdrawClick = (account) => {
    setSelectedAccountForWithdraw(account);
    setWithdrawForm({ amount: "", narration: "" });
    setIsWithdrawModalOpen(true);
  };

  const handleWithdrawFormChange = (e) => {
    const { name, value } = e.target;
    setWithdrawForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();

    if (!withdrawForm.amount || withdrawForm.amount <= 0) {
      toast.error("Please enter a valid amount", { position: "top-right", autoClose: 3000 });
      return;
    }

    setIsWithdrawing(true);
    try {
      const payload = {
        savings_account_id: selectedAccountForWithdraw.id,
        amount: parseFloat(withdrawForm.amount),
        narration: withdrawForm.narration || "",
      };

      const result = await dispatch(withdrawSavings(payload)).unwrap();
      toast.success("Withdrawal successful!", { position: "top-right", autoClose: 3000 });
      setIsWithdrawModalOpen(false);
      setWithdrawForm({ amount: "", narration: "" });
      // Refresh the savings accounts list
      dispatch(getUserSavingsAccounts(id));
    } catch (error) {
      toast.error(error || "Failed to withdraw", { position: "top-right", autoClose: 3000 });
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleEarlyWithdrawClick = (account) => {
    setSelectedAccountForEarlyWithdraw(account);
    setEarlyWithdrawForm({ amount: "", narration: "" });
    setIsEarlyWithdrawModalOpen(true);
  };

  const handleEarlyWithdrawFormChange = (e) => {
    const { name, value } = e.target;
    setEarlyWithdrawForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEarlyWithdrawSubmit = async (e) => {
    e.preventDefault();

    if (!earlyWithdrawForm.amount || earlyWithdrawForm.amount <= 0) {
      toast.error("Please enter a valid amount", { position: "top-right", autoClose: 3000 });
      return;
    }

    setIsEarlyWithdrawing(true);
    try {
      const payload = {
        savings_account_id: selectedAccountForEarlyWithdraw.id,
        amount: parseFloat(earlyWithdrawForm.amount),
        reason: earlyWithdrawForm.narration || "",
      };

      const result = await dispatch(earlyWithdrawSavings(payload)).unwrap();
      toast.success("Early withdrawal successful!", { position: "top-right", autoClose: 3000 });
      setIsEarlyWithdrawModalOpen(false);
      setEarlyWithdrawForm({ amount: "", narration: "" });
      // Refresh the savings accounts list
      dispatch(getUserSavingsAccounts(id));
    } catch (error) {
      toast.error(error || "Failed to early withdraw", { position: "top-right", autoClose: 3000 });
    } finally {
      setIsEarlyWithdrawing(false);
    }
  };

  const handleStatementClick = (account) => {
    setSelectedAccountForStatement(account);
    setStatementForm({ start_date: "", end_date: "" });
  };

  const handleStatementFormChange = (e) => {
    const { name, value } = e.target;
    setStatementForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatementSubmit = async (e) => {
    e.preventDefault();

    if (!statementForm.start_date || !statementForm.end_date) {
      toast.error("Please enter both start and end dates", { position: "top-right", autoClose: 3000 });
      return;
    }

    if (new Date(statementForm.start_date) > new Date(statementForm.end_date)) {
      toast.error("Start date cannot be after end date", { position: "top-right", autoClose: 3000 });
      return;
    }

    setIsFetchingStatement(true);
    try {
      const payload = {
        savings_account_id: selectedAccountForStatement.id,
        start_date: statementForm.start_date,
        end_date: statementForm.end_date,
      };

      const result = await dispatch(getSavingsStatement(payload)).unwrap();
      const statementData = result.data || result;
      
      // Navigate to statement page with data
      navigate("/savings-account-statement", { 
        state: { statementData } 
      });
      toast.success("Statement fetched successfully!", { position: "top-right", autoClose: 3000 });
    } catch (error) {
      toast.error(error || "Failed to fetch statement", { position: "top-right", autoClose: 3000 });
    } finally {
      setIsFetchingStatement(false);
    }
  };

  const handleIssueBookletClick = (account) => {
    setSelectedAccountForIssueBooklet(account);
    setIsIssueBookletConfirmModalOpen(true);
  };

  const handleIssueBookletConfirm = async () => {
    if (!selectedAccountForIssueBooklet) return;

    setIssuingBooklet(true);
    try {
      const payload = {
        user_id: Number(selectedUser?.id || selectedUser?.user_id || 0),
        savings_account_id: selectedAccountForIssueBooklet.id,
      };

      const result = await dispatch(issueBooklet(payload)).unwrap();
      toast.success("Booklet issued successfully!", { position: "top-right", autoClose: 3000 });
      setIsIssueBookletConfirmModalOpen(false);
      setSelectedAccountForIssueBooklet(null);
      // Refresh the savings accounts list
      dispatch(getUserSavingsAccounts(id));
    } catch (error) {
      toast.error(error || "Failed to issue booklet", { position: "top-right", autoClose: 3000 });
    } finally {
      setIssuingBooklet(false);
    }
  };

  const closeIssueBookletConfirmModal = () => {
    setIsIssueBookletConfirmModalOpen(false);
    setSelectedAccountForIssueBooklet(null);
  };

  // Export Functions
  const prepareExportData = () => {
    return userSavingsAccounts.map((account) => ({
      "Account Number": account.account_number || "-",
      "Contribution Amount": `₵${Number(account.contribution_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      "Frequency": account.frequency || "-",
      "Balance": `₵${Number(account.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      "Total Contributions": account.total_contributions || 0,
      "Valid Count": account.valid_contribution_count || 0,
      "Early Withdrawals": account.early_withdrawal_count || 0,
      "Eligible for Contribution": account.valid_contribution_count > 0 ? "Yes" : "No",
      "Status": account.is_active ? "Active" : "Inactive",
      "Created Date": account.created_at ? new Date(account.created_at).toLocaleDateString() : "-",
    }));
  };

  const exportToCSV = () => {
    const element = document.getElementById("csv-export-link");
    if (element) {
      element.click();
      toast.success("Data exported to CSV successfully!", { position: "top-right", autoClose: 3000 });
      setExportDropdownOpen(false);
    }
  };

  const exportToExcel = () => {
    const element = document.getElementById("excel-export-link");
    if (element) {
      element.click();
      toast.success("Data exported to Excel successfully!", { position: "top-right", autoClose: 3000 });
      setExportDropdownOpen(false);
    }
  };

  const exportToPDF = () => {
    const element = document.getElementById("pdf-export-link");
    if (element) {
      element.click();
      toast.success("Data exported to PDF successfully!", { position: "top-right", autoClose: 3000 });
      setExportDropdownOpen(false);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="View Savings Account" pageTitle="Savings Account" />

          <div className="position-relative mx-n4 mt-n4">
            <div className="profile-wid-bg profile-setting-img">
              <img src={progileBg} className="profile-wid-img" alt="profile-bg" />
              <div className="overlay-content">
                <div className="text-end p-3">
                  <div className="p-0 ms-auto rounded-circle profile-photo-edit">
                    <Input id="profile-foreground-img-file-input" type="file" className="profile-foreground-img-file-input" disabled />
                   
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Row>
            <Col xxl={3}>
              <Card className="mt-n5">
                <CardBody className="p-4">
                  <div className="text-center">
                    <div className="profile-user position-relative d-inline-block mx-auto mb-4">
                      <img src={profileImage} className="rounded-circle avatar-xl img-thumbnail user-profile-image" alt="user-profile" />
                      <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                        <Input id="profile-img-file-input" type="file" className="profile-img-file-input" disabled />
                        <Label htmlFor="profile-img-file-input" className="profile-photo-edit avatar-xs">
                          <span className="avatar-title rounded-circle bg-light text-body">
                            <i className="ri-camera-fill"></i>
                          </span>
                        </Label>
                      </div>
                    </div>
                    <h5 className="fs-16 mb-1">{selectedUser?.full_name || "-"}</h5>
                    <p className="text-muted mb-0">{selectedUser?.user_id || "-"}</p>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <div className="d-flex align-items-center mb-4">
                    <div className="flex-grow-1">
                      <h5 className="card-title mb-0">Account Info</h5>
                    </div>
                    <div className="flex-shrink-0">
                      <Button color="light" size="sm" disabled>
                        <i className="ri-information-line align-bottom me-1"></i> Info
                      </Button>
                    </div>
                  </div>
                  <div className="mb-3 d-flex">
                    <div className="avatar-xs d-block flex-shrink-0 me-3">
                      <span className="avatar-title rounded-circle fs-16 bg-body text-body">
                        <i className="ri-id-card-line"></i>
                      </span>
                    </div>
                    <Input type="text" className="form-control" placeholder="User ID" value={selectedUser?.user_id || "-"} disabled />
                  </div>
                  <div className="mb-3 d-flex">
                    <div className="avatar-xs d-block flex-shrink-0 me-3">
                      <span className="avatar-title rounded-circle fs-16 bg-primary-subtle text-primary">
                        <i className="ri-building-4-line"></i>
                      </span>
                    </div>
                    <Input type="text" className="form-control" placeholder="Branch" value={selectedUser?.branch?.name || "-"} disabled />
                  </div>
                  <div className="mb-3 d-flex">
                    <div className="avatar-xs d-block flex-shrink-0 me-3">
                      <span className="avatar-title rounded-circle fs-16 bg-success-subtle text-success">
                        <i className="ri-briefcase-4-line"></i>
                      </span>
                    </div>
                    <Input type="text" className="form-control" placeholder="Account Type" value={selectedUser?.account_type || "-"} disabled />
                  </div>
                  <div className="d-flex">
                    <div className="avatar-xs d-block flex-shrink-0 me-3">
                      <span className="avatar-title rounded-circle fs-16 bg-danger-subtle text-danger">
                        <i className="ri-shield-check-line"></i>
                      </span>
                    </div>
                    <Input type="text" className="form-control" placeholder="Status" value={selectedUser?.is_active ? "Active" : "Inactive"} disabled />
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xxl={9}>
              <Card className="mt-xxl-n5">
                <CardHeader className="d-flex align-items-center justify-content-between">
                  <h4 className="card-title mb-0">Savings Accounts</h4>
                  <div className="d-flex gap-2">
                    <Dropdown isOpen={exportDropdownOpen} toggle={() => setExportDropdownOpen(!exportDropdownOpen)}>
                      <DropdownToggle color="primary" size="sm" caret>
                        <i className="mdi mdi-download me-1"></i> Export
                      </DropdownToggle>
                      <DropdownMenu end>
                        <DropdownItem onClick={exportToCSV} disabled={!userSavingsAccounts || userSavingsAccounts.length === 0}>
                          <i className="mdi mdi-file-delimited me-2"></i> CSV
                        </DropdownItem>
                        <DropdownItem onClick={exportToExcel} disabled={!userSavingsAccounts || userSavingsAccounts.length === 0}>
                          <i className="mdi mdi-file-excel me-2"></i> Excel
                        </DropdownItem>
                        <DropdownItem onClick={exportToPDF} disabled={!userSavingsAccounts || userSavingsAccounts.length === 0}>
                          <i className="mdi mdi-file-pdf me-2"></i> PDF
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </CardHeader>

                <CardBody className="p-4">
                  {selectedUserLoading || userSavingsLoading ? (
                    <div className="text-center py-5">
                      <Spinner color="primary" />
                    </div>
                  ) : selectedUserError || userSavingsError ? (
                    <div className="text-danger py-4">
                      {selectedUserError || userSavingsError}
                    </div>
                  ) : (
                    <>
                      <div className="table-responsive">
                        <Table hover className="mb-0">
                          <thead>
                            <tr className="border-top">
                              <th>Account Number</th>
                              <th>Contribution Amount</th>
                              <th>Frequency</th>
                              <th>Balance</th>
                              <th>Total Contributions</th>
                              <th>Valid Count</th>
                              <th>Early Withdrawals</th>
                              <th>Eligible for Contribution</th>
                              <th>Status</th>
                              <th>Created Date</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userSavingsAccounts && userSavingsAccounts.length > 0 ? (
                              userSavingsAccounts.map((account) => (
                                <tr key={account.id}>
                                  <td>
                                    <span className="fw-semibold">{account.account_number || "-"}</span>
                                  </td>
                                  <td><span className="fw-semibold">₵{Number(account.contribution_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></td>
                                  <td>
                                    <span className="badge bg-primary-subtle text-primary text-capitalize">
                                      {account.frequency || "-"}
                                    </span>
                                  </td>
                                  <td><span className="fw-semibold">₵{Number(account.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></td>
                                  <td><span className="fw-semibold">{Number(account.total_contributions || 0)}</span></td>
                                  <td>{account.valid_contribution_count || 0}</td>
                                  <td>
                                    <span className="fw-semibold">{account.early_withdrawal_count || 0}</span>
                                  </td>
                                  <td>
                                    {account.valid_contribution_count > 0 ? (
                                      <span className="badge bg-success-subtle text-success">Yes</span>
                                    ) : (
                                      <span className="badge bg-danger-subtle text-danger">No</span>
                                    )}
                                  </td>
                                  <td>
                                    {account.is_active ? (
                                      <span className="badge bg-success-subtle text-success">Active</span>
                                    ) : (
                                      <span className="badge bg-danger-subtle text-danger">Inactive</span>
                                    )}
                                  </td>
                                  <td>
                                    <span className="text-muted">
                                      {account.created_at ? (
                                        <>
                                          <span className="fw-bold">{new Date(account.created_at).toLocaleDateString()}</span> <small>{new Date(account.created_at).toLocaleTimeString()}</small>
                                        </>
                                      ) : "-"}
                                    </span>
                                  </td>
                                  <td>
                                    <Dropdown isOpen={dropdownOpen === account.id} toggle={() => toggleDropdown(account.id)}>
                                      <DropdownToggle color="soft-primary" caret className="btn-sm">
                                        <i className="mdi mdi-dots-vertical"></i>
                                      </DropdownToggle>
                                      <DropdownMenu end>
                                        {canManageSavings && (
                                          <DropdownItem onClick={() => { handleContributeClick(account); toggleDropdown(null); }}>
                                            <i className="mdi mdi-plus-circle me-2"></i> Contribute
                                          </DropdownItem>
                                        )}
                                        {canManageSavings && (
                                          <DropdownItem onClick={() => { handleWithdrawClick(account); toggleDropdown(null); }}>
                                            <i className="mdi mdi-cash-multiple me-2"></i> Withdraw
                                          </DropdownItem>
                                        )}
                                        {canApproveEarlyWithdrawal && (
                                          <DropdownItem onClick={() => { handleEarlyWithdrawClick(account); toggleDropdown(null); }}>
                                            <i className="mdi mdi-alert-circle me-2"></i> Early Withdraw
                                          </DropdownItem>
                                        )}
                                        <DropdownItem divider />
                                        <DropdownItem onClick={() => { handleStatementClick(account); toggleDropdown(null); }}>
                                          <i className="mdi mdi-file-document me-2"></i> Statement
                                        </DropdownItem>
                                        {canManageSavings && !selectedUser?.has_booklet && (
                                          <DropdownItem onClick={() => { handleIssueBookletClick(account); toggleDropdown(null); }} disabled={issuingBooklet}>
                                            <i className="mdi mdi-notebook me-2"></i> {issuingBooklet ? "Issuing..." : "Issue Booklet"}
                                          </DropdownItem>
                                        )}
                                      </DropdownMenu>
                                    </Dropdown>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="11" className="text-center text-muted py-4">
                                  No savings accounts found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </div>

                      {userSavingsAccounts && userSavingsAccounts.length > 0 && (
                        <div className="mt-4">
                          <Row>
                            <Col md={6}>
                              <div className="card bg-light">
                                <CardBody>
                                  <div className="d-flex align-items-center">
                                    <div className="flex-grow-1">
                                      <p className="text-muted mb-2">Total Accounts</p>
                                      <h4 className="mb-0">{userSavingsAccounts.length}</h4>
                                    </div>
                                    <div className="avatar-lg bg-primary-subtle rounded">
                                      <i className="ri-bank-card-2-line fs-1 text-primary"></i>
                                    </div>
                                  </div>
                                </CardBody>
                              </div>
                            </Col>
                            <Col md={6}>
                              <div className="card bg-light">
                                <CardBody>
                                  <div className="d-flex align-items-center">
                                    <div className="flex-grow-1">
                                      <p className="text-muted mb-2">Active Accounts</p>
                                      <h4 className="mb-0">{userSavingsAccounts.filter(acc => acc.is_active).length}</h4>
                                    </div>
                                    <div className="avatar-lg bg-success-subtle rounded">
                                      <i className="ri-checkbox-circle-line fs-1 text-success"></i>
                                    </div>
                                  </div>
                                </CardBody>
                              </div>
                            </Col>
                          </Row>

                          <Row className="mt-3">
                            <Col md={6}>
                              <div className="card bg-light">
                                <CardBody>
                                  <div className="d-flex align-items-center">
                                    <div className="flex-grow-1">
                                      <p className="text-muted mb-2">Total Balance</p>
                                      <h4 className="mb-0">
                                        <span className="fw-semibold">₵{Number(userSavingsAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                      </h4>
                                    </div>
                                    <div className="avatar-lg bg-info-subtle rounded">
                                      <i className="ri-wallet-2-line fs-1 text-info"></i>
                                    </div>
                                  </div>
                                </CardBody>
                              </div>
                            </Col>
                            <Col md={6}>
                              <div className="card bg-light">
                                <CardBody>
                                  <div className="d-flex align-items-center">
                                    <div className="flex-grow-1">
                                      <p className="text-muted mb-2">Total Contributions</p>
                                      <h4 className="mb-0">
                                        <span className="fw-semibold">{Number(userSavingsAccounts.reduce((sum, acc) => sum + (acc.total_contributions || 0), 0))}</span>
                                      </h4>
                                    </div>
                                    <div className="avatar-lg bg-warning-subtle rounded">
                                      <i className="ri-money-pound-circle-line fs-1 text-warning"></i>
                                    </div>
                                  </div>
                                </CardBody>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      )}
                    </>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Contribute Modal */}
      <Modal isOpen={isContributeModalOpen} toggle={() => setIsContributeModalOpen(false)} centered>
        <ModalHeader toggle={() => setIsContributeModalOpen(false)}>
          Contribute to Savings Account
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleContributeSubmit}>
            <div className="mb-3">
              <Label for="amount" className="form-label">
                Amount <span className="text-danger">*</span>
              </Label>
              <Input
                type="number"
                id="amount"
                name="amount"
                placeholder="Enter contribution amount"
                value={contributeForm.amount}
                onChange={handleContributeFormChange}
                step="0.01"
                min="0"
                required
                disabled={isContributing}
              />
            </div>
            <div className="mb-3">
              <Label for="narration" className="form-label">
                Narration
              </Label>
              <Input
                type="textarea"
                id="narration"
                name="narration"
                placeholder="Add a note or narration (optional)"
                value={contributeForm.narration}
                onChange={handleContributeFormChange}
                rows="3"
                disabled={isContributing}
              />
            </div>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            type="button"
            color="light"
            onClick={() => setIsContributeModalOpen(false)}
            disabled={isContributing}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            onClick={handleContributeSubmit}
            disabled={isContributing}
          >
            {isContributing ? (
              <>
                <Spinner size="sm" className="me-2" />
                Contributing...
              </>
            ) : (
              "Contribute"
            )}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Withdraw Modal */}
      <Modal isOpen={isWithdrawModalOpen} toggle={() => setIsWithdrawModalOpen(false)} centered>
        <ModalHeader toggle={() => setIsWithdrawModalOpen(false)}>
          Withdraw from Savings Account
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleWithdrawSubmit}>
            <div className="mb-3">
              <Label for="withdrawAmount" className="form-label">
                Amount <span className="text-danger">*</span>
              </Label>
              <Input
                type="number"
                id="withdrawAmount"
                name="amount"
                placeholder="Enter withdrawal amount"
                value={withdrawForm.amount}
                onChange={handleWithdrawFormChange}
                step="0.01"
                min="0"
                required
                disabled={isWithdrawing}
              />
            </div>
            <div className="mb-3">
              <Label for="withdrawNarration" className="form-label">
                Narration
              </Label>
              <Input
                type="textarea"
                id="withdrawNarration"
                name="narration"
                placeholder="Add a note or narration (optional)"
                value={withdrawForm.narration}
                onChange={handleWithdrawFormChange}
                rows="3"
                disabled={isWithdrawing}
              />
            </div>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            type="button"
            color="light"
            onClick={() => setIsWithdrawModalOpen(false)}
            disabled={isWithdrawing}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            onClick={handleWithdrawSubmit}
            disabled={isWithdrawing}
          >
            {isWithdrawing ? (
              <>
                <Spinner size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              "Withdraw"
            )}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Early Withdraw Modal */}
      <Modal isOpen={isEarlyWithdrawModalOpen} toggle={() => setIsEarlyWithdrawModalOpen(false)} centered>
        <ModalHeader toggle={() => setIsEarlyWithdrawModalOpen(false)}>
          Early Withdraw from Savings Account
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleEarlyWithdrawSubmit}>
            <div className="mb-3">
              <Label for="earlyWithdrawAmount" className="form-label">
                Amount <span className="text-danger">*</span>
              </Label>
              <Input
                type="number"
                id="earlyWithdrawAmount"
                name="amount"
                placeholder="Enter withdrawal amount"
                value={earlyWithdrawForm.amount}
                onChange={handleEarlyWithdrawFormChange}
                step="0.01"
                min="0"
                required
                disabled={isEarlyWithdrawing}
              />
            </div>
            <div className="mb-3">
              <Label for="earlyWithdrawNarration" className="form-label">
                Narration
              </Label>
              <Input
                type="textarea"
                id="earlyWithdrawNarration"
                name="narration"
                placeholder="Add a note or narration (optional)"
                value={earlyWithdrawForm.narration}
                onChange={handleEarlyWithdrawFormChange}
                rows="3"
                disabled={isEarlyWithdrawing}
              />
            </div>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            type="button"
            color="light"
            onClick={() => setIsEarlyWithdrawModalOpen(false)}
            disabled={isEarlyWithdrawing}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            onClick={handleEarlyWithdrawSubmit}
            disabled={isEarlyWithdrawing}
          >
            {isEarlyWithdrawing ? (
              <>
                <Spinner size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              "Early Withdraw"
            )}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Statement Modal */}
      <Modal isOpen={selectedAccountForStatement !== null} toggle={() => { setSelectedAccountForStatement(null); setStatementForm({ start_date: "", end_date: "" }); }} centered size="lg">
        <ModalHeader toggle={() => { setSelectedAccountForStatement(null); setStatementForm({ start_date: "", end_date: "" }); }}>
          Savings Account Statement
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleStatementSubmit}>
            <div className="mb-3">
              <Label for="startDate" className="form-label">
                Start Date <span className="text-danger">*</span>
              </Label>
              <Input
                type="date"
                id="startDate"
                name="start_date"
                value={statementForm.start_date}
                onChange={handleStatementFormChange}
                required
                disabled={isFetchingStatement}
              />
            </div>
            <div className="mb-3">
              <Label for="endDate" className="form-label">
                End Date <span className="text-danger">*</span>
              </Label>
              <Input
                type="date"
                id="endDate"
                name="end_date"
                value={statementForm.end_date}
                onChange={handleStatementFormChange}
                required
                disabled={isFetchingStatement}
              />
            </div>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            type="button"
            color="light"
            onClick={() => { setSelectedAccountForStatement(null); setStatementForm({ start_date: "", end_date: "" }); }}
            disabled={isFetchingStatement}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            onClick={handleStatementSubmit}
            disabled={isFetchingStatement}
          >
            {isFetchingStatement ? (
              <>
                <Spinner size="sm" className="me-2" />
                Fetching...
              </>
            ) : (
              "Fetch Statement"
            )}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Issue Booklet Confirmation Modal */}
      <Modal isOpen={isIssueBookletConfirmModalOpen} toggle={closeIssueBookletConfirmModal} centered>
        <ModalHeader toggle={closeIssueBookletConfirmModal}>
          <i className="mdi mdi-notebook me-2"></i> Confirm Issue Booklet
        </ModalHeader>
        <ModalBody>
          <div className="mb-3">
            <p className="text-muted mb-3">
              Are you sure you want to issue a booklet for this savings account?
            </p>
            {selectedAccountForIssueBooklet && (
              <div className="alert alert-info">
                <div className="mb-2">
                  <small className="text-muted">Account Number:</small>
                  <p className="mb-0 fw-semibold">{selectedAccountForIssueBooklet.account_number}</p>
                </div>
                <div className="mb-2">
                  <small className="text-muted">Contribution Amount:</small>
                  <p className="mb-0 fw-semibold">₵{selectedAccountForIssueBooklet.contribution_amount?.toLocaleString()}</p>
                </div>
                <div>
                  <small className="text-muted">Current Balance:</small>
                  <p className="mb-0 fw-semibold">₵{selectedAccountForIssueBooklet.balance?.toLocaleString()}</p>
                </div>
              </div>
            )}
            <div className="alert alert-warning">
              <i className="mdi mdi-alert-circle me-2"></i>
              <strong>Note:</strong> A booklet fee will be charged to your account.
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            type="button"
            color="light"
            onClick={closeIssueBookletConfirmModal}
            disabled={issuingBooklet}
          >
            Cancel
          </Button>
          <Button
            type="button"
            color="primary"
            onClick={handleIssueBookletConfirm}
            disabled={issuingBooklet}
          >
            {issuingBooklet ? (
              <>
                <Spinner size="sm" className="me-2" />
                Issuing...
              </>
            ) : (
              "Issue Booklet"
            )}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Hidden Export Links */}
      <CSVLink
        id="csv-export-link"
        data={prepareExportData()}
        filename={`savings_accounts_${new Date().toISOString().slice(0, 10)}.csv`}
        target="_blank"
        style={{ display: "none" }}
      />
      <CSVLink
        id="excel-export-link"
        data={prepareExportData()}
        filename={`savings_accounts_${new Date().toISOString().slice(0, 10)}.xlsx`}
        target="_blank"
        style={{ display: "none" }}
      />
      <CSVLink
        id="pdf-export-link"
        data={prepareExportData()}
        filename={`savings_accounts_${new Date().toISOString().slice(0, 10)}.pdf`}
        target="_blank"
        style={{ display: "none" }}
      />

      <ToastContainer />
    </React.Fragment>
  );
};

export default ViewSavingsAccount;
