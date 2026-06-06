import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardBody, CardHeader, Col, Container, Row, Spinner, Button, Input, Label, Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import progileBg from "../../assets/images/profile-bg.jpg";
import TableContainer from "../../Components/Common/TableContainer";
import { usePermission } from "../../hooks/usePermission";
import { StatusColumnFilter } from "../../Components/Common/filters";
import { getUserById } from "../../slices/thunks";
import { getUserLoans, approveLoanApplication, rejectLoanApplication } from "../../slices/loans/thunk";
import { toast } from "react-toastify";

const LoanUserLoans = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const canApproveLoan = usePermission("approve_loans");
  const { selectedUser, selectedUserLoading, selectedUserError } = useSelector((state) => state.Users || {});
  const { userLoans, userLoansLoading, userLoansError } = useSelector((state) => state.Loans || {});
  const [processingId, setProcessingId] = useState(null);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [approveLoanTarget, setApproveLoanTarget] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectLoanTarget, setRejectLoanTarget] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(getUserById(id));
      dispatch(getUserLoans(id));
    }
  }, [dispatch, id]);

  const handleApprove = async (loan) => {
    try {
      setProcessingId(loan.id || loan.loan_id);
      await dispatch(approveLoanApplication(loan.id || loan.loan_id)).unwrap();
      toast.success("Loan approved");
      dispatch(getUserLoans(id));
    } catch (err) {
      toast.error(err || "Failed to approve loan");
    } finally {
      setProcessingId(null);
    }
  };

  const openApproveModal = (loan) => {
    setApproveLoanTarget(loan);
    setApproveModalOpen(true);
  };

  const closeApproveModal = () => {
    setApproveModalOpen(false);
    setApproveLoanTarget(null);
  };

  const confirmApprove = async () => {
    if (!approveLoanTarget) return;
    setApproveModalOpen(false);
    await handleApprove(approveLoanTarget);
    setApproveLoanTarget(null);
  };

  const openRejectModal = (loan) => {
    setRejectLoanTarget(loan);
    setRejectModalOpen(true);
  };

  const closeRejectModal = () => {
    setRejectModalOpen(false);
    setRejectLoanTarget(null);
  };

  const confirmReject = async () => {
    if (!rejectLoanTarget) return;
    setRejectModalOpen(false);
    await handleReject(rejectLoanTarget);
    setRejectLoanTarget(null);
  };

  const handleReject = async (loan) => {
    try {
      setProcessingId(loan.id || loan.loan_id);
      await dispatch(rejectLoanApplication({ loan_id: loan.id || loan.loan_id })).unwrap();
      toast.success("Loan rejected");
      dispatch(getUserLoans(id));
    } catch (err) {
      toast.error(err || "Failed to reject loan");
    } finally {
      setProcessingId(null);
    }
  };

  const columns = useMemo(
    () => [
      { Header: "Loan ID", accessor: "loan_id" },
      {
        Header: "Amount",
        accessor: "loan_capital",
        Cell: ({ value }) => (value != null ? <span className="fw-semibold">₵{Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> : "-"),
      },
      {
        Header: "Interest Rate",
        accessor: "interest_rate",
        Cell: ({ value }) => (value != null ? `${value}%` : "-"),
      },
      {
        Header: "Duration",
        accessor: "loan_duration",
        Cell: ({ value }) => (value != null ? `${value} months` : "-"),
      },
      { Header: "Frequency", accessor: "loan_frequency" },
      { Header: "Purpose", accessor: "purpose" },
      {
        Header: "Status",
        id: "status",
        accessor: "status",
        Filter: StatusColumnFilter,
        showFilterInHeader: false,
        Cell: ({ value }) => {
          if (!value) return "-";
          const status = value.toLowerCase();
          const badgeClass =
            status === "pending_approval"
              ? "bg-warning-subtle text-warning"
              : status === "active"
              ? "bg-success-subtle text-success"
              : status === "closed"
              ? "bg-danger-subtle text-danger"
              : "bg-secondary-subtle text-secondary";
          return <span className={`rounded-pill badge ${badgeClass}`}>{value.replace(/_/g, " ")}</span>;
        },
      },
      {
        Header: "Created",
        accessor: "created_at",
        Cell: ({ value }) => (
          <span className="text-muted">
            {value ? (
              <>
                <span className="fw-bold">{new Date(value).toLocaleDateString()}</span> <small>{new Date(value).toLocaleTimeString()}</small>
              </>
            ) : "-"}
          </span>
        ),
      },
      {
        Header: "Actions",
        id: "actions",
        disableFilters: true,
        Cell: ({ row }) => {
          const isPendingApproval = row.original.status?.toLowerCase() === "pending_approval";
          return (
            <div className="d-flex gap-1">
              <Button
                type="button"
                color="secondary"
                size="sm"
                onClick={() => navigate(`/loan/application-details/${row.original.id || row.original.loan_id}`)}
                title="View Details"
              >
                <i className="mdi mdi-eye-outline"></i>
              </Button>
              <Button
                type="button"
                color="info"
                size="sm"
                onClick={() => navigate(`/loan/audit-logs/${row.original.id || row.original.loan_id}`, { state: { userName: selectedUser?.full_name } })}
                title="View Audit Logs"
              >
                <i className="mdi mdi-history"></i>
              </Button>
              {isPendingApproval && canApproveLoan && (
                <Button
                  type="button"
                  color="success"
                  size="sm"
                  disabled={processingId === (row.original.id || row.original.loan_id)}
                  onClick={() => openApproveModal(row.original)}
                  title="Approve"
                >
                  <i className="mdi mdi-check-outline"></i>
                </Button>
              )}
              {isPendingApproval && canApproveLoan && (
                <Button
                  type="button"
                  color="danger"
                  size="sm"
                  disabled={processingId === (row.original.id || row.original.loan_id)}
                  onClick={() => openRejectModal(row.original)}
                  title="Reject"
                >
                  <i className="mdi mdi-close-outline"></i>
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [navigate, processingId, canApproveLoan]
  );

  const profileImage =
    selectedUser?.photo_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser?.full_name || "User")}&background=0D8ABC&color=fff&size=128`;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="User Loans" pageTitle="Loan Application" />

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
                      <Button color="light" size="sm" onClick={() => navigate(-1)}>
                        Back
                      </Button>
                    </div>
                  </div>
                  <div className="mb-3 d-flex">
                    <div className="avatar-xs d-block flex-shrink-0 me-3">
                      <span className="avatar-title rounded-circle fs-16 bg-body text-body">
                        <i className="ri-id-card-line"></i>
                      </span>
                    </div>
                    <Input type="email" className="form-control" placeholder="User ID" value={selectedUser?.user_id || "-"} disabled />
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
                <CardHeader>
                  <div className="d-flex align-items-center justify-content-between">
                    <h5 className="card-title mb-0">User Loan Applications</h5>
                    <Button color="secondary" size="sm" onClick={() => navigate(-1)}>
                      Back
                    </Button>
                  </div>
                </CardHeader>
                <CardBody>
                  {selectedUserLoading || userLoansLoading ? (
                    <div className="text-center py-5">
                      <Spinner color="primary" />
                    </div>
                  ) : selectedUserError ? (
                    <div className="text-danger py-4">{selectedUserError}</div>
                  ) : userLoansError ? (
                    <div className="text-danger py-4">{userLoansError}</div>
                  ) : (
                    <TableContainer
                      columns={columns}
                      data={Array.isArray(userLoans) ? userLoans : []}
                      isGlobalFilter
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

        <Modal isOpen={approveModalOpen} toggle={closeApproveModal} centered>
          <ModalHeader toggle={closeApproveModal}>Confirm Approval</ModalHeader>
          <ModalBody>
            <hr className="mb-4" />
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="avatar-sm rounded-circle bg-soft-success text-success d-flex align-items-center justify-content-center">
                <i className="mdi mdi-check-outline fs-4"></i>
              </div>
              <div>
                <h5 className="mb-1">Are you sure?</h5>
                <p className="text-muted mb-0">
                  This will officially approve the loan for <strong>{approveLoanTarget?.user?.full_name || "this customer"}</strong>.
                </p>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center pt-3 border-top">
              <span className="text-muted">Amount</span>
              <span className="fw-semibold">
                {approveLoanTarget?.loan_capital != null ? `₵${Number(approveLoanTarget.loan_capital).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "-"}
              </span>
            </div>
          </ModalBody>
          <ModalFooter className="pt-3">
            <Button color="secondary" onClick={closeApproveModal}>
              Cancel
            </Button>
            <Button color="success" onClick={confirmApprove} disabled={!approveLoanTarget || processingId === (approveLoanTarget.id || approveLoanTarget.loan_id)}>
              Approve
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={rejectModalOpen} toggle={closeRejectModal} centered>
          <ModalHeader toggle={closeRejectModal}>Confirm Rejection</ModalHeader>
          <ModalBody>
            <hr className="mb-4" />
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="avatar-sm rounded-circle bg-soft-danger text-danger d-flex align-items-center justify-content-center">
                <i className="mdi mdi-close-circle-outline fs-4"></i>
              </div>
              <div>
                <h5 className="mb-1">Are you sure?</h5>
                <p className="text-muted mb-0">
                  This will officially reject the loan for <strong>{rejectLoanTarget?.user?.full_name || "this customer"}</strong>.
                </p>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center pt-3 border-top">
              <span className="text-muted">Amount</span>
              <span className="fw-semibold">
                {rejectLoanTarget?.loan_capital != null ? `₵${Number(rejectLoanTarget.loan_capital).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "-"}
              </span>
            </div>
          </ModalBody>
          <ModalFooter className="pt-3">
            <Button color="secondary" onClick={closeRejectModal}>
              Cancel
            </Button>
            <Button color="danger" onClick={confirmReject} disabled={!rejectLoanTarget || processingId === (rejectLoanTarget.id || rejectLoanTarget.loan_id)}>
              Reject
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default LoanUserLoans;
