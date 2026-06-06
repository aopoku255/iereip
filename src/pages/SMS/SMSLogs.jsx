import React, { useEffect, useMemo, useState } from "react";
import { Card, CardBody, CardHeader, Col, Container, Row, Spinner } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import { APIClient } from "../../helpers/api_helper";
import { SelectColumnFilter } from "../../Components/Common/filters";

const SMSLogs = () => {
  document.title = "SMS Logs";
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Recipient", accessor: "recipient" },
      { Header: "Message", accessor: "message" },
      {
        Header: "Category",
        accessor: "category",
        Filter: SelectColumnFilter,
        showFilterInHeader: false,
        Cell: ({ value }) => {
          const category = (value || "").toLowerCase();
          const colors = {
            manual: "bg-primary-subtle text-primary",
            broadcast: "bg-success-subtle text-success",
            savings: "bg-warning-subtle text-warning",
            loans: "bg-info-subtle text-info",
            auth: "bg-danger-subtle text-danger",
          };
          return <span className={`badge text-capitalize ${colors[category] || "bg-secondary-subtle text-secondary"}`}>{value || "-"}</span>;
        },
      },
      {
        Header: "Status",
        accessor: "status",
        Filter: SelectColumnFilter,
        showFilterInHeader: false,
        Cell: ({ value }) => (
          <span className={`badge ${value === "sent" ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"}`}>
            {value || "-"}
          </span>
        ),
      },
      {
        Header: "User",
        accessor: (row) => row.user?.name || "-",
      },
      {
        Header: "Sent By",
        accessor: (row) => row.sent_by?.name || "-",
        Cell: ({ value }) => {
          const sender = (value || "").toLowerCase();
          const colors = {
            "super admin": "bg-success-subtle text-success",
            "dept collector": "bg-warning-subtle text-warning",
            manager: "bg-primary-subtle text-primary",
          };
          return <span className={`badge ${colors[sender] || "bg-secondary-subtle text-secondary"}`}>{value || "-"}</span>;
        },
      },
      {
        Header: "Created",
        accessor: "created_at",
        disableFilters: true,
        Cell: ({ value }) => (
          <span className="text-muted">
            {value ? (
              <>
                <span className="fw-bold">{new Date(value).toLocaleDateString()}</span>{" "}
                <small>{new Date(value).toLocaleTimeString()}</small>
              </>
            ) : (
              "-"
            )}
          </span>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError("");
      try {
        const api = new APIClient();
        const response = await api.get("https://iereip-api.deducesolutions.com/api/v1/sms?limit=50&offset=0");
      if (response?.code === "00" && response?.status === "success") {
        setLogs(response.data?.results || []);
      } else {
        setError(response?.message || "Unable to load SMS logs.");
      }
      } catch (err) {
        setError(err?.message || "Unable to load SMS logs.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  document.title = "SMS Logs | IEREIP - Loan Management System";

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="SMS Logs" pageTitle="SMS" />
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <h4 className="card-title mb-0">SMS Logs</h4>
              </CardHeader>
              <CardBody>
                {error ? (
                  <div className="alert alert-danger">{error}</div>
                ) : (
                  <TableContainer
                    columns={columns}
                    data={logs}
                    isGlobalFilter
                    hideHeaderFilters
                    isGlobalSearch
                    topFiltersOnRight
                    customPageSize={10}
                    className="table-striped"
                    tableClass="table table-hover"
                  />
                )}
                {loading && (
                  <div className="text-center py-5">
                    <Spinner color="primary" />
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SMSLogs;
