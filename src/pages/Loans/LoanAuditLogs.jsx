import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Card, CardBody, CardHeader, Col, Container, Row, Spinner, Button, Badge } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import { getLoanAuditLogs } from "../../slices/loans/thunk";

const LoanAuditLogs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loanId } = useParams();
  const userName = location.state?.userName || "User";
  const { loanAuditLogs, loanAuditLogsLoading, loanAuditLogsError } = useSelector(
    (state) => state.Loans || {
      loanAuditLogs: [],
      loanAuditLogsLoading: false,
      loanAuditLogsError: null,
    }
  );

  useEffect(() => {
    if (loanId) {
      dispatch(getLoanAuditLogs(loanId));
    }
  }, [dispatch, loanId]);

  useEffect(() => {
    if (loanAuditLogsError) {
      toast.error(loanAuditLogsError, { position: "top-right", autoClose: 3000 });
    }
  }, [loanAuditLogsError]);

  const columns = useMemo(
    () => [
      {
        Header: "Admin",
        accessor: "performed_by_name",
        Cell: ({ value }) => <span className="fw-semibold">{value || "-"}</span>,
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ value }) => {
          const formatted = value?.replace(/_/g, " ")?.replace(".", " > ") || "-";
          return (
            <Badge bg="info-subtle" text="info" className="text-capitalize">
              {formatted}
            </Badge>
          );
        },
      },
      {
        Header: "Description",
        accessor: "description",
        Cell: ({ value }) => (
          <div className="text-truncate" title={value}>
            {value || "-"}
          </div>
        ),
      },
      {
        Header: "Date & Time",
        accessor: "created_at",
        Cell: ({ value }) => (
          <div>
            <div className="fw-semibold">
              {value ? new Date(value).toLocaleDateString() : "-"}
            </div>
            <small className="text-muted">
              {value ? new Date(value).toLocaleTimeString() : "-"}
            </small>
          </div>
        ),
      },
    ],
    []
  );

  const data = useMemo(
    () => (Array.isArray(loanAuditLogs) ? loanAuditLogs : []),
    [loanAuditLogs]
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Loan Audit Logs" pageTitle="Loans" />

          <Row>
            <Col xs={12}>
              <Card>
                <CardHeader className="align-items-center d-flex justify-content-between">
                  <h4 className="card-title mb-0">Logs for {userName}</h4>
                  <Button color="secondary" size="sm" onClick={() => navigate(-1)}>
                    Back
                  </Button>
                </CardHeader>
                <CardBody>
                  {loanAuditLogsLoading ? (
                    <div className="text-center py-5">
                      <Spinner color="primary" />
                    </div>
                  ) : loanAuditLogsError ? (
                    <div className="text-danger py-4">{loanAuditLogsError}</div>
                  ) : (
                    <TableContainer
                      columns={columns}
                      data={data}
                      isGlobalFilter={false}
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

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </React.Fragment>
  );
};

export default LoanAuditLogs;
