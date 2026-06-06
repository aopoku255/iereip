import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, Col, Container, Row, Spinner, Table, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import classnames from "classnames";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { getActiveLoanRepayments } from "../../slices/loans/thunk";

const ListRepayments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeLoanRepayments, activeLoanRepaymentsLoading, activeLoanRepaymentsError } = useSelector(
    (state) => state.Loans || {}
  );

  const [filteredRepayments, setFilteredRepayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleSensitiveData, setVisibleSensitiveData] = useState({});
  const [activeTab, setActiveTab] = useState("1");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  useEffect(() => {
    dispatch(getActiveLoanRepayments());
  }, [dispatch]);

  const toggleSensitiveDataVisibility = (repaymentId) => {
    setVisibleSensitiveData((prev) => ({
      ...prev,
      [repaymentId]: !prev[repaymentId],
    }));
  };

  const getTransactionIdDisplay = (repayment) => {
    if (visibleSensitiveData[repayment.id]) {
      return repayment.transaction_id || "-";
    }
    const id = repayment.transaction_id || "";
    if (id.length > 6) {
      return `TXN****${id.slice(-6)}`;
    }
    return "TXN****";
  };

  const getAccountNumberDisplay = (repayment) => {
    if (visibleSensitiveData[repayment.id]) {
      return repayment.account_number || "-";
    }
    const account = repayment.account_number || "";
    if (account.length > 4) {
      return `****${account.slice(-4)}`;
    }
    return "****";
  };

  useEffect(() => {
    if (activeLoanRepaymentsError) {
      toast.error(activeLoanRepaymentsError, { position: "top-right", autoClose: 3000 });
    }
  }, [activeLoanRepaymentsError]);

  // Flatten all repayments from all loans
  const allRepayments = useMemo(() => {
    if (!Array.isArray(activeLoanRepayments)) return [];
    
    const repaymentsList = [];
    activeLoanRepayments.forEach((loan) => {
      if (Array.isArray(loan.repayments)) {
        loan.repayments.forEach((repayment) => {
          repaymentsList.push({
            ...repayment,
            loan_capital: loan.loan_capital,
            user_full_name: loan.user?.full_name,
            user_mobile: loan.user?.mobile_number,
            account_number: loan.account_number,
          });
        });
      }
    });
    return repaymentsList;
  }, [activeLoanRepayments]);

  useEffect(() => {
    let filtered = allRepayments;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.transaction_id?.toLowerCase().includes(term) ||
          r.user_full_name?.toLowerCase().includes(term) ||
          r.account_number?.toLowerCase().includes(term) ||
          r.narration?.toLowerCase().includes(term)
      );
    }

    setFilteredRepayments(filtered);
  }, [allRepayments, searchTerm]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Calculate paginated data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedRepayments = filteredRepayments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRepayments.length / itemsPerPage);

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

  const renderTimeline = () => {
    if (!filteredRepayments || filteredRepayments.length === 0) {
      return (
        <div className="text-center py-4">
          <span className="text-muted">No repayments found</span>
        </div>
      );
    }

    // Sort repayments by date in descending order
    const sortedRepayments = [...filteredRepayments].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    return (
      <div className="timeline">
        {sortedRepayments.map((repayment, index) => (
          <div key={repayment.id} className="timeline-item">
            <div className="d-flex">
              <div className="timeline-label" style={{ minWidth: "120px" }}>
                <small className="text-muted">{formatDate(repayment.created_at)}</small>
              </div>
              <div className="timeline-content flex-grow-1">
                <div className="card border-primary">
                  <div className="card-body">
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <h6 className="card-subtitle mb-2 text-muted">Customer</h6>
                        <p className="card-text fw-semibold">{repayment.user_full_name}</p>
                        <p className="card-text text-muted small">{repayment.user_mobile}</p>
                      </div>
                      <div className="col-md-6">
                        <h6 className="card-subtitle mb-2 text-muted">Transaction ID</h6>
                        <div className="d-flex align-items-center gap-2">
                          <span className="fw-semibold text-primary">{getTransactionIdDisplay(repayment)}</span>
                          <button
                            className="btn btn-link p-0"
                            title={visibleSensitiveData[repayment.id] ? "Hide sensitive data" : "Show sensitive data"}
                            onClick={() => toggleSensitiveDataVisibility(repayment.id)}
                          >
                            <i className={`ri-${visibleSensitiveData[repayment.id] ? "eye-line" : "eye-off-line"}`}></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-3">
                        <h6 className="card-subtitle mb-2 text-muted">Amount</h6>
                        <p className="card-text fw-semibold">
                          ₵{Number(repayment.amount || 0).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <div className="col-md-3">
                        <h6 className="card-subtitle mb-2 text-muted">Account Number</h6>
                        <span className="badge bg-light text-dark">{getAccountNumberDisplay(repayment)}</span>
                      </div>
                      <div className="col-md-3">
                        <h6 className="card-subtitle mb-2 text-muted">Opening Balance</h6>
                        <p className="card-text small">
                          ₵{Number(repayment.opening_balance || 0).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <div className="col-md-3">
                        <h6 className="card-subtitle mb-2 text-muted">Closing Balance</h6>
                        <p className="card-text small">
                          ₵{Number(repayment.closing_balance || 0).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>

                    {repayment.narration && (
                      <div className="row">
                        <div className="col-12">
                          <h6 className="card-subtitle mb-2 text-muted">Narration</h6>
                          <p className="card-text text-muted small">{repayment.narration}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Repayments" pageTitle="Loans" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader className="border-bottom-dashed pb-3">
                  <Row className="align-items-center">
                    <Col sm={4}>
                      <Nav tabs className="nav-tabs-custom nav-custom-light border-0">
                        <NavItem>
                          <NavLink
                            href="#"
                            className={classnames({ active: activeTab === "1" })}
                            onClick={(e) => {
                              e.preventDefault();
                              toggleTab("1");
                            }}
                          >
                            <i className="ri-list-view me-2"></i>List View
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            href="#"
                            className={classnames({ active: activeTab === "2" })}
                            onClick={(e) => {
                              e.preventDefault();
                              toggleTab("2");
                            }}
                          >
                            <i className="ri-timeline-view me-2"></i>Timeline
                          </NavLink>
                        </NavItem>
                      </Nav>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  {activeLoanRepaymentsLoading ? (
                    <div className="text-center py-5">
                      <Spinner color="primary" />
                      <p className="mt-2">Loading repayments...</p>
                    </div>
                  ) : activeLoanRepaymentsError ? (
                    <div className="alert alert-danger" role="alert">
                      {activeLoanRepaymentsError}
                    </div>
                  ) : (
                    <>
                      <Row className="mb-3">
                        <Col md={12}>
                          <div className="mb-3">
                            <label htmlFor="searchInput" className="form-label">
                              Search
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="searchInput"
                              placeholder="Search by transaction ID, customer name, account number..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                        </Col>
                      </Row>

                      <TabContent activeTab={activeTab}>
                        <TabPane tabId="1">
                          <div className="table-responsive">
                            <Table className="table table-nowrap table-hover mb-0">
                              <thead>
                                <tr className="border-top">
                                  <th>#</th>
                                  <th>Customer Name</th>
                                  <th>Transaction ID</th>
                                  <th>Amount</th>
                                  <th>Account Number</th>
                                  <th>Opening Balance</th>
                                  <th>Closing Balance</th>
                                  <th>Narration</th>
                                  <th>Date</th>
                                </tr>
                              </thead>
                              <tbody>
                                {paginatedRepayments && paginatedRepayments.length > 0 ? (
                                  paginatedRepayments.map((repayment, index) => (
                                    <tr key={repayment.id}>
                                      <td>
                                        <span className="fw-semibold">{indexOfFirstItem + index + 1}</span>
                                      </td>
                                      <td>
                                        <div>
                                          <span className="fw-semibold">
                                            {repayment.user_full_name}
                                          </span>
                                          <br />
                                          <small className="text-muted">
                                            {repayment.user_mobile}
                                          </small>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center gap-2">
                                          <span className="fw-semibold text-primary">
                                            {getTransactionIdDisplay(repayment)}
                                          </span>
                                          <button
                                            className="btn btn-link p-0"
                                            title={visibleSensitiveData[repayment.id] ? "Hide sensitive data" : "Show sensitive data"}
                                            onClick={() => toggleSensitiveDataVisibility(repayment.id)}
                                          >
                                            <i className={`ri-${visibleSensitiveData[repayment.id] ? "eye-line" : "eye-off-line"}`}></i>
                                          </button>
                                        </div>
                                      </td>
                                      <td>
                                        <span className="fw-semibold">
                                          ₵{Number(repayment.amount || 0).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                          })}
                                        </span>
                                      </td>
                                      <td>
                                        <span className="badge bg-light text-dark">
                                          {getAccountNumberDisplay(repayment)}
                                        </span>
                                      </td>
                                      <td>
                                        <span className="fw-semibold">
                                          ₵{Number(repayment.opening_balance || 0).toLocaleString(
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
                                          ₵{Number(repayment.closing_balance || 0).toLocaleString(
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
                                          {repayment.narration || "-"}
                                        </small>
                                      </td>
                                      <td>
                                        <span className="text-muted">
                                          {formatDate(repayment.created_at)}
                                        </span>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="9" className="text-center py-4">
                                      <span className="text-muted">No repayments found</span>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </Table>
                          </div>

                          <Row className="mt-3">
                            <Col md={6}>
                              <p className="text-muted">
                                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredRepayments.length)} of{" "}
                                <strong>{filteredRepayments.length}</strong> repayments
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
                        </TabPane>

                        <TabPane tabId="2">
                          {renderTimeline()}
                          <Row className="mt-3">
                            <Col>
                              <p className="text-muted">
                                Total Repayments: <strong>{filteredRepayments.length}</strong>
                              </p>
                            </Col>
                          </Row>
                        </TabPane>
                      </TabContent>
                    </>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  );
};

export default ListRepayments;
