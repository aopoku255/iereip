import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Spinner,
  Table,
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

const SavingsAccountStatement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { statementData } = location.state || {};

  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  useEffect(() => {
    if (!statementData) {
      toast.error("No statement data available", { position: "top-right", autoClose: 3000 });
      navigate(-1);
    }
  }, [statementData, navigate]);

  // Export Functions
  const prepareExportData = () => {
    if (!statementData?.transactions || statementData.transactions.length === 0) {
      return [];
    }

    return statementData.transactions.map((transaction) => ({
      "Transaction ID": transaction.transaction_id || "-",
      "Type": transaction.transaction_type?.replace(/_/g, " ") || "-",
      "Amount": `₵${Number(transaction.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      "Opening Balance": `₵${Number(transaction.opening_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      "Closing Balance": `₵${Number(transaction.closing_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      "Date": transaction.created_at ? new Date(transaction.created_at).toLocaleDateString() : "-",
      "Narration": transaction.narration || "-",
    }));
  };

  const exportToCSV = () => {
    const element = document.getElementById("csv-export-link-statement");
    if (element) {
      element.click();
      toast.success("Statement exported to CSV successfully!", { position: "top-right", autoClose: 3000 });
      setExportDropdownOpen(false);
    }
  };

  const exportToExcel = () => {
    const element = document.getElementById("excel-export-link-statement");
    if (element) {
      element.click();
      toast.success("Statement exported to Excel successfully!", { position: "top-right", autoClose: 3000 });
      setExportDropdownOpen(false);
    }
  };

  const exportToPDF = () => {
    const element = document.getElementById("pdf-export-link-statement");
    if (element) {
      element.click();
      toast.success("Statement exported to PDF successfully!", { position: "top-right", autoClose: 3000 });
      setExportDropdownOpen(false);
    }
  };

  if (!statementData) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="text-center py-5">
            <Spinner color="primary" />
            <p className="mt-2">Loading statement...</p>
          </div>
        </Container>
      </div>
    );
  }

  const account = statementData.account;
  const user = statementData.user;
  const transactions = statementData.transactions || [];
  const totalTransactions = statementData.total_transactions || 0;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Savings Account Statement" pageTitle="Savings" />

          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">Savings Account Statement</h5>
                    <small className="text-muted">
                      Account: {account?.account_number} | User: {user?.full_name}
                    </small>
                  </div>
                  <div className="d-flex gap-2">
                    <Dropdown isOpen={exportDropdownOpen} toggle={() => setExportDropdownOpen(!exportDropdownOpen)}>
                      <DropdownToggle color="primary" size="sm" caret>
                        <i className="mdi mdi-download me-1"></i> Export
                      </DropdownToggle>
                      <DropdownMenu end>
                        <DropdownItem onClick={exportToCSV} disabled={!transactions || transactions.length === 0}>
                          <i className="mdi mdi-file-delimited me-2"></i> CSV
                        </DropdownItem>
                        <DropdownItem onClick={exportToExcel} disabled={!transactions || transactions.length === 0}>
                          <i className="mdi mdi-file-excel me-2"></i> Excel
                        </DropdownItem>
                        <DropdownItem onClick={exportToPDF} disabled={!transactions || transactions.length === 0}>
                          <i className="mdi mdi-file-pdf me-2"></i> PDF
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    <Button color="secondary" size="sm" onClick={() => navigate(-1)}>
                      <i className="mdi mdi-arrow-left me-1"></i> Back
                    </Button>
                  </div>
                </CardHeader>

                <CardBody>
                  {/* Statement Period and Summary */}
                  <Row className="mb-4">
                    <Col md={3}>
                      <div className="card bg-light">
                        <div className="card-body">
                          <div className="text-center">
                            <p className="text-muted mb-2">Start Date</p>
                            <h5 className="mb-0">
                              {statementData.statement_period?.start_date
                                ? new Date(statementData.statement_period.start_date).toLocaleDateString()
                                : "-"}
                            </h5>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="card bg-light">
                        <div className="card-body">
                          <div className="text-center">
                            <p className="text-muted mb-2">End Date</p>
                            <h5 className="mb-0">
                              {statementData.statement_period?.end_date
                                ? new Date(statementData.statement_period.end_date).toLocaleDateString()
                                : "-"}
                            </h5>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="card bg-light">
                        <div className="card-body">
                          <div className="text-center">
                            <p className="text-muted mb-2">Total Transactions</p>
                            <h5 className="mb-0">{totalTransactions}</h5>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="card bg-light">
                        <div className="card-body">
                          <div className="text-center">
                            <p className="text-muted mb-2">Account Balance</p>
                            <h5 className="mb-0">
                              ₵
                              {Number(account?.balance || 0).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </h5>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  {/* Account Info */}
                  <Row className="mb-4">
                    <Col md={6}>
                      <div className="card">
                        <div className="card-body">
                          <h6 className="card-title mb-3">Account Information</h6>
                          <div className="mb-2">
                            <small className="text-muted">Account Number</small>
                            <p className="fw-semibold mb-0">{account?.account_number || "-"}</p>
                          </div>
                          <div className="mb-2">
                            <small className="text-muted">Contribution Amount</small>
                            <p className="fw-semibold mb-0">
                              ₵
                              {Number(account?.contribution_amount || 0).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                          </div>
                          <div className="mb-2">
                            <small className="text-muted">Frequency</small>
                            <p className="fw-semibold mb-0 text-capitalize">{account?.frequency || "-"}</p>
                          </div>
                          <div className="mb-2">
                            <small className="text-muted">Status</small>
                            <p className="mb-0">
                              {account?.is_active ? (
                                <span className="badge bg-success-subtle text-success">Active</span>
                              ) : (
                                <span className="badge bg-danger-subtle text-danger">Inactive</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="card">
                        <div className="card-body">
                          <h6 className="card-title mb-3">User Information</h6>
                          <div className="mb-2">
                            <small className="text-muted">Full Name</small>
                            <p className="fw-semibold mb-0">{user?.full_name || "-"}</p>
                          </div>
                          <div className="mb-2">
                            <small className="text-muted">User ID</small>
                            <p className="fw-semibold mb-0">{user?.user_id || "-"}</p>
                          </div>
                          <div className="mb-2">
                            <small className="text-muted">Email</small>
                            <p className="fw-semibold mb-0">{user?.email || "-"}</p>
                          </div>
                          <div className="mb-2">
                            <small className="text-muted">Phone</small>
                            <p className="fw-semibold mb-0">{user?.mobile_number || "-"}</p>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  {/* Transactions Table */}
                  <div className="card">
                    <div className="card-body">
                      <h6 className="card-title mb-3">Transactions</h6>
                      {transactions && transactions.length > 0 ? (
                        <div className="table-responsive">
                          <Table hover size="sm">
                            <thead>
                              <tr className="border-top">
                                <th>#</th>
                                <th>Transaction ID</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Opening Balance</th>
                                <th>Closing Balance</th>
                                <th>Date & Time</th>
                                <th>Narration</th>
                              </tr>
                            </thead>
                            <tbody>
                              {transactions.map((transaction, idx) => (
                                <tr key={transaction.id}>
                                  <td>{idx + 1}</td>
                                  <td>
                                    <small className="text-primary fw-semibold">{transaction.transaction_id}</small>
                                  </td>
                                  <td>
                                    <span className="badge bg-primary-subtle text-primary text-capitalize">
                                      {transaction.transaction_type?.replace(/_/g, " ") || "-"}
                                    </span>
                                  </td>
                                  <td className="fw-semibold">
                                    ₵
                                    {Number(transaction.amount || 0).toLocaleString(undefined, {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                                  </td>
                                  <td>
                                    ₵
                                    {Number(transaction.opening_balance || 0).toLocaleString(undefined, {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                                  </td>
                                  <td className="fw-semibold">
                                    ₵
                                    {Number(transaction.closing_balance || 0).toLocaleString(undefined, {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                                  </td>
                                  <td>
                                    <small className="text-muted">
                                      {transaction.created_at
                                        ? new Date(transaction.created_at).toLocaleString()
                                        : "-"}
                                    </small>
                                  </td>
                                  <td>
                                    <small className="text-muted">{transaction.narration || "-"}</small>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      ) : (
                        <p className="text-muted text-center py-4">No transactions found for the selected period.</p>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Hidden Export Links */}
      <CSVLink
        id="csv-export-link-statement"
        data={prepareExportData()}
        filename={`statement_${account?.account_number}_${new Date().toISOString().slice(0, 10)}.csv`}
        target="_blank"
        style={{ display: "none" }}
      />
      <CSVLink
        id="excel-export-link-statement"
        data={prepareExportData()}
        filename={`statement_${account?.account_number}_${new Date().toISOString().slice(0, 10)}.xlsx`}
        target="_blank"
        style={{ display: "none" }}
      />
      <CSVLink
        id="pdf-export-link-statement"
        data={prepareExportData()}
        filename={`statement_${account?.account_number}_${new Date().toISOString().slice(0, 10)}.pdf`}
        target="_blank"
        style={{ display: "none" }}
      />

      <ToastContainer />
    </React.Fragment>
  );
};

export default SavingsAccountStatement;
