import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Spinner,
  Table,
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import { CSVLink } from "react-csv";
import "react-toastify/dist/ReactToastify.css";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { getTransactions, getTransactionById } from "../../../slices/savingsAccounts/thunk";

const ListTransactions = () => {
  const dispatch = useDispatch();
  const { transactions, transactionsLoading, transactionsError } = useSelector(
    (state) => state.SavingsAccounts || {
      transactions: [],
      transactionsLoading: false,
      transactionsError: null,
    }
  );

  const { transactionDetails, transactionDetailsLoading, transactionDetailsError } = useSelector(
    (state) => state.SavingsAccounts || {
      transactionDetails: null,
      transactionDetailsLoading: false,
      transactionDetailsError: null,
    }
  );

  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [visibleSensitiveData, setVisibleSensitiveData] = useState({});
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  useEffect(() => {
    dispatch(getTransactions());
  }, [dispatch]);

  useEffect(() => {
    if (transactionsError) {
      toast.error(transactionsError, { position: "top-right", autoClose: 3000 });
    }
  }, [transactionsError]);

  useEffect(() => {
    let filtered = transactions;

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter(
        (t) => t.transaction_type.toLowerCase() === typeFilter.toLowerCase()
      );
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.transaction_id?.toLowerCase().includes(term) ||
          t.user?.full_name?.toLowerCase().includes(term) ||
          t.account_number?.toLowerCase().includes(term) ||
          t.narration?.toLowerCase().includes(term)
      );
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, typeFilter]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter]);

  // Calculate paginated data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of table
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString();
  };

  const toggleSensitiveDataVisibility = (transactionId) => {
    setVisibleSensitiveData((prev) => ({
      ...prev,
      [transactionId]: !prev[transactionId],
    }));
  };

  const maskTransactionId = (id) => {
    if (!id) return "-";
    return "TXN****" + id.slice(-6);
  };

  const maskAccountNumber = (accountNumber) => {
    if (!accountNumber) return "-";
    return "****" + accountNumber.slice(-4);
  };

  const getTransactionIdDisplay = (transaction) => {
    const isVisible = visibleSensitiveData[transaction.id];
    return isVisible ? transaction.transaction_id : maskTransactionId(transaction.transaction_id);
  };

  const getAccountNumberDisplay = (transaction) => {
    const isVisible = visibleSensitiveData[transaction.id];
    return isVisible ? transaction.account_number : maskAccountNumber(transaction.account_number);
  };

  const handleViewTransaction = (transaction) => {
    setSelectedTransactionId(transaction.id);
    dispatch(getTransactionById(transaction.id));
    setIsOffcanvasOpen(true);
  };

  const toggleOffcanvas = () => {
    setIsOffcanvasOpen(!isOffcanvasOpen);
  };

  const getTransactionTypeBadge = (type) => {
    const typeLC = type?.toLowerCase();
    let badgeClass = "bg-secondary-subtle text-secondary";
    let displayText = type;

    switch (typeLC) {
      case "contribution":
        badgeClass = "bg-primary-subtle text-primary";
        displayText = "Contribution";
        break;
      case "first_contribution":
        badgeClass = "bg-success-subtle text-success";
        displayText = "First Contribution";
        break;
      case "withdrawal":
        badgeClass = "bg-warning-subtle text-warning";
        displayText = "Withdrawal";
        break;
      case "booklet":
        badgeClass = "bg-info-subtle text-info";
        displayText = "Booklet";
        break;
      case "early_withdrawal":
        badgeClass = "bg-danger-subtle text-danger";
        displayText = "Early Withdrawal";
        break;
      default:
        displayText = type;
    }

    return <span className={`rounded-pill badge ${badgeClass}`}>{displayText}</span>;
  };

  const getStatusBadge = (isEarlyWithdrawal) => {
    if (isEarlyWithdrawal) {
      return <span className="rounded-pill badge bg-danger-subtle text-danger">Early Withdrawal</span>;
    }
    return <span className="rounded-pill badge bg-success-subtle text-success">Completed</span>;
  };

  // Export Functions
  const prepareExportData = () => {
    return filteredTransactions.map((transaction) => ({
      "#": transaction.id,
      "User": transaction.user?.full_name || "-",
      "Phone": transaction.user?.mobile_number || "-",
      "Transaction ID": transaction.transaction_id || "-",
      "Type": transaction.transaction_type || "-",
      "Amount": `₵${Number(transaction.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      "Account Number": transaction.account_number || "-",
      "Opening Balance": `₵${Number(transaction.opening_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      "Closing Balance": `₵${Number(transaction.closing_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      "Narration": transaction.narration || "-",
      "Date": transaction.created_at ? new Date(transaction.created_at).toLocaleDateString() : "-",
      "Status": transaction.is_early_withdrawal ? "Early Withdrawal" : "Completed",
    }));
  };

  const exportToCSV = () => {
    const element = document.getElementById("csv-export-link-transactions");
    if (element) {
      element.click();
      toast.success("Data exported to CSV successfully!", { position: "top-right", autoClose: 3000 });
      setExportDropdownOpen(false);
    }
  };

  const exportToExcel = () => {
    const element = document.getElementById("excel-export-link-transactions");
    if (element) {
      element.click();
      toast.success("Data exported to Excel successfully!", { position: "top-right", autoClose: 3000 });
      setExportDropdownOpen(false);
    }
  };

  const exportToPDF = () => {
    const element = document.getElementById("pdf-export-link-transactions");
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
          <BreadCrumb title="Transactions" pageTitle="Savings" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Transactions List</h5>
                  <div className="d-flex gap-2">
                    <Dropdown isOpen={exportDropdownOpen} toggle={() => setExportDropdownOpen(!exportDropdownOpen)}>
                      <DropdownToggle color="primary" size="sm" caret>
                        <i className="mdi mdi-download me-1"></i> Export
                      </DropdownToggle>
                      <DropdownMenu end>
                        <DropdownItem onClick={exportToCSV} disabled={!filteredTransactions || filteredTransactions.length === 0}>
                          <i className="mdi mdi-file-delimited me-2"></i> CSV
                        </DropdownItem>
                        <DropdownItem onClick={exportToExcel} disabled={!filteredTransactions || filteredTransactions.length === 0}>
                          <i className="mdi mdi-file-excel me-2"></i> Excel
                        </DropdownItem>
                        <DropdownItem onClick={exportToPDF} disabled={!filteredTransactions || filteredTransactions.length === 0}>
                          <i className="mdi mdi-file-pdf me-2"></i> PDF
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </CardHeader>
                <CardBody>
                  {transactionsLoading ? (
                    <div className="text-center py-5">
                      <Spinner color="primary" />
                      <p className="mt-2">Loading transactions...</p>
                    </div>
                  ) : (
                    <>
                      <Row className="mb-3">
                        <Col md={6}>
                          <div className="mb-3">
                            <label htmlFor="searchInput" className="form-label">
                              Search
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="searchInput"
                              placeholder="Search by transaction ID, user name, account number..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <label htmlFor="typeFilter" className="form-label">
                              Filter by Type
                            </label>
                            <select
                              className="form-select"
                              id="typeFilter"
                              value={typeFilter}
                              onChange={(e) => setTypeFilter(e.target.value)}
                            >
                              <option value="all">All Types</option>
                              <option value="contribution">Contribution</option>
                              <option value="first_contribution">
                                First Contribution
                              </option>
                              <option value="withdrawal">Withdrawal</option>
                              <option value="booklet">Booklet</option>
                              <option value="early_withdrawal">
                                Early Withdrawal
                              </option>
                            </select>
                          </div>
                        </Col>
                      </Row>

                      <div className="table-responsive">
                        <Table className="table table-nowrap table-hover mb-0">
                          <thead>
                            <tr className="border-top">
                              <th>#</th>
                              <th>User</th>
                              <th>Transaction ID</th>
                              <th>Type</th>
                              <th>Amount</th>
                              <th>Account Number</th>
                              <th>Opening Balance</th>
                              <th>Closing Balance</th>
                              <th>Narration</th>
                              <th>Date</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedTransactions && paginatedTransactions.length > 0 ? (
                              paginatedTransactions.map((transaction, index) => (
                                <tr key={transaction.id}>
                                  <td>
                                    <span className="fw-semibold">{indexOfFirstItem + index + 1}</span>
                                  </td>
                                  <td>
                                    <div>
                                      <span className="fw-semibold">
                                        {transaction.user?.full_name}
                                      </span>
                                      <br />
                                      <small className="text-muted">
                                        {transaction.user?.mobile_number}
                                      </small>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="d-flex align-items-center gap-2">
                                      <span className="fw-semibold text-primary">
                                        {getTransactionIdDisplay(transaction)}
                                      </span>
                                      <button
                                        className="btn btn-link p-0"
                                        title={visibleSensitiveData[transaction.id] ? "Hide sensitive data" : "Show sensitive data"}
                                        onClick={() => toggleSensitiveDataVisibility(transaction.id)}
                                      >
                                        <i className={`ri-${visibleSensitiveData[transaction.id] ? "eye-line" : "eye-off-line"}`}></i>
                                      </button>
                                    </div>
                                  </td>
                                  <td>{getTransactionTypeBadge(transaction.transaction_type)}</td>
                                  <td>
                                    <span className="fw-semibold">
                                      ₵{Number(transaction.amount || 0).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      })}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="badge bg-light text-dark">
                                      {getAccountNumberDisplay(transaction)}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="fw-semibold">
                                      ₵{Number(transaction.opening_balance || 0).toLocaleString(
                                        undefined,
                                        {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        }
                                      )}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="fw-semibold">
                                      ₵{Number(transaction.closing_balance || 0).toLocaleString(
                                        undefined,
                                        {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        }
                                      )}
                                    </span>
                                  </td>
                                  <td>
                                    <small className="text-muted">
                                      {transaction.narration || "-"}
                                    </small>
                                  </td>
                                  <td>
                                    <span className="text-muted">
                                      {formatDate(transaction.created_at)}
                                    </span>
                                  </td>
                                  <td>
                                    {getStatusBadge(transaction.is_early_withdrawal)}
                                  </td>
                                  <td>
                                    <button
                                      className="btn btn-sm btn-primary"
                                      onClick={() => handleViewTransaction(transaction)}
                                    >
                                      <i className="ri-eye-line me-1"></i>
                                      View
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="12" className="text-center py-4">
                                  <span className="text-muted">No transactions found</span>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </div>

                      <Row className="mt-3">
                        <Col md={6}>
                          <p className="text-muted">
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredTransactions.length)} of{" "}
                            <strong>{filteredTransactions.length}</strong> transactions
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
                    </>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Transaction Details Offcanvas */}
      <Offcanvas isOpen={isOffcanvasOpen} toggle={toggleOffcanvas} direction="end" className="offcanvas-end">
        <OffcanvasHeader toggle={toggleOffcanvas}>
          Transaction Details
        </OffcanvasHeader>
        <OffcanvasBody>
          {transactionDetailsLoading ? (
            <div className="text-center py-5">
              <Spinner color="primary" />
              <p className="mt-2">Loading transaction details...</p>
            </div>
          ) : transactionDetailsError ? (
            <div className="alert alert-danger" role="alert">
              {transactionDetailsError}
            </div>
          ) : transactionDetails ? (
            <div>
              {/* Transaction Header */}
              <div className="d-flex align-items-center gap-3 mb-4 pb-4 border-bottom">
                <div className="flex-shrink-0">
                  <div className="avatar-lg bg-primary-subtle rounded d-flex align-items-center justify-content-center">
                    <i className="ri-exchange-line fs-3 text-primary"></i>
                  </div>
                </div>
                <div>
                  <span className="rounded-pill badge bg-success-subtle text-success">
                    {transactionDetails.is_early_withdrawal ? "EARLY WITHDRAWAL" : "COMPLETED"}
                  </span>
                </div>
              </div>

              {/* User Information */}
              <div className="mb-4 pb-4 border-bottom">
                <h6 className="fw-bold mb-3">User Information</h6>
                <div className="d-flex align-items-center gap-3">
                  <div className="avatar-md bg-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0">
                    <span className="text-white fw-bold fs-5">
                      {transactionDetails.user?.full_name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="fw-semibold mb-1">{transactionDetails.user?.full_name}</p>
                    <p className="text-muted mb-0 small">{transactionDetails.user?.mobile_number}</p>
                  </div>
                </div>
              </div>

              {/* Transaction Information */}
              <div className="mb-4 pb-4 border-bottom">
                <h6 className="fw-bold mb-3">Transaction Information</h6>
                <div className="row g-4">
                  <div className="col-6">
                    <p className="text-muted small fw-semibold mb-2">Type</p>
                    <span className={`rounded-pill badge ${
                      transactionDetails.transaction_type?.toLowerCase() === "contribution"
                        ? "bg-primary-subtle text-primary"
                        : transactionDetails.transaction_type?.toLowerCase() === "first_contribution"
                        ? "bg-success-subtle text-success"
                        : transactionDetails.transaction_type?.toLowerCase() === "withdrawal"
                        ? "bg-warning-subtle text-warning"
                        : transactionDetails.transaction_type?.toLowerCase() === "booklet"
                        ? "bg-info-subtle text-info"
                        : transactionDetails.transaction_type?.toLowerCase() === "early_withdrawal"
                        ? "bg-danger-subtle text-danger"
                        : "bg-secondary-subtle text-secondary"
                    }`}>
                      {transactionDetails.transaction_type?.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="col-6">
                    <p className="text-muted small fw-semibold mb-2">Amount</p>
                    <p className="fw-semibold mb-0">
                      ₵{Number(transactionDetails.amount || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account & Balance Information */}
              <div className="mb-4 pb-4 border-bottom">
                <h6 className="fw-bold mb-3">Account Details</h6>
                <div className="row g-4">
                  <div className="col-6">
                    <p className="text-muted small fw-semibold mb-2">Account Number</p>
                    <span className="badge bg-light text-dark">{transactionDetails.account_number}</span>
                  </div>
                  <div className="col-6">
                    <p className="text-muted small fw-semibold mb-2">Applied Date</p>
                    <p className="fw-semibold mb-0">
                      {transactionDetails.created_at
                        ? new Date(transactionDetails.created_at).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Balance Information */}
              <div className="mb-4 pb-4 border-bottom">
                <h6 className="fw-bold mb-3">Balance Information</h6>
                <div className="row g-4">
                  <div className="col-6">
                    <p className="text-muted small fw-semibold mb-2">Opening Balance</p>
                    <p className="fw-semibold mb-0">
                      ₵{Number(transactionDetails.opening_balance || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted small fw-semibold mb-2">Closing Balance</p>
                    <p className="fw-semibold mb-0">
                      ₵{Number(transactionDetails.closing_balance || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="mb-4 pb-4 border-bottom">
                <h6 className="fw-bold mb-3">Additional Details</h6>
                <div className="row g-4">
                  <div className="col-6">
                    <p className="text-muted small fw-semibold mb-2">Contribution Number</p>
                    <p className="fw-semibold mb-0">{transactionDetails.contribution_number || "-"}</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted small fw-semibold mb-2">Contribution Amount</p>
                    <p className="fw-semibold mb-0">
                      ₵{Number(transactionDetails.contribution_amount || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
                <div className="row g-4 mt-2">
                  <div className="col-6">
                    <p className="text-muted small fw-semibold mb-2">Frequency</p>
                    <p className="text-capitalize fw-semibold mb-0">{transactionDetails.frequency}</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted small fw-semibold mb-2">Savings Account ID</p>
                    <p className="fw-semibold mb-0">{transactionDetails.savings_account_id}</p>
                  </div>
                </div>
              </div>

              {/* Narration */}
              {transactionDetails.narration && (
                <div className="mb-4 pb-4 border-bottom">
                  <h6 className="fw-bold mb-2">Narration</h6>
                  <p className="text-muted mb-0">{transactionDetails.narration}</p>
                </div>
              )}

              {/* Early Withdrawal Reason */}
              {transactionDetails.is_early_withdrawal && transactionDetails.early_withdrawal_reason && (
                <div className="mb-4 pb-4 border-bottom">
                  <h6 className="fw-bold mb-2">Early Withdrawal Reason</h6>
                  <p className="text-muted mb-0">{transactionDetails.early_withdrawal_reason}</p>
                </div>
              )}

              {/* Branch Information */}
              {transactionDetails.user?.branch && (
                <div>
                  <h6 className="fw-bold mb-3">Branch Information</h6>
                  <div className="card border-0 bg-light">
                    <div className="card-body">
                      <div className="mb-2">
                        <p className="text-muted small fw-semibold mb-1">Branch Name</p>
                        <p className="fw-semibold mb-0">{transactionDetails.user.branch.name}</p>
                      </div>
                      <div className="mb-2">
                        <p className="text-muted small fw-semibold mb-1">Branch Code</p>
                        <p className="fw-semibold mb-0">{transactionDetails.user.branch.code}</p>
                      </div>
                      <div>
                        <p className="text-muted small fw-semibold mb-1">Address</p>
                        <p className="fw-semibold mb-0">{transactionDetails.user.branch.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="alert alert-info" role="alert">
              No transaction details available
            </div>
          )}
        </OffcanvasBody>
      </Offcanvas>

      {/* Hidden Export Links */}
      <CSVLink
        id="csv-export-link-transactions"
        data={prepareExportData()}
        filename={`transactions_${new Date().toISOString().slice(0, 10)}.csv`}
        target="_blank"
        style={{ display: "none" }}
      />
      <CSVLink
        id="excel-export-link-transactions"
        data={prepareExportData()}
        filename={`transactions_${new Date().toISOString().slice(0, 10)}.xlsx`}
        target="_blank"
        style={{ display: "none" }}
      />
      <CSVLink
        id="pdf-export-link-transactions"
        data={prepareExportData()}
        filename={`transactions_${new Date().toISOString().slice(0, 10)}.pdf`}
        target="_blank"
        style={{ display: "none" }}
      />

      <ToastContainer />
    </React.Fragment>
  );
};

export default ListTransactions;
