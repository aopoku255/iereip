import React, { useState, useMemo } from "react";
import {
  CardBody,
  Row,
  Col,
  Card,
  Container,
  CardHeader,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Button,
  Input,
  Table,
} from "reactstrap";
import classnames from "classnames";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import FeatherIcon from "feather-icons-react";
import TableContainer from "../../Components/Common/TableContainer";

const AllRoles = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [viewMode, setViewMode] = useState("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [rolesData] = useState([
    {
      id: 1,
      name: "Super Admin",
      email: "super.admin@loanadmin.com",
      avatar: "avatar-1.jpg",
      description: "Full system access",
      role: "Administrator",
      department: "Operations",
      status: "ACTIVE",
      lastActive: "Today",
      joined: "Jan 8, 2024",
    },
    {
      id: 2,
      name: "Loan Manager",
      email: "loan.manager@loanadmin.com",
      avatar: "avatar-2.jpg",
      description: "Manage loan operations",
      role: "Manager",
      department: "Loan Operations",
      status: "ACTIVE",
      lastActive: "1 hour ago",
      joined: "Mar 12, 2024",
    },
    {
      id: 3,
      name: "Credit Analyst",
      email: "credit.analyst@loanadmin.com",
      avatar: "avatar-3.jpg",
      description: "Risk assessment & scoring",
      role: "Analyst",
      department: "Credit",
      status: "ACTIVE",
      lastActive: "Yesterday",
      joined: "Feb 9, 2024",
    },
    {
      id: 4,
      name: "Collections Officer",
      email: "collections.officer@loanadmin.com",
      avatar: "avatar-4.jpg",
      description: "Handle repayment collections",
      role: "Officer",
      department: "Collections",
      status: "ACTIVE",
      lastActive: "Today",
      joined: "Apr 2, 2024",
    },
    {
      id: 5,
      name: "BNPL Operator",
      email: "bnpl.operator@loanadmin.com",
      avatar: "avatar-5.jpg",
      description: "Manage BNPL transactions",
      role: "Operator",
      department: "BNPL",
      status: "ACTIVE",
      lastActive: "2 days ago",
      joined: "May 18, 2024",
    },
    {
      id: 6,
      name: "Finance Admin",
      email: "finance.admin@loanadmin.com",
      avatar: "avatar-6.jpg",
      description: "Financial operations",
      role: "Administrator",
      department: "Finance",
      status: "ACTIVE",
      lastActive: "3 hours ago",
      joined: "Jun 6, 2024",
    },
    {
      id: 7,
      name: "Support Agent",
      email: "support.agent@loanadmin.com",
      avatar: "avatar-7.jpg",
      description: "Customer support",
      role: "Agent",
      department: "Support",
      status: "ACTIVE",
      lastActive: "30 mins ago",
      joined: "Jul 21, 2024",
    },
    {
      id: 8,
      name: "Viewer",
      email: "viewer@loanadmin.com",
      avatar: "avatar-8.jpg",
      description: "Read-only access",
      role: "Viewer",
      department: "General",
      status: "ACTIVE",
      lastActive: "Yesterday",
      joined: "Aug 15, 2024",
    },
  ]);

  const checkedAll = () => {
    const checkall = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".staffCheckBox");

    if (checkall.checked) {
      ele.forEach((item) => {
        item.checked = true;
      });
    } else {
      ele.forEach((item) => {
        item.checked = false;
      });
    }
  };

  const uniqueRoles = useMemo(
    () => [...new Set(rolesData.map((u) => u.role))],
    []
  );
  const uniqueDepartments = useMemo(
    () => [...new Set(rolesData.map((u) => u.department))],
    []
  );
  const uniqueStatuses = useMemo(
    () => [...new Set(rolesData.map((u) => u.status))],
    []
  );

  const filteredRoles = useMemo(() => {
    return rolesData.filter(
      (role) =>
        (role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          role.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          role.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
          role.department.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!filterRole || role.role === filterRole) &&
        (!filterDepartment || role.department === filterDepartment) &&
        (!filterStatus || role.status === filterStatus)
    );
  }, [searchTerm, filterRole, filterDepartment, filterStatus, rolesData]);

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const columns = useMemo(
    () => [
      {
        Header: (
          <input
            type="checkbox"
            id="checkBoxAll"
            className="form-check-input"
            onClick={() => checkedAll()}
          />
        ),
        Cell: (cellProps) => {
          return (
            <input
              type="checkbox"
              className="staffCheckBox form-check-input"
              value={cellProps.row.original.id}
            />
          );
        },
        id: "check",
      },
      {
        Header: "STAFF",
        accessor: "name",
        Cell: (cell) => (
          <div className="d-flex align-items-center">
            <img
              src={`/src/assets/images/users/${cell.row.original.avatar}`}
              alt={cell.value}
              className="avatar-xs rounded-circle me-2"
            />
            <div>
              <p className="mb-0 fw-semibold">{cell.value}</p>
              <small className="text-muted">{cell.row.original.email}</small>
            </div>
          </div>
        ),
      },
      {
        Header: "ROLE",
        accessor: "role",
        Cell: (cell) => {
          const role = cell.value;
          const roleClass =
            role === "Administrator"
              ? "bg-danger-subtle text-danger"
              : role === "Manager"
              ? "bg-success-subtle text-success"
              : role === "Analyst"
              ? "bg-info-subtle text-info"
              : role === "Officer"
              ? "bg-warning-subtle text-warning"
              : role === "Operator"
              ? "bg-primary-subtle text-primary"
              : role === "Agent"
              ? "bg-secondary-subtle text-secondary"
              : "bg-light text-dark";
          return (
            <Badge className={`rounded-pill ${roleClass}`}>{role}</Badge>
          );
        },
      },
      {
        Header: "DEPARTMENT",
        accessor: "department",
        Cell: (cell) => <span>{cell.value}</span>,
      },
      {
        Header: "STATUS",
        accessor: "status",
        Cell: (cell) => (
          <Badge className="rounded-pill bg-success-subtle text-success">
            {cell.value}
          </Badge>
        ),
      },
      {
        Header: "LAST ACTIVE",
        accessor: "lastActive",
        Cell: (cell) => <span className="text-muted">{cell.value}</span>,
      },
      {
        Header: "JOINED",
        accessor: "joined",
        Cell: (cell) => <span className="text-muted">{cell.value}</span>,
      },
      {
        Header: "ACTIONS",
        Cell: () => (
          <UncontrolledDropdown direction="start">
            <DropdownToggle
              href="#"
              className="btn btn-soft-secondary btn-sm dropdown-toggle"
              role="button"
            >
              <FeatherIcon icon="eye" />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem href="#">
                <FeatherIcon icon="eye" className="me-2" size={15} />
                View
              </DropdownItem>
              <DropdownItem href="#">
                <FeatherIcon icon="edit" className="me-2" size={15} />
                Edit
              </DropdownItem>
              <DropdownItem href="#">
                <FeatherIcon icon="trash-2" className="me-2" size={15} />
                Delete
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        ),
      },
    ],
    []
  );

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Staff Management" pageTitle="All Roles" />

        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="border-bottom-dashed pb-3">
                <Row className="align-items-center mb-3">
                  <Col>
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
                          All Staff
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
                          Admins
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          href="#"
                          className={classnames({ active: activeTab === "3" })}
                          onClick={(e) => {
                            e.preventDefault();
                            toggleTab("3");
                          }}
                        >
                          Managers
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </Col>
                  <Col className="text-end">
                    <Button
                      color="primary"
                      size="md"
                    >
                      <FeatherIcon icon="plus" size={18} className="me-2" />
                      Add Staff
                    </Button>
                  </Col>
                </Row>

                <Row className="align-items-center">
                  <Col md={6}>
                    <div className="search-box">
                      <Input
                        type="text"
                        placeholder="Search by staff name, role or department..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control"
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex gap-2">
                      <Input
                        type="select"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="form-control"
                      >
                        <option value="">All Roles</option>
                        {uniqueRoles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </Input>
                      <Input
                        type="select"
                        value={filterDepartment}
                        onChange={(e) => setFilterDepartment(e.target.value)}
                        className="form-control"
                      >
                        <option value="">All Departments</option>
                        {uniqueDepartments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </Input>
                      <Input
                        type="select"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="form-control"
                      >
                        <option value="">All Status</option>
                        {uniqueStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </Input>
                    </div>
                  </Col>
                </Row>

                <Row className="align-items-center mt-3">
                  <Col md={12} className="text-end">
                    <Button
                      color={viewMode === "table" ? "primary" : "dark"}
                      className="me-2"
                      size="sm"
                      outline={viewMode !== "table"}
                      onClick={() => setViewMode("table")}
                    >
                      <FeatherIcon icon="list" size={15} className="me-1" />
                      Table
                    </Button>
                    <Button
                      color={viewMode === "grid" ? "primary" : "dark"}
                      className="me-2"
                      size="sm"
                      outline={viewMode !== "grid"}
                      onClick={() => setViewMode("grid")}
                    >
                      <FeatherIcon icon="grid" size={15} className="me-1" />
                      Grid
                    </Button>
                    <Button
                      color="dark"
                      className="me-2"
                      size="sm"
                      outline
                    >
                      <FeatherIcon icon="download" size={15} className="me-1" />
                      Export
                    </Button>
                    <Button
                      color="dark"
                      className="me-2"
                      size="sm"
                      outline
                    >
                      <FeatherIcon icon="settings" size={15} />
                    </Button>
                  </Col>
                </Row>
              </CardHeader>

              <CardBody className="pt-0">
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="1">
                    {viewMode === "table" ? (
                      <TableContainer
                        columns={columns}
                        data={filteredRoles}
                        isGlobalFilter={false}
                        customPageSize={10}
                        className="table-striped"
                        tableClass="table table-hover"
                      />
                    ) : (
                      <Row className="g-3">
                        {filteredRoles.map((user) => {
                          const roleClass =
                            user.role === "Administrator"
                              ? "bg-danger-subtle text-danger"
                              : user.role === "Manager"
                              ? "bg-success-subtle text-success"
                              : user.role === "Analyst"
                              ? "bg-info-subtle text-info"
                              : user.role === "Officer"
                              ? "bg-warning-subtle text-warning"
                              : user.role === "Operator"
                              ? "bg-primary-subtle text-primary"
                              : user.role === "Agent"
                              ? "bg-secondary-subtle text-secondary"
                              : "bg-light text-dark";
                          return (
                            <Col md={6} lg={4} key={user.id}>
                              <Card className="shadow-sm h-100">
                                <CardBody>
                                  <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className="d-flex align-items-center flex-grow-1">
                                      <img
                                        src={`/src/assets/images/users/${user.avatar}`}
                                        alt={user.name}
                                        className="avatar-md rounded-circle me-3"
                                      />
                                      <div>
                                        <h6 className="mb-0 fw-semibold">{user.name}</h6>
                                        <small className="text-muted">{user.email}</small>
                                      </div>
                                    </div>
                                    <input
                                      type="checkbox"
                                      className="stafffCheckBox form-check-input"
                                      value={user.id}
                                    />
                                  </div>
                                  <div className="mb-3">
                                    <Badge className={`rounded-pill ${roleClass} me-2 mb-2`}>
                                      {user.role}
                                    </Badge>
                                    <Badge className="rounded-pill bg-success-subtle text-success mb-2">
                                      {user.status}
                                    </Badge>
                                  </div>
                                  <div className="mb-3">
                                    <p className="mb-1">
                                      <small className="text-muted">Department:</small>
                                      <br />
                                      <strong className="text-dark">{user.department}</strong>
                                    </p>
                                    <p className="mb-1">
                                      <small className="text-muted">Last Active:</small>
                                      <br />
                                      <strong className="text-dark">{user.lastActive}</strong>
                                    </p>
                                    <p className="mb-0">
                                      <small className="text-muted">Joined:</small>
                                      <br />
                                      <strong className="text-dark">{user.joined}</strong>
                                    </p>
                                  </div>
                                  <div className="d-flex gap-2">
                                    <Button color="info" size="sm" className="flex-grow-1">
                                      <FeatherIcon icon="eye" size={14} className="me-1" />
                                      View
                                    </Button>
                                    <Button color="warning" size="sm" className="flex-grow-1">
                                      <FeatherIcon icon="edit" size={14} className="me-1" />
                                      Edit
                                    </Button>
                                    <Button color="danger" size="sm" className="flex-grow-1">
                                      <FeatherIcon icon="trash-2" size={14} />
                                    </Button>
                                  </div>
                                </CardBody>
                              </Card>
                            </Col>
                          );
                        })}
                      </Row>
                    )}
                  </TabPane>

                  <TabPane tabId="2">
                    <div className="text-center py-5">
                      <p className="text-muted">Admins content will be displayed here.</p>
                    </div>
                  </TabPane>

                  <TabPane tabId="3">
                    <div className="text-center py-5">
                      <p className="text-muted">Managers content will be displayed here.</p>
                    </div>
                  </TabPane>
                </TabContent>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AllRoles;
