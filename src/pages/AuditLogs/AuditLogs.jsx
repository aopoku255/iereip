import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Spinner,
  Badge,
  Button,
  Input,
  FormGroup,
  Label,
} from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import { getAuditLogs } from "../../slices/audit/thunk";

const AuditLogs = () => {
  const dispatch = useDispatch();
  const { auditLogs, loading, error, total } = useSelector((state) => state.Audit || {
    auditLogs: [],
    loading: false,
    error: null,
    total: 0,
  });

  const [filters, setFilters] = useState({
    module: "",
    admin_id: "",
    entity_type: "",
    entity_id: "",
    limit: 10,
    offset: 0,
  });

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-right", autoClose: 3000 });
    }
  }, [error]);

  const fetchAuditLogs = (pageFilters = filters) => {
    const params = {
      limit: pageFilters.limit,
      offset: pageFilters.offset,
    };

    if (pageFilters.module) params.module = pageFilters.module;
    if (pageFilters.admin_id) params.admin_id = pageFilters.admin_id;
    if (pageFilters.entity_type) params.entity_type = pageFilters.entity_type;
    if (pageFilters.entity_id) params.entity_id = pageFilters.entity_id;

    dispatch(getAuditLogs(params));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, offset: 0 }));
  };

  const handleApplyFilters = () => {
    fetchAuditLogs();
  };

  const handleResetFilters = () => {
    const resetFilters = {
      module: "",
      admin_id: "",
      entity_type: "",
      entity_id: "",
      limit: 10,
      offset: 0,
    };
    setFilters(resetFilters);
    dispatch(getAuditLogs({ limit: 10, offset: 0 }));
  };

  const columns = useMemo(
    () => [
      {
        Header: "Admin",
        accessor: "admin_name",
        Cell: ({ value }) => <span className="fw-semibold">{value || "-"}</span>,
      },
      {
        Header: "Module",
        accessor: "module",
        Cell: ({ value }) => (
          <Badge bg="info-subtle" text="info" className="text-capitalize">
            {value || "-"}
          </Badge>
        ),
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ value }) => {
          const formatted = value?.replace(/_/g, " ")?.replace(".", " > ") || "-";
          return <span className="text-capitalize">{formatted}</span>;
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
        Header: "Entity Type",
        accessor: "entity_type",
        Cell: ({ value }) => {
          const formatted = value
            ? value.replace(/_/g, " ").split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
            : "-";
          return <span>{formatted}</span>;
        },
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

  const data = useMemo(() => (Array.isArray(auditLogs) ? auditLogs : []), [auditLogs]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Audit Logs" pageTitle="Admin" />

          <Row>
            <Col xs={12}>
              <Card>
                <CardHeader className="align-items-center d-flex">
                  <h4 className="card-title mb-0">Audit Logs</h4>
                </CardHeader>
                <CardBody>
                  {/* Filters */}
                  <div className="row mb-4 p-3 bg-light rounded">
                    <div className="col-md-3 mb-3">
                      <FormGroup>
                        <Label htmlFor="module" className="form-label">
                          Module
                        </Label>
                        <Input
                          type="select"
                          name="module"
                          id="module"
                          value={filters.module}
                          onChange={handleFilterChange}
                        >
                          <option value="">All Modules</option>
                          <option value="users">Users</option>
                          <option value="savings">Savings</option>
                          <option value="loans">Loans</option>
                          <option value="auth">Auth</option>
                          <option value="admin">Admin</option>
                        </Input>
                      </FormGroup>
                    </div>

                    <div className="col-md-3 mb-3">
                      <FormGroup>
                        <Label htmlFor="entity_type" className="form-label">
                          Entity Type
                        </Label>
                        <Input
                          type="select"
                          name="entity_type"
                          id="entity_type"
                          value={filters.entity_type}
                          onChange={handleFilterChange}
                        >
                          <option value="">All Types</option>
                          <option value="user">User</option>
                          <option value="loan">Loan</option>
                          <option value="savings_account">Savings Account</option>
                        </Input>
                      </FormGroup>
                    </div>

                    <div className="col-md-2 mb-3">
                      <FormGroup>
                        <Label htmlFor="admin_id" className="form-label">
                          Admin ID
                        </Label>
                        <Input
                          type="number"
                          name="admin_id"
                          id="admin_id"
                          placeholder="Enter admin ID"
                          value={filters.admin_id}
                          onChange={handleFilterChange}
                        />
                      </FormGroup>
                    </div>

                    <div className="col-md-2 mb-3">
                      <FormGroup>
                        <Label htmlFor="entity_id" className="form-label">
                          Entity ID
                        </Label>
                        <Input
                          type="text"
                          name="entity_id"
                          id="entity_id"
                          placeholder="Enter entity ID"
                          value={filters.entity_id}
                          onChange={handleFilterChange}
                        />
                      </FormGroup>
                    </div>

                    <div className="col-md-2 mb-3">
                      <FormGroup>
                        <Label htmlFor="limit" className="form-label">
                          Rows per Page
                        </Label>
                        <Input
                          type="select"
                          name="limit"
                          id="limit"
                          value={filters.limit}
                          onChange={(e) => {
                            const newFilters = { ...filters, limit: Number(e.target.value), offset: 0 };
                            setFilters(newFilters);
                            fetchAuditLogs(newFilters);
                          }}
                        >
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={30}>30</option>
                          <option value={40}>40</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </Input>
                      </FormGroup>
                    </div>

                    <div className="col-md-12 d-flex gap-2">
                      <Button
                        color="primary"
                        onClick={handleApplyFilters}
                        disabled={loading}
                      >
                        <i className="ri-search-line me-2"></i>
                        Apply Filters
                      </Button>
                      <Button
                        color="secondary"
                        onClick={handleResetFilters}
                        disabled={loading}
                      >
                        <i className="ri-refresh-line me-2"></i>
                        Reset
                      </Button>
                    </div>
                  </div>

                  {/* Table */}
                  {loading ? (
                    <div className="text-center py-5">
                      <Spinner color="primary" />
                    </div>
                  ) : (
                    <TableContainer
                      columns={columns}
                      data={data}
                      isGlobalFilter={false}
                      customPageSize={filters.limit}
                      hideHeaderFilters
                    />
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </React.Fragment>
  );
};

export default AuditLogs;
