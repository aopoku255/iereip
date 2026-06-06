import React, { useState, useMemo, useEffect } from "react";
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
  Form,
  FormGroup,
  Label,
  InputGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  Spinner,
} from "reactstrap";
import classnames from "classnames";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import FeatherIcon from "feather-icons-react";
import TableContainer from "../../Components/Common/TableContainer";
import { useDispatch, useSelector } from "react-redux";
import { usePermission } from "../../hooks/usePermission";
import {
  getStaff,
  getRoles,
  createStaff,
  updateStaff,
  getStaffById,
  toggleStaffStatus,
  createRole,
} from "../../slices/thunks";

const AllStaff = () => {
  const dispatch = useDispatch();
  const canManageAdmins = usePermission("manage_admins");
  const canManageRoles = usePermission("manage_roles");
  const {
    users: staff,
    loading,
    error,
    roles,
    rolesLoading,
    rolesError,
    selectedStaff,
    selectedStaffLoading,
    addLoading,
    addError,
    updateLoading,
    updateError,
    toggleStatusLoading,
    toggleStatusError,
    createRoleLoading,
    createRoleError,
  } = useSelector((state) => state.Staff);
  const [activeTab, setActiveTab] = useState("1");
  const [viewMode, setViewMode] = useState("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [roleFormError, setRoleFormError] = useState("");
  const [togglingStatusId, setTogglingStatusId] = useState(null);
  const [newStaff, setNewStaff] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    role_id: null,
  });
  const [newRole, setNewRole] = useState({ name: "", description: "" });
  const [isViewOffcanvasOpen, setIsViewOffcanvasOpen] = useState(false);
  const [isEditStaffModalOpen, setIsEditStaffModalOpen] = useState(false);
  const [editStaff, setEditStaff] = useState({
    id: null,
    first_name: "",
    last_name: "",
    phone: "",
    role_id: null,
    is_active: true,
  });
  const [editError, setEditError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(getStaff());
    dispatch(getRoles());
  }, [dispatch]);

  const roleList = Array.isArray(roles) ? roles : [];

  useEffect(() => {
    if (roleList.length && newStaff.role_id === null) {
      setNewStaff((prev) => ({ ...prev, role_id: roleList[0].id }));
    }
  }, [roleList, newStaff.role_id]);

  const getErrorMessage = (error, fallback) =>
    typeof error === "string" ? error : error?.message || fallback;

  useEffect(() => {
    if (selectedStaff) {
      const matchedRole =
        roles.find((role) => role.id === selectedStaff.role?.id) ||
        roles.find(
          (role) =>
            selectedStaff.role?.name &&
            role.name.toLowerCase() === selectedStaff.role.name.toLowerCase()
        );
      const roleId = selectedStaff.role?.id || matchedRole?.id || roleList[0]?.id || null;
      setEditStaff({
        id: selectedStaff.id ?? selectedStaff.admin_id,
        first_name: selectedStaff.first_name || "",
        last_name: selectedStaff.last_name || "",
        phone: selectedStaff.phone || "",
        role_id: roleId,
        is_active: selectedStaff.is_active ?? selectedStaff.status === "ACTIVE",
      });
    }
  }, [selectedStaff, roles]);

  const toggleAddStaffModal = () => {
    setFormError("");
    setIsAddStaffModalOpen((prev) => !prev);
  };

  const handleNewStaffChange = (event) => {
    const { name, value } = event.target;
    setNewStaff((prev) => ({
      ...prev,
      [name]: name === "role_id" ? Number(value) : value,
    }));
  };

  const handleAddStaffSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    const { first_name, last_name, email, phone, password, role_id } = newStaff;
    if (!first_name || !last_name || !email || !phone || !password || !role_id) {
      setFormError("Please complete all fields before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(createStaff({
        first_name,
        last_name,
        email,
        phone,
        password,
        role_id,
      })).unwrap();
      await dispatch(getStaff());
      toggleAddStaffModal();
      setNewStaff({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
        role_id: roleList.length ? roleList[0].id : null,
      });
    } catch (error) {
      setFormError(getErrorMessage(error, "Unable to add staff. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAddRoleModal = () => {
    setRoleFormError("");
    setNewRole({ name: "", description: "" });
    setIsAddRoleModalOpen((prev) => !prev);
  };

  const handleNewRoleChange = (event) => {
    const { name, value } = event.target;
    setNewRole((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRoleSubmit = async (event) => {
    event.preventDefault();
    setRoleFormError("");
    if (!newRole.name || !newRole.description) {
      setRoleFormError("Please enter both role name and description.");
      return;
    }

    try {
      const createdRole = await dispatch(createRole(newRole)).unwrap();
      if (createdRole?.id) {
        setNewStaff((prev) => ({ ...prev, role_id: createdRole.id }));
      }
      setNewRole({ name: "", description: "" });
      setIsAddRoleModalOpen(false);
    } catch (error) {
      setRoleFormError(getErrorMessage(error, "Unable to add role. Please try again."));
    }
  };

  const handleToggleStatus = async (adminId) => {
    if (!adminId) return;
    setTogglingStatusId(adminId);
    try {
      await dispatch(toggleStaffStatus(adminId)).unwrap();
      await dispatch(getStaff());
    } catch (error) {
      console.error(error);
    } finally {
      setTogglingStatusId(null);
    }
  };

  const handleViewStaff = async (adminId) => {
    if (!adminId) return;
    setIsViewOffcanvasOpen(true);
    try {
      await dispatch(getStaffById(adminId)).unwrap();
    } catch (error) {
      console.error("Error fetching staff details:", error);
    }
  };

  const toggleViewOffcanvas = () => {
    setIsViewOffcanvasOpen((prev) => !prev);
  };

  const toggleEditStaffModal = () => {
    setEditError("");
    setIsEditStaffModalOpen((prev) => !prev);
  };

  const handleEditStaffChange = (event) => {
    const { name, value, type, checked } = event.target;
    setEditStaff((prev) => ({
      ...prev,
      [name]: name === "role_id" ? Number(value) : name === "is_active" ? checked : value,
    }));
  };

  const handleOpenEditStaffModal = async (adminId) => {
    if (!adminId) return;
    setEditError("");
    try {
      await dispatch(getStaffById(adminId)).unwrap();
      setIsEditStaffModalOpen(true);
    } catch (error) {
      console.error("Error loading edit staff:", error);
      setEditError(getErrorMessage(error, "Unable to load staff details for editing."));
    }
  };

  const handleEditStaffSubmit = async (event) => {
    event.preventDefault();
    setEditError("");

    if (!editStaff.first_name || !editStaff.last_name || !editStaff.phone || !editStaff.role_id) {
      setEditError("Please complete all fields before submitting.");
      return;
    }

    setIsEditing(true);
    try {
      await dispatch(
        updateStaff({
          id: editStaff.id,
          payload: {
            first_name: editStaff.first_name,
            last_name: editStaff.last_name,
            phone: editStaff.phone,
            role_id: editStaff.role_id,
            is_active: editStaff.is_active,
          },
        })
      ).unwrap();
      await dispatch(getStaff());
      setIsEditStaffModalOpen(false);
    } catch (error) {
      console.error("Error updating admin:", error);
      setEditError(getErrorMessage(error, "Unable to update staff. Please try again."));
    } finally {
      setIsEditing(false);
    }
  };

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
    () =>
      roleList.length
        ? roleList.map((role) => role.name)
        : [...new Set(staff.map((s) => s.role || ""))].filter(Boolean),
    [roleList, staff]
  );
  const uniqueDepartments = useMemo(
    () => [...new Set(staff.map((s) => s.department || ""))].filter(Boolean),
    [staff]
  );
  const uniqueStatuses = useMemo(
    () => [...new Set(staff.map((s) => s.status || ""))].filter(Boolean),
    [staff]
  );

  const filteredStaff = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase();
    const normalizedFilterRole = filterRole?.toLowerCase() || "";
    return staff.filter((member) => {
      const name = (member.name || "").toLowerCase();
      const email = (member.email || "").toLowerCase();
      const role = (member.role || "").toLowerCase();
      const department = (member.department || "").toLowerCase();
      const status = member.status || "";
      const permissions = Array.isArray(member.permissions)
        ? member.permissions.join(" ").toLowerCase()
        : (member.permissions || "").toLowerCase();

      const matchesSearch =
        name.includes(normalizedSearch) ||
        email.includes(normalizedSearch) ||
        role.includes(normalizedSearch) ||
        department.includes(normalizedSearch) ||
        permissions.includes(normalizedSearch);

      return (
        matchesSearch &&
        (!filterRole || role === normalizedFilterRole) &&
        (!filterDepartment || member.department === filterDepartment) &&
        (!filterStatus || status === filterStatus)
      );
    });
  }, [searchTerm, filterRole, filterDepartment, filterStatus, staff]);

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
          const roleLower = role?.toLowerCase() || "";
          
          // Known role mappings
          let roleClass = "bg-light text-dark";
          if (roleLower.includes("super") || roleLower.includes("admin")) {
            roleClass = "bg-danger-subtle text-danger";
          } else if (roleLower.includes("manager")) {
            roleClass = "bg-success-subtle text-success";
          } else if (roleLower.includes("analyst")) {
            roleClass = "bg-info-subtle text-info";
          } else if (roleLower.includes("officer")) {
            roleClass = "bg-warning-subtle text-warning";
          } else if (roleLower.includes("operator")) {
            roleClass = "bg-primary-subtle text-primary";
          } else if (roleLower.includes("agent")) {
            roleClass = "bg-secondary-subtle text-secondary";
          } else {
            // For unknown/dynamic roles, cycle through colors based on role name hash
            const colorOptions = [
              "bg-primary-subtle text-primary",
              "bg-success-subtle text-success",
              "bg-warning-subtle text-warning",
              "bg-info-subtle text-info",
              "bg-secondary-subtle text-secondary",
            ];
            const hash = role.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
            roleClass = colorOptions[hash % colorOptions.length];
          }
          
          return (
            <span className={`rounded-pill badge ${roleClass}`}>{role}</span>
          );
        },
      },
      {
        Header: "DEPARTMENT",
        accessor: "department",
        Cell: (cell) => <span>{cell.value}</span>,
      },
      {
        Header: "PERMISSIONS",
        accessor: "permissions",
        Cell: (cell) => <span>{cell.value?.length || 0}</span>,
      },
      {
        Header: "STATUS",
        accessor: "status",
        Cell: (cell) => {
          const isActive = cell.value === "ACTIVE";
          const adminId = cell.row.original.id;
          const isLoading = togglingStatusId === adminId;
          return (
            <div className="d-flex align-items-center gap-2">
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  checked={isActive}
                  disabled={isLoading}
                  onChange={() => handleToggleStatus(adminId)}
                  style={{
                    cursor: isLoading ? "not-allowed" : "pointer",
                    backgroundColor: isActive ? "#0ab39c" : "#f06548",
                    borderColor: isActive ? "#0ab39c" : "#f06548",
                  }}
                />
              </div>
              <span className="text-muted">
                {isLoading ? "Updating..." : isActive ? "Active" : "Inactive"}
              </span>
            </div>
          );
        },
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
        Cell: (cellProps) => (
          <UncontrolledDropdown direction="start">
            <DropdownToggle
              tag="button"
              type="button"
              className="btn btn-soft-secondary btn-sm"
              caret={false}
            >
              <FeatherIcon icon="more-vertical" />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleViewStaff(cellProps.row.original.id);
                }}
              >
                <FeatherIcon icon="eye" className="me-2" size={15} />
                View
              </DropdownItem>
              {canManageAdmins && (
                <DropdownItem
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpenEditStaffModal(cellProps.row.original.id);
                  }}
                >
                  <FeatherIcon icon="edit" className="me-2" size={15} />
                  Edit
                </DropdownItem>
              )}
              {canManageAdmins && (
                <DropdownItem href="#">
                  <FeatherIcon icon="trash-2" className="me-2" size={15} />
                  Delete
                </DropdownItem>
              )}
            </DropdownMenu>
          </UncontrolledDropdown>
        ),
      },
    ],
    [togglingStatusId]
  );

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Staff Management" pageTitle="All Staff" />

        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="border-bottom-dashed pb-3">
                <Row className="align-items-center mb-3">
                  <Col sm={3}>
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
                    {canManageAdmins && (
                      <Button
                        color="primary"
                        size="md"
                        onClick={toggleAddStaffModal}
                      >
                        <FeatherIcon icon="plus" size={18} className="me-2" />
                        Add Staff
                      </Button>
                    )}
                  </Col>
                </Row>

                <Row className="align-items-center justify-content-between">
                  <Col md={3}>
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
                  <Col md={4}>
                    <div className="d-flex gap-2">
                      <Input
                        type="select"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="form-control"
                      >
                        <option value="">All Roles</option>
                        {roleList.length
                          ? roleList.map((role) => (
                              <option key={role.id} value={role.name}>
                                {role.name}
                              </option>
                            ))
                          : uniqueRoles.map((role) => (
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
                <Modal isOpen={isAddStaffModalOpen} toggle={toggleAddStaffModal} size="lg" centered>
                  <ModalHeader toggle={toggleAddStaffModal}>Add Staff</ModalHeader>
                  <Form onSubmit={handleAddStaffSubmit}>
                    <ModalBody>
                      {formError && (
                        <div className="alert alert-danger" role="alert">
                          {formError}
                        </div>
                      )}
                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="first_name">First Name</Label>
                            <Input
                              id="first_name"
                              name="first_name"
                              value={newStaff.first_name}
                              onChange={handleNewStaffChange}
                              placeholder="First Name"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="last_name">Last Name</Label>
                            <Input
                              id="last_name"
                              name="last_name"
                              value={newStaff.last_name}
                              onChange={handleNewStaffChange}
                              placeholder="Last Name"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              value={newStaff.email}
                              onChange={handleNewStaffChange}
                              placeholder="user@example.com"
                              type="email"
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="phone">Phone</Label>
                            <Input
                              id="phone"
                              name="phone"
                              value={newStaff.phone}
                              onChange={handleNewStaffChange}
                              placeholder="Phone"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="password">Password</Label>
                            <Input
                              id="password"
                              name="password"
                              value={newStaff.password}
                              onChange={handleNewStaffChange}
                              placeholder="Password"
                              type="password"
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="role_id">Role</Label>
                            <InputGroup>
                              <Input
                                type="select"
                                id="role_id"
                                name="role_id"
                                value={newStaff.role_id || ""}
                                onChange={handleNewStaffChange}
                              >
                                <option value="">Select Role</option>
                                {roleList.length ? (
                                  roleList.map((role) => (
                                    <option key={role.id} value={role.id}>
                                      {role.name}
                                    </option>
                                  ))
                                ) : (
                                  <option value="">No roles available</option>
                                )}
                              </Input>
                              {canManageRoles && (
                                <Button
                                  type="button"
                                  color="secondary"
                                  className="mb-0"
                                  onClick={toggleAddRoleModal}
                                >
                                  <FeatherIcon icon="plus" size={14} className="me-1" />
                                  New Role
                                </Button>
                              )}
                            </InputGroup>
                          </FormGroup>
                        </Col>
                      </Row>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="secondary" onClick={toggleAddStaffModal}>
                        Cancel
                      </Button>
                      <Button color="primary" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save"}
                      </Button>
                    </ModalFooter>
                  </Form>
                </Modal>
                <Modal isOpen={isAddRoleModalOpen} toggle={toggleAddRoleModal} centered>
                  <ModalHeader toggle={toggleAddRoleModal}>Add New Role</ModalHeader>
                  <Form onSubmit={handleAddRoleSubmit}>
                    <ModalBody>
                      {roleFormError && (
                        <div className="alert alert-danger" role="alert">
                          {roleFormError}
                        </div>
                      )}
                      <FormGroup>
                        <Label for="name">Role Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={newRole.name}
                          onChange={handleNewRoleChange}
                          placeholder="Role Name"
                          type="text"
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label for="description">Description</Label>
                        <Input
                          id="description"
                          name="description"
                          value={newRole.description}
                          onChange={handleNewRoleChange}
                          placeholder="Description"
                          type="text"
                        />
                      </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="secondary" type="button" onClick={toggleAddRoleModal}>
                        Cancel
                      </Button>
                      <Button color="primary" type="submit">
                        Save Role
                      </Button>
                    </ModalFooter>
                  </Form>
                </Modal>
                <Modal isOpen={isEditStaffModalOpen} toggle={toggleEditStaffModal} centered>
                  <ModalHeader toggle={toggleEditStaffModal}>Edit Staff Member</ModalHeader>
                  <Form onSubmit={handleEditStaffSubmit}>
                    <ModalBody>
                      {editError && (
                        <div className="alert alert-danger" role="alert">
                          {editError}
                        </div>
                      )}
                      {selectedStaffLoading ? (
                        <div className="text-center py-5">
                          <Spinner color="primary" />
                        </div>
                      ) : (
                        <>
                          <Row>
                            <Col md={6}>
                              <FormGroup>
                                <Label for="first_name">First Name</Label>
                                <Input
                                  id="first_name"
                                  name="first_name"
                                  value={editStaff.first_name}
                                  onChange={handleEditStaffChange}
                                  placeholder="First Name"
                                  type="text"
                                />
                              </FormGroup>
                            </Col>
                            <Col md={6}>
                              <FormGroup>
                                <Label for="last_name">Last Name</Label>
                                <Input
                                  id="last_name"
                                  name="last_name"
                                  value={editStaff.last_name}
                                  onChange={handleEditStaffChange}
                                  placeholder="Last Name"
                                  type="text"
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={6}>
                              <FormGroup>
                                <Label for="phone">Phone</Label>
                                <Input
                                  id="phone"
                                  name="phone"
                                  value={editStaff.phone}
                                  onChange={handleEditStaffChange}
                                  placeholder="Phone"
                                  type="text"
                                />
                              </FormGroup>
                            </Col>
                            <Col md={6}>
                              <FormGroup>
                                <Label for="role_id">Role</Label>
                                <Input
                                  type="select"
                                  id="role_id"
                                  name="role_id"
                                  value={editStaff.role_id || ""}
                                  onChange={handleEditStaffChange}
                                >
                                  <option value="">Select Role</option>
                                  {roleList.length ? (
                                    roleList.map((role) => (
                                      <option key={role.id} value={role.id}>
                                        {role.name}
                                      </option>
                                    ))
                                  ) : (
                                    <option value="">No roles available</option>
                                  )}
                                </Input>
                              </FormGroup>
                            </Col>
                          </Row>
                          <div className="form-check form-switch mb-3">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="is_active"
                              name="is_active"
                              checked={editStaff.is_active}
                              onChange={handleEditStaffChange}
                            />
                            <Label className="form-check-label" for="is_active">
                              Active
                            </Label>
                          </div>
                        </>
                      )}
                    </ModalBody>
                    <ModalFooter>
                      <Button color="secondary" type="button" onClick={toggleEditStaffModal}>
                        Cancel
                      </Button>
                      <Button color="primary" type="submit" disabled={isEditing}>
                        {isEditing ? "Saving..." : "Save Changes"}
                      </Button>
                    </ModalFooter>
                  </Form>
                </Modal>
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner color="primary" />
                  </div>
                ) : error ? (
                  <div className="alert alert-danger" role="alert">
                    <strong>Error:</strong> {error}
                  </div>
                ) : (
                  <>
                    {toggleStatusError && (
                      <div className="alert alert-danger" role="alert">
                        <strong>Error:</strong> {toggleStatusError}
                      </div>
                    )}
                    <TabContent activeTab={activeTab}>
                      <TabPane tabId="1">
                        {viewMode === "table" ? (
                          <TableContainer
                            columns={columns}
                            data={filteredStaff}
                            isGlobalFilter={false}
                            hideHeaderFilters={true}
                            customPageSize={10}
                            className="table-striped"
                            tableClass="table table-hover"
                          />
                        ) : (
                          <Row className="g-3">
                            {filteredStaff.map((staffMember) => {
                              const roleClass =
                                staffMember.role === "Administrator"
                                  ? "bg-danger-subtle text-danger"
                                  : staffMember.role === "Manager"
                                  ? "bg-success-subtle text-success"
                                  : staffMember.role === "Analyst"
                                  ? "bg-info-subtle text-info"
                                  : staffMember.role === "Officer"
                                  ? "bg-warning-subtle text-warning"
                                  : staffMember.role === "Operator"
                                  ? "bg-primary-subtle text-primary"
                                  : staffMember.role === "Agent"
                                  ? "bg-secondary-subtle text-secondary"
                                  : "bg-light text-dark";
                              return (
                                <Col md={6} lg={4} key={staffMember.id}>
                                  <Card className="shadow-sm h-100">
                                    <CardBody>
                                      <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className="d-flex align-items-center flex-grow-1">
                                          <img
                                            src={`/src/assets/images/users/${staffMember.avatar}`}
                                            alt={staffMember.name}
                                            className="avatar-md rounded-circle me-3"
                                          />
                                          <div>
                                            <h6 className="mb-0 fw-semibold">{staffMember.name}</h6>
                                            <small className="text-muted">{staffMember.email}</small>
                                          </div>
                                        </div>
                                        <input
                                          type="checkbox"
                                          className="staffCheckBox form-check-input"
                                          value={staffMember.id}
                                        />
                                      </div>
                                      <div className="mb-3">
                                        <Badge className={`rounded-pill ${roleClass} me-2 mb-2`}>
                                          {staffMember.role}
                                        </Badge>
                                        <Badge
                                          className={`rounded-pill ${
                                            staffMember.status === "ACTIVE"
                                              ? "bg-success-subtle text-success"
                                              : "bg-danger-subtle text-danger"
                                          } mb-2`}
                                        >
                                          {staffMember.status}
                                        </Badge>
                                      </div>
                                      <div className="mb-3">
                                        <p className="mb-1">
                                          <small className="text-muted">Department:</small>
                                          <br />
                                          <strong className="text-dark">{staffMember.department}</strong>
                                        </p>
                                        <p className="mb-1">
                                          <small className="text-muted">Last Active:</small>
                                          <br />
                                          <strong className="text-dark">{staffMember.lastActive}</strong>
                                        </p>
                                        <p className="mb-0">
                                          <small className="text-muted">Joined:</small>
                                          <br />
                                          <strong className="text-dark">{staffMember.joined}</strong>
                                        </p>
                                      </div>
                                      <div className="d-flex gap-2">
                                        <Button
                                          color="info"
                                          size="sm"
                                          className="flex-grow-1"
                                          onClick={() => handleViewStaff(staffMember.id)}
                                        >
                                          <FeatherIcon icon="eye" size={14} className="me-1" />
                                          View
                                        </Button>
                                        {canManageAdmins && (
                                          <Button
                                            color="warning"
                                            size="sm"
                                            className="flex-grow-1"
                                            onClick={() => handleOpenEditStaffModal(staffMember.id)}
                                          >
                                            <FeatherIcon icon="edit" size={14} className="me-1" />
                                            Edit
                                          </Button>
                                        )}
                                        {canManageAdmins && (
                                          <Button color="danger" size="sm" className="flex-grow-1">
                                            <FeatherIcon icon="trash-2" size={14} />
                                          </Button>
                                        )}
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
                  </>
                )}
              </CardBody>
            </Card>
            <Offcanvas
              isOpen={isViewOffcanvasOpen}
              toggle={toggleViewOffcanvas}
              direction="end"
              className="offcanvas-end"
            >
              <OffcanvasHeader toggle={toggleViewOffcanvas}>
                Staff Details
              </OffcanvasHeader>
              <hr className="text-secondary"/>
              <OffcanvasBody>
                {selectedStaffLoading ? (
                  <div className="text-center py-5">
                    <Spinner color="primary" />
                  </div>
                ) : selectedStaff ? (
                  <div className="staff-details">
                    <div className="d-flex align-items-center gap-3 mb-4">
                      <div className="avatar-sm rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-semibold" style={{ minWidth: 64, minHeight: 64 }}>
                        {selectedStaff.full_name
                          ? selectedStaff.full_name
                              .split(" ")
                              .map((part) => part[0]?.toUpperCase())
                              .join("")
                          : "U"}
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="mb-1 fw-semibold">{selectedStaff.full_name || selectedStaff.first_name}</h5>
                        <p className="text-muted mb-2">{selectedStaff.email}</p>
                        <div className="d-flex flex-wrap gap-2">
                          <Badge className="rounded-pill bg-danger-subtle text-danger">{selectedStaff.role?.name?.toUpperCase() || "ROLE"}</Badge>
                          <Badge className={`rounded-pill ${selectedStaff.is_active ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"}`}>
                            {selectedStaff.is_active ? "ACTIVE" : "INACTIVE"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                      <hr className="text-muted"/>

                    <div className="mb-4">
                      <h6 className="text-uppercase text-muted fs-16 mb-3">Account details</h6>
                      <Row className="mb-2">
                        <Col sm={4} className="text-muted">
                          Admin ID
                        </Col>
                        <Col sm={8} className="fw-semibold">
                          {selectedStaff.admin_id}
                        </Col>
                      </Row>
                      <Row className="mb-2">
                        <Col sm={4} className="text-muted">
                          Phone
                        </Col>
                        <Col sm={8} className="fw-semibold">
                          {selectedStaff.phone}
                        </Col>
                      </Row>
                      <Row className="mb-2">
                        <Col sm={4} className="text-muted">
                          Last login
                        </Col>
                        <Col sm={8} className="fw-semibold">
                          {selectedStaff.last_login ? new Date(selectedStaff.last_login).toLocaleString() : "Never"}
                        </Col>
                      </Row>
                      <Row className="mb-2">
                        <Col sm={4} className="text-muted">
                          Joined
                        </Col>
                        <Col sm={8} className="fw-semibold">
                          {selectedStaff.created_at ? new Date(selectedStaff.created_at).toLocaleString() : "N/A"}
                        </Col>
                      </Row>
                    </div>

                    <hr className="text-muted"/>

                    {/* <div className="mb-4">
                      <h6 className="text-uppercase text-muted fs-12 mb-3">Role information</h6>
                      <Row className="mb-2">
                        <Col sm={4} className="text-muted">
                          Role name
                        </Col>
                        <Col sm={8} className="fw-semibold">
                          {selectedStaff.role?.name}
                        </Col>
                      </Row>
                      <Row className="mb-2">
                        <Col sm={4} className="text-muted">
                          Role description
                        </Col>
                        <Col sm={8} className="fw-semibold">
                          {selectedStaff.role?.description}
                        </Col>
                      </Row>
                    </div> */}

                    <div className="mb-4">
                      <h6 className="text-uppercase text-muted fs-16 mb-3 ">Permissions</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {selectedStaff.permissions?.length > 0 ? (
                          selectedStaff.permissions.map((permission, index) => (
                            <Badge key={index} className="rounded p-2 bg-success-subtle text-success">
                              {permission.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted">No permissions assigned</span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <p className="text-muted">Failed to load staff details.</p>
                  </div>
                )}
              </OffcanvasBody>
            </Offcanvas>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AllStaff;
