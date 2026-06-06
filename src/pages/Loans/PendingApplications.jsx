import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, Col, Container, Row, Spinner, Button, Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import { usePermission } from "../../hooks/usePermission";
import { StatusColumnFilter } from "../../Components/Common/filters";
import { getPendingLoanApplications, approveLoanApplication, rejectLoanApplication } from "../../slices/loans/thunk";
import { toast } from "react-toastify";

const PendingApplications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const canApproveLoan = usePermission("approve_loans");
  const { pendingLoans, pendingLoansLoading, pendingLoansError } = useSelector((state) => state.Loans || {});
  const [processingId, setProcessingId] = useState(null);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [approveLoanTarget, setApproveLoanTarget] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectLoanTarget, setRejectLoanTarget] = useState(null);

  useEffect(() => {
    dispatch(getPendingLoanApplications());
  }, [dispatch]);

  const handleApprove = async (loan) => {
    try {
      setProcessingId(loan.id || loan.loan_id);
      await dispatch(approveLoanApplication(loan.id || loan.loan_id)).unwrap();
      toast.success("Loan approved");
      dispatch(getPendingLoanApplications());
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
      dispatch(getPendingLoanApplications());
    } catch (err) {
      toast.error(err || "Failed to reject loan");
    } finally {
      setProcessingId(null);
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "User",
        accessor: "user.full_name",
        Cell: ({ row }) => {
          const user = row.original.user || {};
          return <div className="fw-semibold">{user.full_name || "-"}</div>;
        },
      },
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
        Cell: ({ row }) => (
          <div className="d-flex gap-1">
            <Button
              type="button"
              color="secondary"
              size="sm"
              onClick={() => navigate(`/loan/user-loans/${row.original.user?.id}`)}
              title="View"
            >
              <i className="mdi mdi-eye-outline"></i>
            </Button>
            {canApproveLoan && (
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
            {canApproveLoan && (
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
        ),
      },
    ],
    [navigate, processingId]
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Pending Applications" pageTitle="Loan Application" />
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader className="align-items-center d-flex">
                  <h4 className="card-title mb-0">Pending Loan Applications</h4>
                </CardHeader>
                <CardBody>
                  {pendingLoansLoading ? (
                    <div className="text-center py-5">
                      <Spinner color="primary" />
                    </div>
                  ) : pendingLoansError ? (
                    <div className="text-danger py-4">{pendingLoansError}</div>
                  ) : (
                    <TableContainer
                      columns={columns}
                      data={Array.isArray(pendingLoans) ? pendingLoans : []}
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
        </Container>
      </div>
    </React.Fragment>
  );
};

export default PendingApplications;
