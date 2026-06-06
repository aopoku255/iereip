import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, Col, Container, Form, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane, Spinner, Button } from "reactstrap";
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import progileBg from "../../assets/images/profile-bg.jpg";
import { getUserById } from "../../slices/thunks";

const ViewUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("1");

  const requiredLabel = (text) => (
    <>
      {text} <span className="text-danger">*</span>
    </>
  );

  const { selectedUser, selectedUserLoading, selectedUserError } = useSelector((state) => state.Users || {});

  useEffect(() => {
    if (id) {
      dispatch(getUserById(id));
    }
  }, [dispatch, id]);

  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const profileImage = selectedUser?.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser?.full_name || "User")}&background=0D8ABC&color=fff&size=128`;
  const dateOfBirth = selectedUser?.date_of_birth ? new Date(selectedUser.date_of_birth) : null;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="position-relative mx-n4 mt-n4">
            <div className="profile-wid-bg profile-setting-img">
              <img src={progileBg} className="profile-wid-img" alt="profile-bg" />
              <div className="overlay-content">
                <div className="text-end p-3">
                  <div className="p-0 ms-auto rounded-circle profile-photo-edit">
                    <Input id="profile-foreground-img-file-input" type="file" className="profile-foreground-img-file-input" disabled />
                   
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Row>
            <Col xxl={3}>
              <Card className="mt-n5">
                <CardBody className="p-4">
                  <div className="text-center">
                    <div className="profile-user position-relative d-inline-block mx-auto mb-4">
                      <img src={profileImage} className="rounded-circle avatar-xl img-thumbnail user-profile-image" alt="user-profile" />
                      <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                        <Input id="profile-img-file-input" type="file" className="profile-img-file-input" disabled />
                        <Label htmlFor="profile-img-file-input" className="profile-photo-edit avatar-xs">
                          <span className="avatar-title rounded-circle bg-light text-body">
                            <i className="ri-camera-fill"></i>
                          </span>
                        </Label>
                      </div>
                    </div>
                    <h5 className="fs-16 mb-1">{selectedUser?.full_name || "-"}</h5>
                    <p className="text-muted mb-0">{selectedUser?.user_id || "-"}</p>
                  </div>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <div className="d-flex align-items-center mb-4">
                    <div className="flex-grow-1">
                      <h5 className="card-title mb-0">Account Info</h5>
                    </div>
                    <div className="flex-shrink-0">
                      <Button color="light" size="sm" disabled>
                        <i className="ri-information-line align-bottom me-1"></i> Info
                      </Button>
                    </div>
                  </div>
                  <div className="mb-3 d-flex">
                    <div className="avatar-xs d-block flex-shrink-0 me-3">
                      <span className="avatar-title rounded-circle fs-16 bg-body text-body">
                        <i className="ri-id-card-line"></i>
                      </span>
                    </div>
                    <Input type="email" className="form-control" placeholder="User ID" value={selectedUser?.user_id || "-"} disabled />
                  </div>
                  <div className="mb-3 d-flex">
                    <div className="avatar-xs d-block flex-shrink-0 me-3">
                      <span className="avatar-title rounded-circle fs-16 bg-primary-subtle text-primary">
                        <i className="ri-building-4-line"></i>
                      </span>
                    </div>
                    <Input type="text" className="form-control" placeholder="Branch" value={selectedUser?.branch?.name || "-"} disabled />
                  </div>
                  <div className="mb-3 d-flex">
                    <div className="avatar-xs d-block flex-shrink-0 me-3">
                      <span className="avatar-title rounded-circle fs-16 bg-success-subtle text-success">
                        <i className="ri-briefcase-4-line"></i>
                      </span>
                    </div>
                    <Input type="text" className="form-control" placeholder="Account Type" value={selectedUser?.account_type || "-"} disabled />
                  </div>
                  <div className="d-flex">
                    <div className="avatar-xs d-block flex-shrink-0 me-3">
                      <span className="avatar-title rounded-circle fs-16 bg-danger-subtle text-danger">
                        <i className="ri-shield-check-line"></i>
                      </span>
                    </div>
                    <Input type="text" className="form-control" placeholder="Status" value={selectedUser?.is_active ? "Active" : "Inactive"} disabled />
                  </div>
                </CardBody>
              </Card>
              <Card className="mt-4">
                <CardBody>
                  <div className="d-flex align-items-center mb-4">
                    <div className="flex-grow-1">
                      <h5 className="card-title mb-0">Savings & Account Type</h5>
                    </div>
                  </div>
                  <div className="mb-3">
                    <Label htmlFor="accountTypeInput" className="form-label">Account Type</Label>
                    <Input type="text" id="accountTypeInput" value={selectedUser?.account_type || ""} className="form-control" disabled />
                  </div>
                  <div className="mb-3">
                    <Label htmlFor="savingsFrequencyInput" className="form-label">Savings Frequency</Label>
                    <Input type="text" id="savingsFrequencyInput" value={selectedUser?.savings_accounts?.[0]?.frequency || selectedUser?.savings_frequency || ""} className="form-control" disabled />
                  </div>
                  <div className="mb-3">
                    <Label htmlFor="savingsAmountInput" className="form-label">Savings Amount</Label>
                    <Input
                      type="text"
                      id="savingsAmountInput"
                      value={selectedUser?.savings_accounts?.[0]?.contribution_amount ?? selectedUser?.savings_amount ?? ""}
                      className="form-control"
                      disabled
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xxl={9}>
              <Card className="mt-xxl-n5">
                <CardHeader>
                  <Nav className="nav-tabs-custom rounded card-header-tabs border-bottom-0" role="tablist">
                    <NavItem>
                      <NavLink className={classnames({ active: activeTab === "1" })} onClick={() => tabChange("1")}> 
                        <i className="fas fa-home"></i> Personal Details
                      </NavLink>
                    </NavItem>
                  </Nav>
                </CardHeader>
                <CardBody className="p-4">
                  {selectedUserLoading ? (
                    <div className="text-center py-5">
                      <Spinner color="primary" />
                    </div>
                  ) : selectedUserError ? (
                    <div className="text-danger py-4">{selectedUserError}</div>
                  ) : (
                    <TabContent activeTab={activeTab}>
                      <TabPane tabId="1">
                        <Form>
                          <Row>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="firstnameInput" className="form-label">First Name</Label>
                                <Input type="text" className="form-control" id="firstnameInput" value={selectedUser?.first_name || ""} disabled />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="lastnameInput" className="form-label">Last Name</Label>
                                <Input type="text" className="form-control" id="lastnameInput" value={selectedUser?.last_name || ""} disabled />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="phonenumberInput" className="form-label">Phone Number</Label>
                                <Input type="text" className="form-control" id="phonenumberInput" value={selectedUser?.mobile_number || ""} disabled />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="emailInput" className="form-label">Email Address</Label>
                                <Input type="email" className="form-control" id="emailInput" value={selectedUser?.email || ""} disabled />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="dobInput" className="form-label">Date of Birth</Label>
                                <Flatpickr className="form-control" value={dateOfBirth} options={{ dateFormat: "d M, Y" }} disabled />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="professionInput" className="form-label">Profession</Label>
                                <Input type="text" className="form-control" id="professionInput" value={selectedUser?.profession || ""} disabled />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="genderInput" className="form-label">Gender</Label>
                                <Input type="text" className="form-control" id="genderInput" value={selectedUser?.gender || ""} disabled />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="maritalStatusInput" className="form-label">Marital Status</Label>
                                <Input type="text" className="form-control" id="maritalStatusInput" value={selectedUser?.marital_status || ""} disabled />
                              </div>
                            </Col>
                            <Col lg={12}>
                              <div className="mb-3">
                                <Label htmlFor="residentialAddressInput" className="form-label">Residential Address</Label>
                                <Input type="text" className="form-control" id="residentialAddressInput" value={selectedUser?.residential_address || ""} disabled />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="gpsAddressInput" className="form-label">GPS Address</Label>
                                <Input type="text" className="form-control" id="gpsAddressInput" value={selectedUser?.gps_address || ""} disabled />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="idTypeInput" className="form-label">ID Type</Label>
                                <Input type="text" className="form-control" id="idTypeInput" value={selectedUser?.id_type || ""} disabled />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="idNumberInput" className="form-label">ID Number</Label>
                                <Input type="text" className="form-control" id="idNumberInput" value={selectedUser?.id_number || ""} disabled />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="idExpiryInput" className="form-label">ID Expiry</Label>
                                <Input type="text" className="form-control" id="idExpiryInput" value={selectedUser?.id_expiry || ""} disabled />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="nokNameInput" className="form-label">Next of Kin Name</Label>
                                <Input type="text" className="form-control" id="nokNameInput" value={selectedUser?.nok_full_name || ""} disabled />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="nokPhoneInput" className="form-label">Next of Kin Phone</Label>
                                <Input type="text" className="form-control" id="nokPhoneInput" value={selectedUser?.nok_phone || ""} disabled />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="nokEmailInput" className="form-label">Next of Kin Email</Label>
                                <Input type="email" className="form-control" id="nokEmailInput" value={selectedUser?.nok_email || ""} disabled />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="nokRelationInput" className="form-label">Next of Kin Relation</Label>
                                <Input type="text" className="form-control" id="nokRelationInput" value={selectedUser?.nok_relation || ""} disabled />
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      </TabPane>
                    </TabContent>
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

export default ViewUser;
