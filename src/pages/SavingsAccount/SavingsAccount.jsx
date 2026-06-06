import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import { usePermission } from "../../hooks/usePermission";
import { createUserSavingsAccount, getSystemAccounts, getUsers, issueBooklet } from "../../slices/thunks";
import { resetCreateUserAccountStatus, resetIssueBookletStatus } from "../../slices/savingsAccounts/reducer";
import progileBg from "../../assets/images/profile-bg.jpg";

const SavingsAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const canManageSavings = usePermission("manage_savings");


  const { accounts } = useSelector(
    (state) => state.SavingsAccounts || {
      accounts: [],
    }
  );

  const { users, loading: usersLoading } = useSelector((state) => state.Users || { users: [], loading: false });
  const { createUserAccount, issueBooklet: issueBookletState } = useSelector((state) => state.SavingsAccounts || { createUserAccount: { loading: false, error: null, success: false }, issueBooklet: { loading: false, error: null, success: false } });

  const [showUserModal, setShowUserModal] = useState(false);
  const [showIssueBookletModal, setShowIssueBookletModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("1");
  const [savingsData, setSavingsData] = useState({
    savings_amount: "",
    savings_frequency: "",
  });
  const [issueBookletData, setIssueBookletData] = useState({
    system_account_id: "",
  });

  useEffect(() => {
    dispatch(getSystemAccounts());
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    if (createUserAccount?.success) {
      toast.success("Savings account created successfully!", { position: "top-right", autoClose: 3000 });
      dispatch(resetCreateUserAccountStatus());
      setShowUserModal(false);
      setSavingsData({ savings_amount: "", savings_frequency: "" });
      setActiveTab("1");
    }

    if (createUserAccount?.error) {
      toast.error(createUserAccount.error || "Failed to create savings account", { position: "top-right", autoClose: 3000 });
    }
  }, [createUserAccount?.success, createUserAccount?.error, dispatch]);

  useEffect(() => {
    if (issueBookletState?.success) {
      toast.success("Booklet issued successfully!", { position: "top-right", autoClose: 3000 });
      dispatch(resetIssueBookletStatus());
      closeIssueBookletModal();
    }

    if (issueBookletState?.error) {
      toast.error(issueBookletState.error || "Failed to issue booklet", { position: "top-right", autoClose: 3000 });
    }
  }, [issueBookletState?.success, issueBookletState?.error, dispatch]);



  const usersColumns = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      {
        Header: "User",
        accessor: "full_name",
        Cell: ({ row }) => {
          const user = row.original;
          const avatar = user.photo_url || user.profile_image || user.avatar || user.image || user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || "User")}&background=0D8ABC&color=fff&size=40`;
          return (
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <img
                  src={avatar}
                  alt={user.full_name || "User"}
                  className="rounded-circle avatar-xs"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || "User")}&background=0D8ABC&color=fff&size=40`;
                  }}
                />
              </div>
              <div className="flex-grow-1 ms-2">
                <h6 className="mb-1 fw-semibold">{user.full_name || "-"}</h6>
                <small className="text-muted">{user.user_id || "-"}</small>
              </div>
            </div>
          );
        },
      },
      {
        Header: "Contact",
        accessor: "email",
        Cell: ({ row }) => (
          <div>
            <div className="mb-1 fw-semibold">{row.original.email || "-"}</div>
            <small className="text-muted">{row.original.mobile_number || "-"}</small>
          </div>
        ),
      },
      { Header: "Account Type", accessor: "account_type" },
      {
        Header: "Status",
        accessor: "is_active",
        Cell: ({ value }) => (
          value ? <span className="badge bg-success-subtle text-success">Active</span> : <span className="badge bg-danger-subtle text-danger">Inactive</span>
        ),
      },
      {
        Header: "Actions",
        id: "actions",
        disableFilters: true,
        Cell: ({ row }) => (
          <div className="d-flex gap-1">
            <Button
              type="button"
              color="success"
              className="btn-sm"
              onClick={() => navigate(`/savings-account/view/${row.original.id}`)}
              title="View Savings Account"
            >
              <i className="mdi mdi-eye"></i>
            </Button>
            {canManageSavings && (
              <Button
                type="button"
                color="primary"
                className="btn-sm"
                onClick={() => openUserModal(row.original)}
                title="Create Savings Account"
              >
                <i className="mdi mdi-plus-circle"></i>
              </Button>
            )}
          </div>
        ),
      },
    ],
    [canManageSavings]
  );


  const usersData = useMemo(() => Array.isArray(users) ? users : [], [users]);



  const openUserModal = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
    setActiveTab("1");
    setSavingsData({ savings_amount: "", savings_frequency: "" });
  };

  const openIssueBookletModal = (user) => {
    setSelectedUser(user);
    setShowIssueBookletModal(true);
    setIssueBookletData({ system_account_id: "" });
  };

  const closeIssueBookletModal = () => {
    setShowIssueBookletModal(false);
    setSelectedUser(null);
    setIssueBookletData({ system_account_id: "" });
  };

  const handleIssueBookletDataChange = (event) => {
    const { name, value } = event.target;
    setIssueBookletData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIssueBookletSubmit = () => {
    if (!issueBookletData.system_account_id) {
      toast.error("Please select a system account.", { position: "top-right", autoClose: 3000 });
      return;
    }

    const payload = {
      user_id: Number(selectedUser?.id || selectedUser?.user_id || 0),
      savings_account_id: Number(issueBookletData.system_account_id),
    };

    dispatch(issueBooklet(payload));
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
    setActiveTab("1");
    setSavingsData({ savings_amount: "", savings_frequency: "" });
  };

  const handleSavingsDataChange = (event) => {
    const { name, value } = event.target;
    setSavingsData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSavingsAccount = async () => {
    try {
      const requiredFields = [
        { name: "Savings Amount", value: savingsData.savings_amount },
        { name: "Savings Frequency", value: savingsData.savings_frequency },
      ];

      const missingFields = requiredFields
        .filter((field) => !field.value || field.value === "")
        .map((field) => field.name);

      if (missingFields.length) {
        const message = `Please provide required fields: ${missingFields.join(", ")}`;
        toast.error(message, { position: "top-right", autoClose: 3000 });
        return;
      }

      const payload = {
        user_id: parseInt(selectedUser.id, 10),
        savings_amount: parseFloat(savingsData.savings_amount),
        savings_frequency: savingsData.savings_frequency,
      };

      dispatch(createUserSavingsAccount(payload));
    } catch (error) {
      const message = error?.message || "Failed to create savings account";
      toast.error(message, { position: "top-right", autoClose: 3000 });
    }
  };

  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const requiredLabel = (text) => (
    <>
      {text} <span className="text-danger">*</span>
    </>
  );

  const profileImage = selectedUser?.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser?.full_name || "User")}&background=0D8ABC&color=fff&size=128`;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Savings Account" pageTitle="Pages" />



          <Row>
            <Col xs={12}>
              <Card>
                <CardHeader className="align-items-center d-flex">
                  <h4 className="card-title mb-0">Create User Savings Account</h4>
                </CardHeader>
                <CardBody>
                  {usersLoading ? (
                    <div className="text-center py-4">
                      <Spinner color="primary" />
                    </div>
                  ) : (
                    <TableContainer
                      columns={usersColumns}
                      data={usersData}
                      isGlobalFilter={true}
                      topFiltersOnRight
                      isGlobalSearch
                      hideHeaderFilters
                      customPageSize={10}
                    />
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>



        {/* Create User Savings Account Modal */}
        <Modal isOpen={showUserModal} toggle={closeUserModal} size="lg" centered>
          <ModalHeader toggle={closeUserModal}>Create User Savings Account</ModalHeader>
          <ModalBody>
            {selectedUser ? (
              <div>
                <div className="mb-3 pb-3 border-bottom">
                  <div className="row align-items-center">
                    <div className="col-auto">
                      <img src={profileImage} className="rounded-circle avatar-lg img-thumbnail" alt="user-profile" />
                    </div>
                    <div className="col">
                      <h5 className="fs-16 mb-1">{selectedUser?.full_name || "-"}</h5>
                      <p className="text-muted mb-2">{selectedUser?.user_id || "-"}</p>
                      <div className="d-flex gap-3">
                        <div>
                          <small className="text-muted">Email:</small>
                          <p className="mb-0">{selectedUser?.email || "-"}</p>
                        </div>
                        <div>
                          <small className="text-muted">Phone:</small>
                          <p className="mb-0">{selectedUser?.mobile_number || "-"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Nav className="nav-tabs mb-3" role="tablist">
                  <NavItem>
                    <NavLink className={classnames({ active: activeTab === "1" })} onClick={() => tabChange("1")} href="#">
                      Personal Info
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className={classnames({ active: activeTab === "2" })} onClick={() => tabChange("2")} href="#">
                      Savings Details
                    </NavLink>
                  </NavItem>
                </Nav>

                <TabContent activeTab={activeTab}>
                  <TabPane tabId="1">
                    <Form>
                      <Row>
                        <Col lg={6}>
                          <div className="mb-3">
                            <Label htmlFor="firstnameInput" className="form-label">First Name</Label>
                            <Input type="text" className="form-control" id="firstnameInput" value={selectedUser?.first_name || ""} disabled />
                          </div>
                        </Col>
                        <Col lg={6}>
                          <div className="mb-3">
                            <Label htmlFor="lastnameInput" className="form-label">Last Name</Label>
                            <Input type="text" className="form-control" id="lastnameInput" value={selectedUser?.last_name || ""} disabled />
                          </div>
                        </Col>
                        <Col lg={6}>
                          <div className="mb-3">
                            <Label htmlFor="phoneInput" className="form-label">Phone Number</Label>
                            <Input type="text" className="form-control" id="phoneInput" value={selectedUser?.mobile_number || ""} disabled />
                          </div>
                        </Col>
                        <Col lg={6}>
                          <div className="mb-3">
                            <Label htmlFor="emailInput" className="form-label">Email</Label>
                            <Input type="email" className="form-control" id="emailInput" value={selectedUser?.email || ""} disabled />
                          </div>
                        </Col>
                        <Col lg={6}>
                          <div className="mb-3">
                            <Label htmlFor="accountTypeInput" className="form-label">Account Type</Label>
                            <Input type="text" className="form-control" id="accountTypeInput" value={selectedUser?.account_type || ""} disabled />
                          </div>
                        </Col>
                        <Col lg={6}>
                          <div className="mb-3">
                            <Label htmlFor="statusInput" className="form-label">Status</Label>
                            <Input type="text" className="form-control" id="statusInput" value={selectedUser?.is_active ? "Active" : "Inactive"} disabled />
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </TabPane>

                  <TabPane tabId="2">
                    <Form>
                      <div className="border-bottom mb-3 pb-2">
                        <h5 className="card-title mb-0 text-primary">Savings Details</h5>
                        <p className="text-muted mb-0">Required fields are marked with <span className="text-danger">*</span>.</p>
                      </div>
                      <Row>
                        <Col lg={6}>
                          <div className="mb-3">
                            <Label htmlFor="savingsAmountInput" className="form-label">{requiredLabel("Savings Amount")}</Label>
                            <Input
                              type="number"
                              className="form-control"
                              id="savingsAmountInput"
                              name="savings_amount"
                              placeholder="Enter savings amount"
                              value={savingsData.savings_amount}
                              onChange={handleSavingsDataChange}
                              step="0.01"
                            />
                          </div>
                        </Col>
                        <Col lg={6}>
                          <div className="mb-3">
                            <Label htmlFor="savingsFrequencyInput" className="form-label">{requiredLabel("Savings Frequency")}</Label>
                            <Input
                              type="select"
                              className="form-control"
                              id="savingsFrequencyInput"
                              name="savings_frequency"
                              value={savingsData.savings_frequency}
                              onChange={handleSavingsDataChange}
                            >
                              <option value="">Select frequency</option>
                              <option value="daily">Daily</option>
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                            </Input>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </TabPane>
                </TabContent>
              </div>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={closeUserModal} disabled={createUserAccount?.loading}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleCreateSavingsAccount} disabled={createUserAccount?.loading}>
              {createUserAccount?.loading ? "Creating..." : "Create Savings Account"}
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={showIssueBookletModal} toggle={closeIssueBookletModal} size="md" centered>
          <ModalHeader toggle={closeIssueBookletModal}>Issue Booklet</ModalHeader>
          <ModalBody>
            {selectedUser ? (
              <div>
                <div className="mb-3 pb-3 border-bottom">
                  <div className="row align-items-center">
                    <div className="col-auto">
                      <img src={profileImage} className="rounded-circle avatar-lg img-thumbnail" alt="user-profile" />
                    </div>
                    <div className="col">
                      <h5 className="fs-16 mb-1">{selectedUser?.full_name || "-"}</h5>
                      <p className="text-muted mb-2">{selectedUser?.user_id || "-"}</p>
                    </div>
                  </div>
                </div>

                <Form>
                  <div className="mb-3">
                    <Label htmlFor="issueSystemAccountInput" className="form-label">System Account</Label>
                    <Input
                      type="select"
                      className="form-control"
                      id="issueSystemAccountInput"
                      name="system_account_id"
                      value={issueBookletData.system_account_id}
                      onChange={handleIssueBookletDataChange}
                    >
                      <option value="">Select system account</option>
                      {accounts && accounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.name} (₵{Number(account.balance || 0).toLocaleString()})
                        </option>
                      ))}
                    </Input>
                  </div>
                </Form>
              </div>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={closeIssueBookletModal}>
              Cancel
            </Button>
            <Button color="info" onClick={handleIssueBookletSubmit} disabled={issueBookletState?.loading}>
              {issueBookletState?.loading ? "Issuing..." : "Issue Booklet"}
            </Button>
          </ModalFooter>
        </Modal>

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover limit={1} />
      </div>
    </React.Fragment>
  );
};

export default SavingsAccount;
