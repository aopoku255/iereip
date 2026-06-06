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
import { getUserById } from "../../slices/thunks";
import { createLoanApplication } from "../../slices/loans/thunk";
import { resetCreateLoanStatus } from "../../slices/loans/index";

const LoanApplicationView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("1");
  const [loanData, setLoanData] = useState({
    loan_capital: "",
    interest_rate: "",
    loan_duration: "",
    loan_frequency: "",
    purpose: "",
  });

  const { selectedUser, selectedUserLoading, selectedUserError } = useSelector((state) => state.Users || {});
  const { createLoan } = useSelector((state) => state.Loans || { createLoan: { loading: false, error: null, success: false } });

  useEffect(() => {
    if (id) {
      dispatch(getUserById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (createLoan?.success) {
      toast.success("Loan application created successfully!", { position: "top-right", autoClose: 3000 });
      dispatch(resetCreateLoanStatus());
      setTimeout(() => navigate("/loan/new-application"), 800);
    }

    if (createLoan?.error) {
      toast.error(createLoan.error || "Failed to create loan application", { position: "top-right", autoClose: 3000 });
      dispatch(resetCreateLoanStatus());
    }
  }, [createLoan?.success, createLoan?.error, dispatch, navigate]);

  const handleLoanInputChange = (event) => {
    const { name, value } = event.target;
    setLoanData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveLoanApplication = async () => {
    try {
      // Validate required fields
      const requiredFields = [
        { name: "Loan Capital", value: loanData.loan_capital },
        { name: "Interest Rate", value: loanData.interest_rate },
        { name: "Loan Duration", value: loanData.loan_duration },
        { name: "Loan Frequency", value: loanData.loan_frequency },
        { name: "Purpose", value: loanData.purpose },
      ];

      const missingFields = requiredFields
        .filter((field) => !field.value || field.value === "")
        .map((field) => field.name);

      if (missingFields.length) {
        const message = `Please provide required fields: ${missingFields.join(", ")}`;
        toast.error(message, { position: "top-right", autoClose: 3000 });
        return;
      }

      const payload = {
        user_id: parseInt(id, 10),
        loan_capital: parseFloat(loanData.loan_capital),
        interest_rate: parseFloat(loanData.interest_rate),
        loan_duration: parseInt(loanData.loan_duration, 10),
        loan_frequency: loanData.loan_frequency,
        purpose: loanData.purpose,
      };

      dispatch(createLoanApplication(payload));
    } catch (error) {
      const message = error?.message || "Failed to create loan application";
      toast.error(message, { position: "top-right", autoClose: 3000 });
    }
  };

  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const requiredLabel = (text) => (
    <>
      {text} <span className="text-danger">*</span>
    </>
  );

  const profileImage = selectedUser?.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser?.full_name || "User")}&background=0D8ABC&color=fff&size=128`;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Create Loan Application" pageTitle="Loan Application" />

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
            </Col>

            <Col xxl={9}>
              <Card className="mt-xxl-n5">
                <CardHeader>
                  <Nav className="nav-tabs-custom rounded card-header-tabs border-bottom-0" role="tablist">
                    <NavItem>
                      <NavLink className={classnames({ active: activeTab === "1" })} onClick={() => tabChange("1")}>
                        <i className="fas fa-user"></i> Personal Details
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink className={classnames({ active: activeTab === "2" })} onClick={() => tabChange("2")}>
                        <i className="fas fa-phone"></i> Contact Information
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink className={classnames({ active: activeTab === "3" })} onClick={() => tabChange("3")}>
                        <i className="fas fa-users"></i> Next of Kin
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink className={classnames({ active: activeTab === "4" })} onClick={() => tabChange("4")}>
                        <i className="fas fa-file-invoice-dollar"></i> Loan Details
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
                          </div>
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
                                <Label htmlFor="othernameInput" className="form-label">Other Name</Label>
                                <Input type="text" className="form-control" id="othernameInput" value={selectedUser?.other_name || ""} disabled />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="dobInput" className="form-label">Date of Birth</Label>
                                <Input type="text" className="form-control" id="dobInput" value={selectedUser?.date_of_birth ? new Date(selectedUser.date_of_birth).toLocaleDateString() : ""} disabled />
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
                                <Label htmlFor="professionInput" className="form-label">Profession</Label>
                                <Input type="text" className="form-control" id="professionInput" value={selectedUser?.profession || ""} disabled />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="maritalStatusInput" className="form-label">Marital Status</Label>
                                <Input type="text" className="form-control" id="maritalStatusInput" value={selectedUser?.marital_status || ""} disabled />
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
                                <Input type="text" className="form-control" id="idExpiryInput" value={selectedUser?.id_expiry ? new Date(selectedUser.id_expiry).toLocaleDateString() : ""} disabled />
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      </TabPane>

                      <TabPane tabId="2">
                        <Form>
                          <div className="border-bottom mb-3 pb-2">
                            <h5 className="card-title mb-0 text-primary">Contact Information</h5>
                          </div>
                          <Row>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="emailInput" className="form-label">Email Address</Label>
                                <Input type="email" className="form-control" id="emailInput" value={selectedUser?.email || ""} disabled />
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
                                <Label htmlFor="secondaryNumberInput" className="form-label">Secondary Number</Label>
                                <Input type="text" className="form-control" id="secondaryNumberInput" value={selectedUser?.secondary_number || ""} disabled />
                              </div>
                            </Col>
                            <Col lg={6}>
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
                                <Label htmlFor="branchInput" className="form-label">Branch</Label>
                                <Input type="text" className="form-control" id="branchInput" value={selectedUser?.branch?.name || ""} disabled />
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      </TabPane>

                      <TabPane tabId="3">
                        <Form>
                          <div className="border-bottom mb-3 pb-2">
                            <h5 className="card-title mb-0 text-primary">Next of Kin</h5>
                          </div>
                          <Row>
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
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="nokGenderInput" className="form-label">Next of Kin Gender</Label>
                                <Input type="text" className="form-control" id="nokGenderInput" value={selectedUser?.nok_gender || ""} disabled />
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      </TabPane>

                      <TabPane tabId="4">
                        <Form onSubmit={(e) => { e.preventDefault(); handleSaveLoanApplication(); }}>
                          <div className="border-bottom mb-3 pb-2">
                            <h5 className="card-title mb-0 text-primary">Loan Details</h5>
                            <p className="text-muted mb-0">Required fields are marked with <span className="text-danger">*</span>.</p>
                          </div>
                          <Row>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="loanCapitalInput" className="form-label">{requiredLabel("Loan Capital")}</Label>
                                <Input
                                  type="number"
                                  className="form-control"
                                  id="loanCapitalInput"
                                  name="loan_capital"
                                  placeholder="Enter loan capital"
                                  value={loanData.loan_capital}
                                  onChange={handleLoanInputChange}
                                  step="0.01"
                                />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="interestRateInput" className="form-label">{requiredLabel("Interest Rate (%)")}</Label>
                                <Input
                                  type="number"
                                  className="form-control"
                                  id="interestRateInput"
                                  name="interest_rate"
                                  placeholder="Enter interest rate"
                                  value={loanData.interest_rate}
                                  onChange={handleLoanInputChange}
                                  step="0.01"
                                />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="loanDurationInput" className="form-label">{requiredLabel("Loan Duration (months)")}</Label>
                                <Input
                                  type="number"
                                  className="form-control"
                                  id="loanDurationInput"
                                  name="loan_duration"
                                  placeholder="Enter loan duration"
                                  value={loanData.loan_duration}
                                  onChange={handleLoanInputChange}
                                />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="loanFrequencyInput" className="form-label">{requiredLabel("Loan Frequency")}</Label>
                                <Input
                                  type="select"
                                  className="form-control"
                                  id="loanFrequencyInput"
                                  name="loan_frequency"
                                  value={loanData.loan_frequency}
                                  onChange={handleLoanInputChange}
                                >
                                  <option value="">Select frequency</option>
                                  <option value="daily">Daily</option>
                                  <option value="weekly">Weekly</option>
                                  <option value="monthly">Monthly</option>
                                  <option value="quarterly">Quarterly</option>
                                  <option value="yearly">Yearly</option>
                                </Input>
                              </div>
                            </Col>
                            <Col lg={12}>
                              <div className="mb-3">
                                <Label htmlFor="purposeInput" className="form-label">{requiredLabel("Purpose")}</Label>
                                <Input
                                  type="textarea"
                                  className="form-control"
                                  id="purposeInput"
                                  name="purpose"
                                  placeholder="Enter loan purpose"
                                  value={loanData.purpose}
                                  onChange={handleLoanInputChange}
                                  rows="4"
                                />
                              </div>
                            </Col>
                          </Row>

                          <div className="text-end">
                            <Button type="button" color="secondary" className="me-2" onClick={() => navigate("/loan/new-application")}>
                              Cancel
                            </Button>
                            <Button type="submit" color="primary" disabled={createLoan?.loading}>
                              {createLoan?.loading ? "Creating..." : "Create Loan Application"}
                            </Button>
                          </div>
                        </Form>
                      </TabPane>
                    </TabContent>
                  )}
                </CardBody>
              </Card>

              <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover limit={1} />
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default LoanApplicationView;
