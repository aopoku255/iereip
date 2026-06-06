import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, Col, Container, Row, Spinner, Table, Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { getApprovedLoanApplications, getLoanApplicationById, createLoanRepayment } from "../../slices/loans/thunk";

const ActiveLoans = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { approvedLoans, approvedLoansLoading } = useSelector((state) => state.Loans || {});
  const { selectedLoan, selectedLoanLoading } = useSelector((state) => state.Loans || {});

  const [filteredLoans, setFilteredLoans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [repaymentModalOpen, setRepaymentModalOpen] = useState(false);
  const [repaymentForm, setRepaymentForm] = useState({ amount: "", narration: "" });
  const [submittingRepayment, setSubmittingRepayment] = useState(false);
  const [repaymentError, setRepaymentError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    dispatch(getApprovedLoanApplications());
  }, [dispatch]);

  useEffect(() => {
    if (approvedLoans && Array.isArray(approvedLoans)) {
      // Apply search filter
      const filtered = approvedLoans.filter((loan) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          (loan.user?.full_name && loan.user.full_name.toLowerCase().includes(searchLower)) ||
          (loan.loan_id && loan.loan_id.toString().includes(searchLower)) ||
          (loan.user?.mobile_number && loan.user.mobile_number.includes(searchLower))
        );
      });

      setFilteredLoans(filtered);
    }
  }, [approvedLoans, searchTerm]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Calculate paginated data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedLoans = filteredLoans.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLoans.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewLoan = (loanId) => {
    dispatch(getLoanApplicationById(loanId));
    setRepaymentModalOpen(true);
    setRepaymentForm({ amount: "", narration: "" });
    setRepaymentError("");
  };

  const handleRepaymentChange = (e) => {
    const { name, value } = e.target;
    setRepaymentForm((s) => ({ ...s, [name]: value }));
    if (repaymentError) {
      setRepaymentError("");
    }
  };

  const handleSubmitRepayment = async () => {
    if (!repaymentForm.amount || !repaymentForm.narration) {
      setRepaymentError("Amount and narration are required");
      return;
    }

    setSubmittingRepayment(true);
    const result = await dispatch(
      createLoanRepayment({
        loan_id: selectedLoan?.id,
        amount: parseFloat(repaymentForm.amount),
        narration: repaymentForm.narration,
      })
    );

    setSubmittingRepayment(false);

    if (result.payload && !result.payload.code) {
      toast.success("Repayment created successfully!");
      setRepaymentModalOpen(false);
      setRepaymentForm({ amount: "", narration: "" });
      // Refresh the loans list
      dispatch(getApprovedLoanApplications());
    } else {
      setRepaymentError(result.payload?.message || "Failed to create repayment");
    }
  };

  const toggleRepaymentModal = () => {
    setRepaymentModalOpen(!repaymentModalOpen);
    if (repaymentModalOpen) {
      setRepaymentForm({ amount: "", narration: "" });
      setRepaymentError("");
    }
  };

  const getStatusBadge = (status) => {
    if (!status) return null;
    const statusLower = status.toLowerCase();
    const badgeClass = statusLower === "active" ? "bg-success-subtle text-success" : "bg-warning-subtle text-warning";
    return <span className={`badge rounded-pill ${badgeClass}`}>{status}</span>;
  };

  const getPaymentProgress = (loan) => {
    const totalRepayable = loan.total_repayable || 0;
    if (totalRepayable === 0) return 0;
    const percentage = Math.round((loan.total_paid / totalRepayable) * 100);
    return Math.min(percentage, 100);
  };

  const renderPaymentProgressBar = (loan) => {
    const percentage = getPaymentProgress(loan);
    const remaining = 100 - percentage;

    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ flex: 1, height: "24px", backgroundColor: "#f0f0f0", borderRadius: "4px", overflow: "hidden", display: "flex" }}>
          <div
            style={{
              width: `${percentage}%`,
              backgroundColor: "#28a745",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: "bold",
              color: "white",
            }}
          >
            {percentage > 10 ? `${percentage}%` : ""}
          </div>
          <div
            style={{
              width: `${remaining}%`,
              backgroundColor: "#f8d7da",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: "bold",
              color: "#721c24",
            }}
          >
            {remaining > 10 ? `${remaining}%` : ""}
          </div>
        </div>
      </div>
    );
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Active Loans" pageTitle="Loans" />

          <Row>
            <Col xs="12">
              <Card>
                <CardHeader className="d-flex align-items-center justify-content-between">
                  <h4 className="mb-0">Active Loans List</h4>
                </CardHeader>
                <CardBody>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by customer name, loan ID, or phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {approvedLoansLoading ? (
                    <div className="text-center">
                      <Spinner color="primary" />
                    </div>
                  ) : filteredLoans && filteredLoans.length > 0 ? (
                    <div className="table-responsive">
                      <Table className="table table-nowrap table-hover mb-0">
                        <thead className="border-top">
                          <tr>
                            <th>#</th>
                            <th>Customer Name</th>
                            <th>Loan ID</th>
                            <th>Purpose</th>
                            <th>Capital</th>
                            <th>Interest Rate</th>
                            <th>Tenure</th>
                            <th>Amount Paid</th>
                            <th>Outstanding Amount</th>
                            <th>Due Date</th>
                            <th>Payment Progress</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedLoans.map((loan, index) => (
                            <tr key={loan.id || index}>
                              <td>{indexOfFirstItem + index + 1}</td>
                              <td>
                                <div>
                                  <p className="mb-0">{loan.user?.full_name || "-"}</p>
                                  <small className="text-muted">{loan.user?.mobile_number || "-"}</small>
                                </div>
                              </td>
                              <td>
                                <span className="badge bg-primary-subtle text-primary">
                                  {loan.loan_id || "-"}
                                </span>
                              </td>
                              <td>{loan.purpose || "-"}</td>
                              <td>₵{(loan.loan_capital || 0).toLocaleString()}</td>
                              <td>{loan.interest_rate ? `${loan.interest_rate}%` : "-"}</td>
                              <td>{loan.loan_duration ? `${loan.loan_duration} ${loan.loan_frequency}` : "-"}</td>
                              <td>₵{(loan.total_paid || 0).toLocaleString()}</td>
                              <td>₵{(loan.outstanding_balance || 0).toLocaleString()}</td>
                              <td>{loan.end_date ? new Date(loan.end_date).toLocaleDateString() : "-"}</td>
                              <td>{renderPaymentProgressBar(loan)}</td>
                              <td>{getStatusBadge(loan.status)}</td>
                              <td>
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() => handleViewLoan(loan.id)}
                                  title="Add Repayment"
                                >
                                  <i className="ri-add-circle-line me-1"></i> Add Repayment
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted">No active loans found.</p>
                    </div>
                  )}
                  {paginatedLoans && paginatedLoans.length > 0 && (
                    <Row className="mt-3">
                      <Col md={6}>
                        <p className="text-muted">
                          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredLoans.length)} of{" "}
                          <strong>{filteredLoans.length}</strong> loans
                        </p>
                      </Col>
                      <Col md={6} className="d-flex justify-content-end">
                        <nav>
                          <ul className="pagination mb-0">
                            <li className="page-item">
                              <button
                                className="page-link"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                              >
                                Previous
                              </button>
                            </li>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                              <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                                <button
                                  className="page-link"
                                  onClick={() => handlePageChange(page)}
                                >
                                  {page}
                                </button>
                              </li>
                            ))}
                            <li className="page-item">
                              <button
                                className="page-link"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                              >
                                Next
                              </button>
                            </li>
                          </ul>
                        </nav>
                      </Col>
                    </Row>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <Modal isOpen={repaymentModalOpen} toggle={toggleRepaymentModal} size="md" centered>
        <ModalHeader toggle={toggleRepaymentModal}>
          Add Repayment - {selectedLoan?.loan_id}
        </ModalHeader>
        <ModalBody>
          {selectedLoanLoading ? (
            <div className="text-center">
              <Spinner color="primary" />
            </div>
          ) : (
            <Form>
              <FormGroup>
                <Label for="repaymentAmount">Amount</Label>
                <Input
                  type="number"
                  name="amount"
                  id="repaymentAmount"
                  placeholder="Enter amount"
                  value={repaymentForm.amount}
                  onChange={handleRepaymentChange}
                  step="0.01"
                  min="0"
                />
              </FormGroup>
              <FormGroup>
                <Label for="repaymentNarration">Narration</Label>
                <Input
                  type="textarea"
                  name="narration"
                  id="repaymentNarration"
                  placeholder="Enter narration"
                  value={repaymentForm.narration}
                  onChange={handleRepaymentChange}
                  rows="3"
                />
              </FormGroup>
              {repaymentError && (
                <div className="alert alert-danger" role="alert">
                  {repaymentError}
                </div>
              )}
            </Form>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleRepaymentModal}>
            Cancel
          </Button>
          <Button
            color="success"
            onClick={handleSubmitRepayment}
            disabled={submittingRepayment || selectedLoanLoading}
          >
            {submittingRepayment ? (
              <>
                <Spinner size="sm" className="me-2" />
                Submitting...
              </>
            ) : (
              "Submit Repayment"
            )}
          </Button>
        </ModalFooter>
      </Modal>

      <ToastContainer closeButton={false} limit={1} />
    </React.Fragment>
  );
};

export default ActiveLoans;
