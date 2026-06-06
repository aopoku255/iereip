import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, Col, Container, Form, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane, Spinner, Button } from "reactstrap";
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import progileBg from "../../assets/images/profile-bg.jpg";
import { getUserById, updateUser, updateAccountType, uploadUserPhoto } from "../../slices/thunks";
import { resetUserUpdateStatus, resetAccountTypeStatus, resetPhotoUploadStatus } from "../../slices/users";

const EditUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("1");
  const [formData, setFormData] = useState({});
  const requiredLabel = (text) => (
    <>
      {text} <span className="text-danger">*</span>
    </>
  );

  const {
    selectedUser,
    selectedUserLoading,
    selectedUserError,
    updateLoading,
    updateError,
    updateSuccess,
    accountTypeLoading,
    accountTypeError,
    accountTypeSuccess,
    photoUploadLoading,
    photoUploadError,
    photoUploadSuccess,
  } = useSelector((state) => state.Users || {});

  useEffect(() => {
    if (id) {
      dispatch(getUserById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (updateSuccess) {
      toast.success("Profile updated successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      dispatch(resetUserUpdateStatus());
    }

    if (updateError) {
      toast.error(updateError || "Profile update failed", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      dispatch(resetUserUpdateStatus());
    }
  }, [updateSuccess, updateError, dispatch]);

  useEffect(() => {
    if (photoUploadSuccess) {
      toast.success("Profile photo updated successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      dispatch(resetPhotoUploadStatus());
    }

    if (photoUploadError) {
      toast.error(photoUploadError || "Photo upload failed", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      dispatch(resetPhotoUploadStatus());
    }
  }, [photoUploadSuccess, photoUploadError, dispatch]);

  useEffect(() => {
    if (accountTypeSuccess) {
      toast.success("Account type updated successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      dispatch(resetAccountTypeStatus());
    }

    if (accountTypeError) {
      toast.error(accountTypeError || "Account type update failed", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      dispatch(resetAccountTypeStatus());
    }
  }, [accountTypeSuccess, accountTypeError, dispatch]);

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        first_name: selectedUser.first_name || "",
        last_name: selectedUser.last_name || "",
        email: selectedUser.email || "",
        mobile_number: selectedUser.mobile_number || "",
        secondary_number: selectedUser.secondary_number || "",
        profession: selectedUser.profession || "",
        gender: selectedUser.gender || "",
        marital_status: selectedUser.marital_status || "",
        residential_address: selectedUser.residential_address || "",
        gps_address: selectedUser.gps_address || "",
        id_type: selectedUser.id_type || "",
        id_number: selectedUser.id_number || "",
        id_expiry: selectedUser.id_expiry || "",
        nok_full_name: selectedUser.nok_full_name || "",
        nok_phone: selectedUser.nok_phone || "",
        nok_email: selectedUser.nok_email || "",
        nok_relation: selectedUser.nok_relation || "",
        account_type: selectedUser.account_type || "",
        savings_frequency: selectedUser.savings_frequency || selectedUser.savings_accounts?.[0]?.frequency || "",
        savings_amount: (selectedUser.savings_amount ?? selectedUser.savings_accounts?.[0]?.contribution_amount) || "",
        date_of_birth: selectedUser.date_of_birth || null,
      });
    }
  }, [selectedUser]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, date_of_birth: date[0] ? date[0].toISOString().split("T")[0] : "" }));
  };

  const handleSave = async () => {
    dispatch(updateUser({ user_id: id, payload: formData }));
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !id) return;

    dispatch(uploadUserPhoto({ user_id: id, file }));
  };

  const handleAccountTypeUpdate = () => {
    if (!id) return;

    const payload = {
      account_type: formData.account_type,
      savings_amount: formData.savings_amount ? Number(formData.savings_amount) : 0,
      savings_frequency: formData.savings_frequency,
    };

    dispatch(updateAccountType({ user_id: id, payload }));
  };

  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const profileImage = selectedUser?.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser?.full_name || "User")}&background=0D8ABC&color=fff&size=128`;

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
                        <img
                          src={profileImage}
                          className={`rounded-circle avatar-xl img-thumbnail user-profile-image ${photoUploadLoading ? "opacity-75" : ""}`}
                          alt="user-profile"
                        />
                        {photoUploadLoading && (
                          <div className="position-absolute top-50 start-50 translate-middle d-flex align-items-center justify-content-center rounded-circle" style={{ width: "96px", height: "96px", background: "rgba(255,255,255,0.75)" }}>
                            <Spinner size="sm" color="primary" />
                          </div>
                        )}
                        <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                          <Input
                            id="profile-img-file-input"
                            type="file"
                            className="profile-img-file-input"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            disabled={photoUploadLoading}
                          />
                          <Label htmlFor="profile-img-file-input" className="profile-photo-edit avatar-xs" title="Change profile photo">
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
                    <Input type="text" className="form-control" placeholder="Account Type" value={selectedUser?.account_type || ""} disabled />
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
                    <Input type="select" id="accountTypeInput" name="account_type" value={formData.account_type} onChange={handleInputChange}>
                      <option value="">Select account type</option>
                      <option value="savings">Savings</option>
                      <option value="loans">Loans</option>
                      <option value="both">Both</option>
                    </Input>
                  </div>
                  <div className="mb-3">
                    <Label htmlFor="savingsFrequencyInput" className="form-label">Savings Frequency</Label>
                    <Input type="select" id="savingsFrequencyInput" name="savings_frequency" value={formData.savings_frequency} onChange={handleInputChange}>
                      <option value="">Select frequency</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </Input>
                  </div>
                  <div className="mb-3">
                    <Label htmlFor="savingsAmountInput" className="form-label">Savings Amount</Label>
                    <Input type="number" className="form-control" id="savingsAmountInput" name="savings_amount" value={formData.savings_amount} onChange={handleInputChange} />
                  </div>
                  {accountTypeError && <div className="text-danger mb-3">{accountTypeError}</div>}
                  <div className="d-grid">
                    <Button
                      type="button"
                      color="primary"
                      onClick={handleAccountTypeUpdate}
                      disabled={accountTypeLoading}
                    >
                      {accountTypeLoading ? "Updating..." : "Update Savings"}
                    </Button>
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
                          <div className="border-bottom mb-3 pb-2">
                            <h5 className="card-title mb-0 text-primary">Personal Details</h5>
                            <p className="text-muted mb-0">Required fields are marked with <span className="text-danger">*</span>.</p>
                          </div>
                          <Row>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="firstnameInput" className="form-label">{requiredLabel("First Name")}</Label>
                                <Input type="text" className="form-control" id="firstnameInput" name="first_name" value={formData.first_name} onChange={handleInputChange} />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="lastnameInput" className="form-label">{requiredLabel("Last Name")}</Label>
                                <Input type="text" className="form-control" id="lastnameInput" name="last_name" value={formData.last_name} onChange={handleInputChange} />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="othernameInput" className="form-label">Other Name</Label>
                                <Input type="text" className="form-control" id="othernameInput" name="other_name" value={formData.other_name} onChange={handleInputChange} />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="dobInput" className="form-label">{requiredLabel("Date of Birth")}</Label>
                                <Flatpickr className="form-control" placeholder="Select date" value={formData.date_of_birth ? new Date(formData.date_of_birth) : null} options={{ dateFormat: "d M, Y" }} onChange={handleDateChange} />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="genderInput" className="form-label">{requiredLabel("Gender")}</Label>
                                <Input type="select" id="genderInput" name="gender" value={formData.gender} onChange={handleInputChange}>
                                  <option value="">Select gender</option>
                                  <option value="male">Male</option>
                                  <option value="female">Female</option>
                                </Input>
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="professionInput" className="form-label">{requiredLabel("Profession")}</Label>
                                <Input type="text" className="form-control" id="professionInput" name="profession" value={formData.profession} onChange={handleInputChange} />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="maritalStatusInput" className="form-label">{requiredLabel("Marital Status")}</Label>
                                <Input type="select" className="form-control" id="maritalStatusInput" name="marital_status" value={formData.marital_status} onChange={handleInputChange}>
                                  <option value="">Select marital status</option>
                                  <option value="Single">Single</option>
                                  <option value="Married">Married</option>
                                  <option value="Divorced">Divorced</option>
                                  <option value="Widowed">Widowed</option>
                                </Input>
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="idTypeInput" className="form-label">{requiredLabel("ID Type")}</Label>
                                <Input type="select" className="form-control" id="idTypeInput" name="id_type" value={formData.id_type} onChange={handleInputChange}>
                                  <option value="">Select ID type</option>
                                  <option value="National ID">National ID</option>
                                  <option value="Voters ID">Voters ID</option>
                                  <option value="Drivers License">Drivers License</option>
                                  <option value="Passport">Passport</option>
                                </Input>
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="idNumberInput" className="form-label">{requiredLabel("ID Number")}</Label>
                                <Input type="text" className="form-control" id="idNumberInput" name="id_number" value={formData.id_number} onChange={handleInputChange} />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="idExpiryInput" className="form-label">{requiredLabel("ID Expiry")}</Label>
                                <Flatpickr className="form-control" id="idExpiryInput" placeholder="Select expiry date" value={formData.id_expiry ? new Date(formData.id_expiry) : null} options={{ dateFormat: "d M, Y" }} onChange={(date) => setFormData((prev) => ({ ...prev, id_expiry: date[0] ? date[0].toISOString().split("T")[0] : "" }))} />
                              </div>
                            </Col>
                          </Row>

                          <div className="border-bottom mt-4 mb-3 pb-2">
                            <h5 className="card-title mb-0 text-primary">Contact Information</h5>
                          </div>
                          <Row>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="emailInput" className="form-label">Email Address</Label>
                                <Input type="email" className="form-control" id="emailInput" name="email" value={formData.email} onChange={handleInputChange} />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="phonenumberInput" className="form-label">{requiredLabel("Phone Number")}</Label>
                                <Input type="text" className="form-control" id="phonenumberInput" name="mobile_number" value={formData.mobile_number} onChange={handleInputChange} />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="secondaryNumberInput" className="form-label">Secondary Number</Label>
                                <Input type="text" className="form-control" id="secondaryNumberInput" name="secondary_number" value={formData.secondary_number} onChange={handleInputChange} />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="residentialAddressInput" className="form-label">{requiredLabel("Residential Address")}</Label>
                                <Input type="text" className="form-control" id="residentialAddressInput" name="residential_address" value={formData.residential_address} onChange={handleInputChange} />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="gpsAddressInput" className="form-label">GPS Address</Label>
                                <Input type="text" className="form-control" id="gpsAddressInput" name="gps_address" value={formData.gps_address} onChange={handleInputChange} />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="branchInput" className="form-label">Branch</Label>
                                <Input type="text" className="form-control" id="branchInput" value={selectedUser?.branch?.name || ""} disabled />
                              </div>
                            </Col>
                          </Row>

                          <div className="border-bottom mt-4 mb-3 pb-2">
                            <h5 className="card-title mb-0 text-primary">Next of Kin</h5>
                          </div>
                          <Row>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="nokNameInput" className="form-label">{requiredLabel("Next of Kin Name")}</Label>
                                <Input type="text" className="form-control" id="nokNameInput" name="nok_full_name" value={formData.nok_full_name} onChange={handleInputChange} />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="nokPhoneInput" className="form-label">{requiredLabel("Next of Kin Phone")}</Label>
                                <Input type="text" className="form-control" id="nokPhoneInput" name="nok_phone" value={formData.nok_phone} onChange={handleInputChange} />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="nokEmailInput" className="form-label">Next of Kin Email</Label>
                                <Input type="email" className="form-control" id="nokEmailInput" name="nok_email" value={formData.nok_email} onChange={handleInputChange} />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="nokRelationInput" className="form-label">{requiredLabel("Next of Kin Relation")}</Label>
                                <Input type="select" className="form-control" id="nokRelationInput" name="nok_relation" value={formData.nok_relation} onChange={handleInputChange}>
                                  <option value="">Select relation</option>
                                  <option value="Spouse">Spouse</option>
                                  <option value="Parent">Parent</option>
                                  <option value="Child">Child</option>
                                  <option value="Sibling">Sibling</option>
                                  <option value="Friend">Friend</option>
                                  <option value="Other">Other</option>
                                </Input>
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="nokGenderInput" className="form-label">{requiredLabel("Next of Kin Gender")}</Label>
                                <Input type="select" className="form-control" id="nokGenderInput" name="nok_gender" value={formData.nok_gender} onChange={handleInputChange}>
                                  <option value="">Select gender</option>
                                  <option value="male">Male</option>
                                  <option value="female">Female</option>
                                </Input>
                              </div>
                            </Col>
                          </Row>

                          {updateError && <div className="text-danger mb-3">{updateError}</div>}
                          <div className="text-end">
                            <Button type="button" color="secondary" className="me-2" onClick={() => navigate("/users-list")}>Cancel</Button>
                            <Button type="button" color="primary" onClick={handleSave} disabled={updateLoading}>
                              {updateLoading ? "Saving..." : "Save Changes"}
                            </Button>
                          </div>
                        </Form>
                      </TabPane>
                    </TabContent>
                  )}
                </CardBody>
              </Card>
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
                limit={1}
              />
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EditUser;
