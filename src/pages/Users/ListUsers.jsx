import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, Col, Container, Row, Spinner, Button } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { SelectColumnFilter, StatusColumnFilter, BranchColumnFilter } from "../../Components/Common/filters";
import { getUsers } from "../../slices/thunks";
import TableContainer from "../../Components/Common/TableContainer";
import { usePermission } from "../../hooks/usePermission";

const ListUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading, error } = useSelector((state) => state.Users || {});
  const canManageUsers = usePermission("manage_users");
  const canEditUsers = usePermission("manage_users");

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? dateString : date.toLocaleDateString();
  };

  const renderStatus = (active) => {
    if (active === true || active === "true") {
      return <span className="badge bg-success-subtle text-success">Active</span>;
    }
    return <span className="badge bg-danger-subtle text-danger">Inactive</span>;
  };

  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
    //   { Header: "User ID", accessor: "user_id" },
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
        Header: "Created At",
        accessor: "created_at",
        disableFilters: true,
        Cell: (cell) => (
          <span className="text-muted">
            {cell.value ? (
              <>
                <span className="fw-bold">{new Date(cell.value).toLocaleDateString()}</span>{" "}
                <small>{new Date(cell.value).toLocaleTimeString()}</small>
              </>
            ) : (
              "-"
            )}
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
              color="soft-primary"
              className="btn-sm"
              onClick={() => navigate(`/users-view/${row.original.id}`)}
              title="View User"
            >
              <i className="mdi mdi-eye-outline"></i>
            </Button>
            {canEditUsers && (
              <Button
                type="button"
                color="soft-secondary"
                className="btn-sm"
                onClick={() => navigate(`/users-edit/${row.original.id}`)}
                title="Edit User"
              >
                <i className="mdi mdi-pencil-outline"></i>
              </Button>
            )}
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
          <BreadCrumb title="List Users" pageTitle="Users Management" />
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader className="align-items-center d-flex">
                  <h4 className="card-title mb-0">List Users</h4>
                  {canManageUsers && (
                    <Button
                      type="button"
                      color="primary"
                      className="btn mb-0 ms-auto"
                      onClick={() => navigate("/users-create")}
                    >
                      <i className="mdi mdi-plus-circle-outline me-1" />
                      Create User
                    </Button>
                  )}
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

export default ListUsers;
