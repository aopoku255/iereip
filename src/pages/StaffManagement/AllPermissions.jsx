import React, { useState, useEffect } from "react";
import { APIClient } from "../../helpers/api_helper";
import {
  CardBody,
  Row,
  Col,
  Card,
  Container,
  CardHeader,
  Badge,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Button,
  Input,
  Table,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
} from "reactstrap";
import classnames from "classnames";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import FeatherIcon from "feather-icons-react";

const AllPermissions = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [viewMode, setViewMode] = useState("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [permissions, setPermissions] = useState({});
  const [rolesData, setRolesData] = useState([]);
  const [basePermissions, setBasePermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [isSavingRole, setIsSavingRole] = useState(false);
  const [addRoleError, setAddRoleError] = useState(null);
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [editRoleName, setEditRoleName] = useState("");
  const [editRoleDescription, setEditRoleDescription] = useState("");
  const [editRoleActive, setEditRoleActive] = useState(true);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editRoleError, setEditRoleError] = useState(null);
  const [isViewPermissionsModalOpen, setIsViewPermissionsModalOpen] = useState(false);
  const [selectedRoleForView, setSelectedRoleForView] = useState(null);
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState(null);
  const [isManagePermissionsModalOpen, setIsManagePermissionsModalOpen] = useState(false);
  const [selectedRoleForManagePermissions, setSelectedRoleForManagePermissions] = useState(null);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);
  const [isSavingPermissions, setIsSavingPermissions] = useState(false);
  const [managePermissionsError, setManagePermissionsError] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const apiClient = new APIClient();
        const response = await apiClient.get(
          "https://iereip-api.deducesolutions.com/api/v1/admin/roles",
        );
        const apiRoles = response?.data || response || [];
        const mappedRoles = Array.isArray(apiRoles)
          ? apiRoles.map((role) => ({
              id: role.id,
              roleName: role.name || `Role ${role.id}`,
              description: role.description || "",
              users: [],
              permissionCount: Array.isArray(role.permissions)
                ? role.permissions.length
                : 0,
              type: role.id === 1 ? "SYSTEM" : "CUSTOM",
              typeBadge:
                role.id === 1 ? "badge-soft-success" : "badge-soft-warning",
              status: role.is_active ? "ACTIVE" : "INACTIVE",
              statusBadge: role.is_active
                ? "badge-soft-success"
                : "badge-soft-secondary",
              lastModified: role.created_at
                ? new Date(role.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "",
              permissions: Array.isArray(role.permissions)
                ? role.permissions
                : [],
            }))
          : [];

        const defaultRole = mappedRoles.find(
          (role) =>
            role.roleName.toLowerCase().includes("super") || role.id === 1,
        );
        const masterPermissions = defaultRole?.permissions || [];

        setRolesData(mappedRoles);
        setBasePermissions(masterPermissions);

        const permissionState = {};
        mappedRoles.forEach((role) => {
          permissionState[role.id] = {};
          masterPermissions.forEach((perm) => {
            permissionState[role.id][perm.name] = role.permissions.some(
              (rolePerm) => rolePerm.name === perm.name,
            );
          });
        });

        setPermissions(permissionState);
        setFetchError(null);
      } catch (error) {
        console.error("Error loading roles:", error);
        setFetchError("Unable to load roles from the remote API.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const filteredRoles = rolesData.filter(
    (role) =>
      role.roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getPermissionLabel = (permName) => {
    const perm = basePermissions.find((item) => item.name === permName);
    return perm?.description || permName;
  };

  const getRoleIconData = (roleName) => {
    const name = roleName.toLowerCase();
    if (name.includes("superadmin") || name.includes("super admin") || name.includes("super")) {
      return { icon: "star", bgClass: "bg-soft-warning text-warning" };
    }
    if (name.includes("manager")) {
      return { icon: "briefcase", bgClass: "bg-soft-primary text-primary" };
    }
    if (name.includes("teller")) {
      return { icon: "user", bgClass: "bg-soft-success text-success" };
    }
    return { icon: "shield", bgClass: "bg-soft-secondary text-secondary" };
  };

  const toggleAddRoleModal = () => {
    setIsAddRoleModalOpen((prev) => !prev);
    setAddRoleError(null);
  };

  const openEditRoleModal = (role) => {
    setSelectedRoleForEdit(role);
    setEditRoleName(role.roleName || "");
    setEditRoleDescription(role.description || "");
    setEditRoleActive(role.status === "ACTIVE");
    setEditRoleError(null);
    setIsEditRoleModalOpen(true);
  };

  const closeEditRoleModal = () => {
    setSelectedRoleForEdit(null);
    setIsEditRoleModalOpen(false);
    setEditRoleError(null);
  };

  const openViewPermissionsModal = (role) => {
    setSelectedRoleForView(role);
    setIsViewPermissionsModalOpen(true);
  };

  const closeViewPermissionsModal = () => {
    setSelectedRoleForView(null);
    setIsViewPermissionsModalOpen(false);
  };

  const openManagePermissionsModal = (role) => {
    const rolePermissionIds = basePermissions
      .filter((perm) => permissions[role.id]?.[perm.name])
      .map((perm) => perm?.id)
      .filter(Boolean);

    setSelectedRoleForManagePermissions(role);
    setSelectedPermissionIds(rolePermissionIds);
    setManagePermissionsError(null);
    setIsManagePermissionsModalOpen(true);
  };

  const closeManagePermissionsModal = () => {
    setSelectedRoleForManagePermissions(null);
    setSelectedPermissionIds([]);
    setManagePermissionsError(null);
    setIsManagePermissionsModalOpen(false);
  };

  const toggleManagePermissionId = (permissionId) => {
    if (!permissionId) return;
    setSelectedPermissionIds((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId],
    );
  };

  const handleSaveRolePermissions = async () => {
    if (!selectedRoleForManagePermissions) return;

    setIsSavingPermissions(true);
    setManagePermissionsError(null);

    try {
      const apiClient = new APIClient();
      const response = await apiClient.create(
        `https://iereip-api.deducesolutions.com/api/v1/admin/roles/${selectedRoleForManagePermissions.id}/permissions`,
        {
          permission_ids: selectedPermissionIds,
        },
      );

      const result = response?.data?.data || response?.data || response;
      if (!result) {
        throw new Error("Unable to save role permissions.");
      }

      setPermissions((prev) => {
        const updated = { ...prev };
        updated[selectedRoleForManagePermissions.id] = {};
        basePermissions.forEach((perm) => {
          const permId = perm?.id;
          updated[selectedRoleForManagePermissions.id][perm.name] =
            permId && selectedPermissionIds.includes(permId);
        });
        return updated;
      });

      setRolesData((prev) =>
        prev.map((role) =>
          role.id === selectedRoleForManagePermissions.id
            ? {
                ...role,
                permissions: basePermissions.filter(
                  (perm) => perm?.id && selectedPermissionIds.includes(perm.id),
                ),
                permissionCount: selectedPermissionIds.length,
              }
            : role,
        ),
      );

      closeManagePermissionsModal();
    } catch (error) {
      console.error("Error saving role permissions:", error);
      setManagePermissionsError(error?.message || "Unable to save role permissions.");
    } finally {
      setIsSavingPermissions(false);
    }
  };

  const handleAddRole = async () => {
    if (!newRoleName.trim() || !newRoleDescription.trim()) {
      return;
    }

    setIsSavingRole(true);
    setAddRoleError(null);

    try {
      const apiClient = new APIClient();
      const response = await apiClient.create(
        "https://iereip-api.deducesolutions.com/api/v1/admin/roles",
        {
          name: newRoleName.trim(),
          description: newRoleDescription.trim(),
        },
      );

      const createdRole = response?.data?.data || response?.data || response;
      if (!createdRole || !createdRole.id) {
        throw new Error("Unable to create role.");
      }

      const nextId = createdRole.id;
      const newRole = {
        id: nextId,
        roleName: createdRole.name,
        description: createdRole.description || "",
        users: [],
        permissionCount: 0,
        type: "CUSTOM",
        typeBadge: "badge-soft-warning",
        status: createdRole.is_active ? "ACTIVE" : "INACTIVE",
        statusBadge: createdRole.is_active
          ? "badge-soft-success"
          : "badge-soft-secondary",
        lastModified: createdRole.created_at
          ? new Date(createdRole.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "",
        permissions: [],
      };

      const newPermissions = {
        ...permissions,
        [nextId]: {},
      };
      basePermissions.forEach((perm) => {
        newPermissions[nextId][perm.name] = false;
      });

      setRolesData((prev) => [...prev, newRole]);
      setPermissions(newPermissions);
      setNewRoleName("");
      setNewRoleDescription("");
      setIsAddRoleModalOpen(false);
    } catch (error) {
      console.error("Error creating role:", error);
      setAddRoleError(error?.message || "Unable to create role.");
    } finally {
      setIsSavingRole(false);
    }
  };

  const togglePermission = (roleId, permName) => {
    setPermissions((prev) => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [permName]: !prev[roleId]?.[permName],
      },
    }));
  };

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Staff Management" pageTitle="All Permissions" />

        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="border-bottom-dashed pb-3">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <Nav tabs className="nav-tabs-custom border-0 mb-0">
                    <NavItem>
                      <NavLink
                        href="#"
                        className={classnames({ active: activeTab === "1" })}
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveTab("1");
                        }}
                      >
                        <FeatherIcon icon="users" size={16} className="me-1" />
                        All Roles
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        href="#"
                        className={classnames({ active: activeTab === "2" })}
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveTab("2");
                        }}
                      >
                        <FeatherIcon icon="shield" size={16} className="me-1" />
                        Permissions
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        href="#"
                        className={classnames({ active: activeTab === "3" })}
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveTab("3");
                        }}
                      >
                        <FeatherIcon icon="activity" size={16} className="me-1" />
                        Activity Log
                      </NavLink>
                    </NavItem>
                  </Nav>

                  <Button color="primary" onClick={toggleAddRoleModal}>
                    <FeatherIcon icon="plus" size={16} className="me-1" />
                    Add Role
                  </Button>
                </div>

                <Row className="align-items-center">
                  <Col md={6}>
                    <div className="search-box">
                      <Input
                        type="text"
                        placeholder="Search by role name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control"
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </Col>
                  <Col md={6} className="text-end">
                    <Button color="dark" className="me-2" size="sm" outline>
                      <FeatherIcon icon="download" size={15} className="me-1" />
                      Export
                    </Button>
                    <Button color="dark" className="me-2" size="sm" outline>
                      <FeatherIcon icon="settings" size={15} />
                    </Button>
                  </Col>
                </Row>
              </CardHeader>

              <Modal
                centered
                isOpen={isAddRoleModalOpen}
                toggle={toggleAddRoleModal}
              >
                <ModalHeader toggle={toggleAddRoleModal}>Add Role</ModalHeader>
                <ModalBody>
                  <FormGroup>
                    <Label for="roleName">Name</Label>
                    <Input
                      id="roleName"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      placeholder="Enter role name"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="roleDescription">Description</Label>
                    <Input
                      id="roleDescription"
                      type="textarea"
                      value={newRoleDescription}
                      onChange={(e) => setNewRoleDescription(e.target.value)}
                      placeholder="Enter role description"
                    />
                  </FormGroup>
                  {addRoleError && (
                    <div className="alert alert-danger mt-3" role="alert">
                      {addRoleError}
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="secondary" onClick={toggleAddRoleModal} outline>
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    onClick={handleAddRole}
                    disabled={
                      !newRoleName.trim() ||
                      !newRoleDescription.trim() ||
                      isSavingRole
                    }
                  >
                    {isSavingRole ? (
                      <>
                        <Spinner size="sm" className="me-2" /> Saving...
                      </>
                    ) : (
                      "Save Role"
                    )}
                  </Button>
                </ModalFooter>
              </Modal>

              <Modal
                centered
                isOpen={isEditRoleModalOpen}
                toggle={closeEditRoleModal}
              >
                <ModalHeader toggle={closeEditRoleModal}>Edit Role</ModalHeader>
                <ModalBody>
                  <FormGroup>
                    <Label for="editRoleName">Name</Label>
                    <Input
                      id="editRoleName"
                      value={editRoleName}
                      onChange={(e) => setEditRoleName(e.target.value)}
                      placeholder="Enter role name"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="editRoleDescription">Description</Label>
                    <Input
                      id="editRoleDescription"
                      type="textarea"
                      value={editRoleDescription}
                      onChange={(e) => setEditRoleDescription(e.target.value)}
                      placeholder="Enter role description"
                    />
                  </FormGroup>
                  <FormGroup check className="mt-3">
                    <Input
                      type="switch"
                      id="editRoleActive"
                      checked={editRoleActive}
                      onChange={(e) => setEditRoleActive(e.target.checked)}
                    />
                    <Label for="editRoleActive" check>
                      Active
                    </Label>
                  </FormGroup>
                  {editRoleError && (
                    <div className="alert alert-danger mt-3" role="alert">
                      {editRoleError}
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="secondary" onClick={closeEditRoleModal} outline>
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    onClick={async () => {
                      if (!selectedRoleForEdit) return;
                      setIsSavingEdit(true);
                      setEditRoleError(null);
                      try {
                        const apiClient = new APIClient();
                        const response = await apiClient.update(
                          `https://iereip-api.deducesolutions.com/api/v1/admin/roles/${selectedRoleForEdit.id}`,
                          {
                            name: editRoleName.trim(),
                            description: editRoleDescription.trim(),
                            is_active: editRoleActive,
                          },
                        );
                        const updatedRole = response?.data?.data || response?.data || response;
                        if (!updatedRole || !updatedRole.id) {
                          throw new Error("Unable to update role.");
                        }
                        setRolesData((prev) =>
                          prev.map((role) =>
                            role.id === updatedRole.id
                              ? {
                                  ...role,
                                  roleName: updatedRole.name,
                                  description: updatedRole.description || "",
                                  status: updatedRole.is_active ? "ACTIVE" : "INACTIVE",
                                  statusBadge: updatedRole.is_active
                                    ? "badge-soft-success"
                                    : "badge-soft-secondary",
                                  lastModified: updatedRole.created_at
                                    ? new Date(updatedRole.created_at).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })
                                    : role.lastModified,
                                }
                              : role,
                          ),
                        );
                        closeEditRoleModal();
                      } catch (error) {
                        console.error("Error updating role:", error);
                        setEditRoleError(error?.message || "Unable to update role.");
                      } finally {
                        setIsSavingEdit(false);
                      }
                    }}
                    disabled={
                      !editRoleName.trim() ||
                      !editRoleDescription.trim() ||
                      isSavingEdit
                    }
                  >
                    {isSavingEdit ? (
                      <>
                        <Spinner size="sm" className="me-2" /> Saving...
                      </>
                    ) : (
                      "Update Role"
                    )}
                  </Button>
                </ModalFooter>
              </Modal>

              <Modal
                centered
                isOpen={isViewPermissionsModalOpen}
                toggle={closeViewPermissionsModal}
              >
                <ModalHeader toggle={closeViewPermissionsModal}>
                  {selectedRoleForView?.roleName
                    ? `${selectedRoleForView.roleName} Permissions`
                    : "View Permissions"}
                </ModalHeader>
                <ModalBody>
                  {selectedRoleForView ? (
                    <div className="permissions-list">
                      {basePermissions.length === 0 ? (
                        <div className="text-muted py-3">
                          No permissions available.
                        </div>
                      ) : (
                        basePermissions.map((perm) => {
                          const checked =
                            permissions[selectedRoleForView.id]?.[perm.name] ||
                            false;
                          return (
                            <div
                              key={perm.name}
                              className="d-flex align-items-center justify-content-between mb-2 p-2 border-bottom"
                              style={{ fontSize: "0.875rem" }}
                            >
                              <label className="mb-0 cursor-pointer small">
                                {perm.description || perm.name}
                              </label>
                              <div className="form-check form-switch m-0">
                                <Input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={checked}
                                  readOnly
                                />
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-3 text-muted">
                      No role selected.
                    </div>
                  )}
                </ModalBody>
              </Modal>

              <Modal
                centered
                isOpen={isManagePermissionsModalOpen}
                toggle={closeManagePermissionsModal}
              >
                <ModalHeader toggle={closeManagePermissionsModal}>
                  {selectedRoleForManagePermissions?.roleName
                    ? `Manage ${selectedRoleForManagePermissions.roleName} Permissions`
                    : "Manage Permissions"}
                </ModalHeader>
                <ModalBody>
                  {selectedRoleForManagePermissions ? (
                    <div className="permissions-list">
                      {basePermissions.length === 0 ? (
                        <div className="text-muted py-3">
                          No permissions available.
                        </div>
                      ) : (
                        basePermissions.map((perm) => {
                          const permissionId = perm?.id;
                          const checked = permissionId
                            ? selectedPermissionIds.includes(permissionId)
                            : false;
                          return (
                            <div
                              key={perm.name}
                              className="d-flex align-items-center justify-content-between mb-2 p-2 border-bottom"
                              style={{ fontSize: "0.875rem" }}
                            >
                              <div>
                                <div className="small">
                                  {perm.description || perm.name}
                                </div>
                              
                              </div>
                              <div className="form-check form-switch m-0">
                                <Input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleManagePermissionId(permissionId)}
                                  disabled={!permissionId}
                                />
                              </div>
                            </div>
                          );
                        })
                      )}
                      {managePermissionsError && (
                        <div className="alert alert-danger mt-3" role="alert">
                          {managePermissionsError}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-3 text-muted">
                      No role selected.
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="secondary"
                    onClick={closeManagePermissionsModal}
                    outline
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    onClick={handleSaveRolePermissions}
                    disabled={isSavingPermissions}
                  >
                    {isSavingPermissions ? (
                      <>
                        <Spinner size="sm" className="me-2" /> Save Permissions
                      </>
                    ) : (
                      "Save Permissions"
                    )}
                  </Button>
                </ModalFooter>
              </Modal>

              <CardBody className="pt-4">
                {loading && (
                  <div className="text-center py-5">
                    <Spinner color="primary" />
                  </div>
                )}
                {fetchError && (
                  <div className="alert alert-warning" role="alert">
                    {fetchError}
                  </div>
                )}

                {activeTab === "1" && (
                  <Row className="align-items-center mb-3">
                    <Col className="text-end">
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
                        size="sm"
                        outline={viewMode !== "grid"}
                        onClick={() => setViewMode("grid")}
                      >
                        <FeatherIcon icon="grid" size={15} className="me-1" />
                        Grid
                      </Button>
                    </Col>
                  </Row>
                )}

                {activeTab === "1" &&
                  (viewMode === "table" ? (
                    <Table className="table-borderless align-middle mb-0" hover>
                      <thead>
                        <tr>
                          <th>Role Name</th>
                          {/* <th>Staff</th> */}
                          <th>Type</th>
                          <th>Status</th>
                          <th>Permissions</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRoles.map((role) => (
                          <tr key={role.id}>
                            <td>
                              <h6 className="mb-1 fw-semibold">
                                {role.roleName.charAt(0).toUpperCase() +
                                  role.roleName.slice(1)}
                              </h6>
                              <p className="text-muted mb-0 small">
                                {role.description}
                              </p>
                            </td>
                            {/* <td>
                              <div className="d-flex align-items-center">
                                <div className="avatar-group me-2">
                                  {role.users.slice(0, 3).map((user, index) => (
                                    <div key={index} className="avatar-group-item">
                                      <img
                                        src={`/src/assets/images/users/${user.avatar}`}
                                        alt={user.name}
                                        className="rounded-circle avatar-xs"
                                        title={user.name}
                                      />
                                    </div>
                                  ))}
                                  {role.users.length > 3 && (
                                    <div className="avatar-group-item">
                                      <div className="avatar-xs">
                                        <span className="avatar-title rounded-circle bg-light text-primary">
                                          +{role.users.length - 3}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <span className="text-muted small">({role.users.length})</span>
                              </div>
                            </td> */}
                            <td>
                              <Badge className={role.type === "SYSTEM" ? "bg-danger-subtle text-danger rounded-pill" : "bg-primary-subtle text-primary rounded-pill"}>
                                {role.type}
                              </Badge>
                            </td>
                            <td>
                              <Badge className={role.status === "ACTIVE" ? "bg-success-subtle text-success rounded-pill" : "bg-danger-subtle text-danger rounded-pill"}>
                                {role.status}
                              </Badge>
                            </td>
                            <td>
                              <span className="fw-semibold">
                                {role.permissionCount}
                              </span>
                            </td>
                            <td className="text-end">
                              <Button
                                color="light"
                                size="sm"
                                className="me-2"
                                onClick={() => openViewPermissionsModal(role)}
                              >
                                <FeatherIcon icon="eye" size={14} />
                              </Button>
                              <Button
                                color="light"
                                size="sm"
                                className="me-2"
                                onClick={() => openManagePermissionsModal(role)}
                              >
                                <FeatherIcon icon="plus-circle" size={14} />
                              </Button>
                              <Button
                                color="light"
                                size="sm"
                                className="me-2"
                                onClick={() => openEditRoleModal(role)}
                              >
                                <FeatherIcon icon="edit" size={14} />
                              </Button>
                              <Button color="light" size="sm">
                                <FeatherIcon icon="trash-2" size={14} />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <Row className="g-3">
                      {filteredRoles.map((role) => (
                        <Col md={6} lg={4} key={role.id}>
                          <Card className="shadow-sm h-100 border">
                            <CardBody>
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <h6 className="mb-1 fw-semibold">
                                    {role.roleName}
                                  </h6>
                                  <p className="text-muted mb-0 small">
                                    {role.description}
                                  </p>
                                </div>
                              </div>
                              <div className="mb-3">
                                {/* <div className="d-flex align-items-center mb-2">
                                  <div className="avatar-group me-2">
                                    {role.users.slice(0, 3).map((user, index) => (
                                      <div key={index} className="avatar-group-item">
                                        <img
                                          src={`/src/assets/images/users/${user.avatar}`}
                                          alt={user.name}
                                          className="rounded-circle avatar-xs"
                                          title={user.name}
                                        />
                                      </div>
                                    ))}
                                    {role.users.length > 3 && (
                                      <div className="avatar-group-item">
                                        <div className="avatar-xs">
                                          <span className="avatar-title rounded-circle bg-light text-primary">
                                            +{role.users.length - 3}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <span className="text-muted small">({role.users.length})</span>
                                </div> */}
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <Badge
                                    className={role.type === "SYSTEM" ? "bg-success-subtle text-success rounded-pill" : "bg-warning-subtle text-warning rounded-pill"}
                                  >
                                    {role.type}
                                  </Badge>
                                  <Badge
                                    className={role.status === "ACTIVE" ? "bg-success-subtle text-success rounded-pill" : "bg-danger-subtle text-danger rounded-pill"}
                                  >
                                    {role.status}
                                  </Badge>
                                </div>
                                <div className="text-muted small">
                                  <strong>{role.permissionCount}</strong>{" "}
                                  permissions
                                </div>
                              </div>
                              <div className="d-flex gap-2">
                                <Button
                                  color="light"
                                  size="sm"
                                  className="flex-grow-1"
                                  onClick={() => openViewPermissionsModal(role)}
                                >
                                  <FeatherIcon icon="eye" size={14} />
                                </Button>
                                <Button
                                  color="light"
                                  size="sm"
                                  className="flex-grow-1"
                                  onClick={() => openManagePermissionsModal(role)}
                                >
                                  <FeatherIcon icon="plus-circle" size={14} />
                                </Button>
                                <Button
                                  color="light"
                                  size="sm"
                                  className="flex-grow-1"
                                  onClick={() => openEditRoleModal(role)}
                                >
                                  <FeatherIcon icon="edit" size={14} />
                                </Button>
                                <Button
                                  color="light"
                                  size="sm"
                                  className="flex-grow-1"
                                >
                                  <FeatherIcon icon="trash-2" size={14} />
                                </Button>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ))}

                {activeTab === "2" &&
                  !loading &&
                  rolesData.length === 0 &&
                  !fetchError && (
                    <div className="text-center py-5 text-muted">
                      No role permissions are available.
                    </div>
                  )}
                {activeTab === "2" && rolesData.length > 0 && (
                  <Row>
                    {rolesData.map((role) => (
                      <Col md={6} lg={4} key={role.id} className="mb-4">
                        <Card className="border shadow-sm">
                          <CardBody>
                            <div className="lh-1 mb-3">
                              {(() => {
                                const { icon, bgClass } = getRoleIconData(role.roleName);
                                return (
                                  <div className="d-flex align-items-center gap-2 mb-2">
                                    <div className={`rounded-circle d-inline-flex align-items-center justify-content-center p-2 ${bgClass}`}>
                                      <FeatherIcon icon={icon} size={18} />
                                    </div>
                                    <h6 className="fw-bold mb-0 fs-3">
                                      {role.roleName.charAt(0).toUpperCase() +
                                        role.roleName.slice(1)}
                                    </h6>
                                  </div>
                                );
                              })()}

                              <p className="mb-0">{role.permissions.length} permissions</p>
                            </div>
                            <div className="permissions-list">
                              {basePermissions.map((perm) => (
                                <div
                                  key={perm.name}
                                  className="d-flex align-items-center justify-content-between mb-2 p-2 border-bottom"
                                  style={{ fontSize: "0.875rem" }}
                                >
                                  <label className="mb-0 cursor-pointer small">
                                    {perm.description || perm.name}
                                  </label>
                                  <div className="form-check form-switch m-0">
                                    <Input
                                      className="form-check-input"
                                      type="switch"
                                      id={`perm_${role.id}_${perm.name}`}
                                      checked={
                                        permissions[role.id]?.[perm.name] ||
                                        false
                                      }
                                      readOnly
                                      style={{
                                        width: "40px",
                                        height: "20px",
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}

                {activeTab === "3" && (
                  <div className="text-center py-5">
                    <p className="text-muted">Activity Log coming soon...</p>
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

export default AllPermissions;
