import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Badge,
  Spinner,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Table,
  Input,
  Label
} from "reactstrap";
import classnames from "classnames";
import { fetchAdminProfile } from "../../slices/auth/profile/thunk";

//import images
import progileBg from "../../assets/images/profile-bg.jpg";
import userDummyImg from "../../assets/images/users/user-dummy-img.jpg";

const AdminProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("1");

  const { adminProfile, adminLoading, adminError } = useSelector(
    (state) => state.Profile
  );

  useEffect(() => {
    dispatch(fetchAdminProfile());
  }, [dispatch]);

  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  if (adminLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner color="primary" />
      </div>
    );
  }

  if (adminError || !adminProfile) {
    return (
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <div className="alert alert-danger" role="alert">
                    {adminError || "Failed to load admin profile"}
                  </div>
                  <Button color="secondary" onClick={() => navigate(-1)}>
                    Go Back
                  </Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  const profile = adminProfile;

  return (
    <div className="page-content">
      <Container fluid>
        <div className="position-relative mx-n4 mt-n4">
          <div className="profile-wid-bg profile-setting-img">
            <img src={progileBg} className="profile-wid-img" alt="" />
          </div>
        </div>

        <Row>
          <Col xxl={3}>
            <Card className="mt-n5">
              <CardBody className="p-4">
                <div className="text-center">
                  <div className="profile-user position-relative d-inline-block mx-auto mb-4">
                    <img
                      src={userDummyImg}
                      className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                      alt="admin-profile"
                    />
                  </div>
                  <h5 className="fs-16 mb-1">{profile?.full_name || "Admin"}</h5>
                  <p className="text-muted mb-0">
                    {profile?.role?.name && (
                      <Badge bg="primary">
                        {profile.role.name.charAt(0).toUpperCase() + profile.role.name.slice(1)}
                      </Badge>
                    )}
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="mb-3">
                  <h6 className="card-title mb-3">
                    <i className="ri-mail-line align-bottom me-2"></i>
                    Contact Information
                  </h6>
                </div>
                <div className="mb-3">
                  <Label className="form-label text-muted mb-1">Email</Label>
                  <p className="fw-semibold mb-3">{profile?.email || "N/A"}</p>
                </div>
                <div className="mb-3">
                  <Label className="form-label text-muted mb-1">Phone</Label>
                  <p className="fw-semibold mb-3">{profile?.phone || "N/A"}</p>
                </div>
                <div className="mb-3">
                  <Label className="form-label text-muted mb-1">Admin ID</Label>
                  <p className="fw-semibold">{profile?.admin_id || "N/A"}</p>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="mb-3">
                  <h6 className="card-title mb-3">
                    <i className="ri-shield-line align-bottom me-2"></i>
                    Status
                  </h6>
                </div>
                <div className="mb-3">
                  <Label className="form-label text-muted mb-1">Account Status</Label>
                  <p className="fw-semibold mb-3">
                    {profile?.is_active ? (
                      <Badge bg="success">
                        <i className="ri-check-line me-1"></i>Active
                      </Badge>
                    ) : (
                      <Badge bg="danger">
                        <i className="ri-close-line me-1"></i>Inactive
                      </Badge>
                    )}
                  </p>
                </div>
                <div className="mb-3">
                  <Label className="form-label text-muted mb-1">Password Change Required</Label>
                  <p className="fw-semibold">
                    {profile?.must_change_password ? (
                      <Badge bg="warning">Yes</Badge>
                    ) : (
                      <Badge bg="success">No</Badge>
                    )}
                  </p>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col xxl={9}>
            <Card className="mt-xxl-n5">
              <CardHeader>
                <Nav
                  className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                  role="tablist"
                >
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "1" })}
                      onClick={() => tabChange("1")}
                      type="button"
                    >
                      <i className="fas fa-info-circle"></i>
                      Personal Details
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "2" })}
                      onClick={() => tabChange("2")}
                      type="button"
                    >
                      <i className="fas fa-shield-alt"></i>
                      Role & Permissions
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "3" })}
                      onClick={() => tabChange("3")}
                      type="button"
                    >
                      <i className="fas fa-history"></i>
                      Activity
                    </NavLink>
                  </NavItem>
                </Nav>
              </CardHeader>

              <CardBody className="p-4">
                <TabContent activeTab={activeTab}>
                  {/* Personal Details Tab */}
                  <TabPane tabId="1">
                    <Row>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">First Name</Label>
                          <Input
                            type="text"
                            className="form-control"
                            defaultValue={profile?.first_name || ""}
                            disabled
                          />
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">Last Name</Label>
                          <Input
                            type="text"
                            className="form-control"
                            defaultValue={profile?.last_name || ""}
                            disabled
                          />
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">Full Name</Label>
                          <Input
                            type="text"
                            className="form-control"
                            defaultValue={profile?.full_name || ""}
                            disabled
                          />
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">Admin ID</Label>
                          <Input
                            type="text"
                            className="form-control"
                            defaultValue={profile?.admin_id || ""}
                            disabled
                          />
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">Email Address</Label>
                          <Input
                            type="email"
                            className="form-control"
                            defaultValue={profile?.email || ""}
                            disabled
                          />
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">Phone Number</Label>
                          <Input
                            type="text"
                            className="form-control"
                            defaultValue={profile?.phone || "N/A"}
                            disabled
                          />
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">Account Status</Label>
                          <Input
                            type="text"
                            className="form-control"
                            defaultValue={profile?.is_active ? "Active" : "Inactive"}
                            disabled
                          />
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label className="form-label">Password Change Required</Label>
                          <Input
                            type="text"
                            className="form-control"
                            defaultValue={profile?.must_change_password ? "Yes" : "No"}
                            disabled
                          />
                        </div>
                      </Col>
                      <Col lg={12}>
                        <div className="mb-3">
                          <Label className="form-label">Last Login</Label>
                          <Input
                            type="text"
                            className="form-control"
                            defaultValue={profile?.last_login ? new Date(profile.last_login).toLocaleString() : "N/A"}
                            disabled
                          />
                        </div>
                      </Col>
                      <Col lg={12}>
                        <div className="mb-3">
                          <Label className="form-label">Account Created</Label>
                          <Input
                            type="text"
                            className="form-control"
                            defaultValue={profile?.created_at ? new Date(profile.created_at).toLocaleString() : "N/A"}
                            disabled
                          />
                        </div>
                      </Col>
                    </Row>
                  </TabPane>

                  {/* Role & Permissions Tab */}
                  <TabPane tabId="2">
                    {profile?.role && (
                      <>
                        <div className="mb-4">
                          <h6 className="card-title mb-3">Role Information</h6>
                          <Row>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label className="form-label">Role Name</Label>
                                <div>
                                  <Badge bg="primary" className="p-2">
                                    {profile.role.name.toUpperCase()}
                                  </Badge>
                                </div>
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label className="form-label">Role Status</Label>
                                <div>
                                  {profile.role.is_active ? (
                                    <Badge bg="success">Active</Badge>
                                  ) : (
                                    <Badge bg="danger">Inactive</Badge>
                                  )}
                                </div>
                              </div>
                            </Col>
                            <Col lg={12}>
                              <div className="mb-3">
                                <Label className="form-label">Role Description</Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  defaultValue={profile.role.description || "N/A"}
                                  disabled
                                />
                              </div>
                            </Col>
                          </Row>
                        </div>

                        <hr />

                        <div className="mt-4">
                          <h6 className="card-title mb-3">Permissions</h6>
                          {profile?.permissions && profile.permissions.length > 0 ? (
                            <div className="table-responsive">
                              <Table borderless className="mb-0">
                                <tbody>
                                  {[...new Set(profile.permissions)].map((permission, index) => (
                                    <tr key={index}>
                                      <td>
                                        <Badge bg="light" text="dark" className="p-2 fs-12">
                                          <i className="ri-check-fill text-success me-1"></i>
                                          {permission.replace(/_/g, " ").toUpperCase()}
                                        </Badge>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </div>
                          ) : (
                            <p className="text-muted">No permissions assigned</p>
                          )}
                        </div>
                      </>
                    )}
                  </TabPane>

                  {/* Activity Tab */}
                  <TabPane tabId="3">
                    <div className="table-responsive">
                      <Table borderless className="align-middle mb-0">
                        <tbody>
                          <tr>
                            <td>
                              <h6 className="mb-0">Last Login</h6>
                              <p className="text-muted mb-0">
                                {profile?.last_login
                                  ? new Date(profile.last_login).toLocaleString()
                                  : "No login record"}
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h6 className="mb-0">Account Created</h6>
                              <p className="text-muted mb-0">
                                {profile?.created_at
                                  ? new Date(profile.created_at).toLocaleString()
                                  : "N/A"}
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h6 className="mb-0">Account Status</h6>
                              <p className="text-muted mb-0">
                                {profile?.is_active ? (
                                  <Badge bg="success">Active</Badge>
                                ) : (
                                  <Badge bg="danger">Inactive</Badge>
                                )}
                              </p>
                            </td>
                          </tr>
                          {profile?.role && (
                            <tr>
                              <td>
                                <h6 className="mb-0">Role Created</h6>
                                <p className="text-muted mb-0">
                                  {profile.role.created_at
                                    ? new Date(profile.role.created_at).toLocaleString()
                                    : "N/A"}
                                </p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
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

export default AdminProfile;
