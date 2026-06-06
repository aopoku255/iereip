import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, Col, Container, Row, Spinner, Button } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import { StatusColumnFilter } from "../../Components/Common/filters";
import { getApprovedLoanApplications } from "../../slices/loans/thunk";

const ApprovedApplications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { approvedLoans, approvedLoansLoading, approvedLoansError } = useSelector((state) => state.Loans || {});

  useEffect(() => {
    dispatch(getApprovedLoanApplications());
  }, [dispatch]);

  const columns = useMemo(
    () => [
      {
        Header: "User",
        accessor: "user.full_name",
        Cell: ({ value, row }) => {
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
          <Button
            type="button"
            color="secondary"
            size="sm"
            onClick={() => navigate(`/loan/user-loans/${row.original.user?.id}`)}
            title="View"
          >
            <i className="mdi mdi-eye-outline"></i>
          </Button>
        ),
      },
    ],
    [navigate]
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Approved Applications" pageTitle="Loan Application" />
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader className="align-items-center d-flex">
                  <h4 className="card-title mb-0">Approved Loan Applications</h4>
                </CardHeader>
                <CardBody>
                  {approvedLoansLoading ? (
                    <div className="text-center py-5">
                      <Spinner color="primary" />
                    </div>
                  ) : approvedLoansError ? (
                    <div className="text-danger py-4">{approvedLoansError}</div>
                  ) : (
                    <TableContainer
                      columns={columns}
                      data={Array.isArray(approvedLoans) ? approvedLoans : []}
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
      </div>
    </React.Fragment>
  );
};

export default ApprovedApplications;
