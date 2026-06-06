import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, Col, Container, Row, Spinner, Button } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { StatusColumnFilter, BranchColumnFilter } from "../../Components/Common/filters";
import { getUsers } from "../../slices/thunks";
import TableContainer from "../../Components/Common/TableContainer";

const LoanApplicationList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading, error } = useSelector((state) => state.Users || {});

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      {
        Header: "User",
        accessor: "full_name",
        Cell: ({ row }) => {
          const user = row.original;
          const avatar = user.photo_url || user.profile_image || user.avatar || user.image || user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || "User")}&background=0D8ABC&color=fff&size=40`;
          return (
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <img
                  src={avatar}
                  alt={user.full_name || "User"}
                  className="rounded-circle avatar-xs"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || "User")}&background=0D8ABC&color=fff&size=40`;
                  }}
                />
              </div>
              <div className="flex-grow-1 ms-2">
                <h6 className="mb-1 fw-semibold">{user.full_name || "-"}</h6>
                <small className="text-muted">{user.user_id || "-"}</small>
              </div>
            </div>
          );
        },
      },
      {
        Header: "Contact",
        accessor: "email",
        Cell: ({ row }) => (
          <div>
            <div className="mb-1 fw-semibold">{row.original.email || "-"}</div>
            <small className="text-muted">{row.original.mobile_number || "-"}</small>
          </div>
        ),
      },
      {
        Header: "Branch",
        id: "branch",
        accessor: (row) => (row.branch ? row.branch.name : ""),
        Filter: BranchColumnFilter,
        showFilterInHeader: false,
      },
      { Header: "Account Type", accessor: "account_type" },
      {
        Header: "Status",
        accessor: "is_active",
        Filter: StatusColumnFilter,
        showFilterInHeader: false,
        Cell: ({ value }) => (
          value ? <span className="badge bg-success-subtle text-success">Active</span> : <span className="badge bg-danger-subtle text-danger">Inactive</span>
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
              color="primary"
              className="btn-sm"
              onClick={() => navigate(`/loan/new-application/${row.original.id}`)}
              title="Create Loan Application"
            >
              <i className="mdi mdi-plus-circle"></i>
            </Button>
          </div>
        ),
      },
    ],
    [navigate]
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="New Application" pageTitle="Loan Application" />
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader className="align-items-center d-flex">
                  <h4 className="card-title mb-0">Users - Create Loan Application</h4>
                </CardHeader>
                <CardBody>
                  {loading ? (
                    <div className="text-center py-5">
                      <Spinner color="primary" />
                    </div>
                  ) : error ? (
                    <div className="text-danger py-4">{error}</div>
                  ) : (
                    <TableContainer
                      columns={columns}
                      data={Array.isArray(users) ? users : []}
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

export default LoanApplicationList;
