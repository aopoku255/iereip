import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, CardHeader, Col, Container, Form, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane, Spinner, Button } from "reactstrap";
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import progileBg from "../../assets/images/profile-bg.jpg";
import { APIClient } from "../../helpers/api_helper";
import { createUser, uploadUserPhoto } from "../../slices/users/thunk";

const CreateUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const requiredLabel = (text) => (
    <>
      {text} <span className="text-danger">*</span>
    </>
  );
  const [activeTab, setActiveTab] = useState("1");
  const [formData, setFormData] = useState({
    photo: null,
    first_name: "",
    last_name: "",
    other_name: "",
    date_of_birth: null,
    gender: "",
    email: "",
    profession: "",
    branch_id: "",
    mobile_number: "",
    secondary_number: "",
    residential_address: "",
    gps_address: "",
    marital_status: "",
    id_type: "",
    id_number: "",
    id_expiry: "",
    nok_full_name: "",
    nok_phone: "",
    nok_gender: "",
    nok_email: "",
    nok_relation: "",
    account_type: "",
    savings_amount: "",
    savings_frequency: "",
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [branches, setBranches] = useState([]);
  const [branchLoading, setBranchLoading] = useState(false);
  const [branchError, setBranchError] = useState(null);
  const [formError, setFormError] = useState("");
  const createUserState = useSelector((state) => state.Users?.createUser || {});
  const { loading: createLoading, error: createError } = createUserState;

  // creation page doesn't load a user
  const selectedUserLoading = false;
  const selectedUserError = null;
  const updateLoading = false;
  const updateError = null;

  const formatGpsAddress = (value) => {
    const alphanumeric = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    let prefix = "";
    let remainder = "";

    for (const char of alphanumeric) {
      if (prefix.length < 2) {
        if (/[A-Z]/.test(char)) {
          prefix += char;
        }
      } else {
        remainder += char;
      }
      if (prefix.length === 2 && remainder.length >= 8) {
        break;
      }
    }

    const combined = (prefix + remainder).slice(0, 10);
    const parts = [];

    if (combined.length > 2) {
      parts.push(combined.slice(0, 2));
      if (combined.length > 5) {
        parts.push(combined.slice(2, 5));
        parts.push(combined.slice(5));
      } else {
        parts.push(combined.slice(2));
      }
    } else {
      parts.push(combined);
    }

    return parts.filter(Boolean).join("-");
  };

  const formatIdNumber = (value, idType) => {
    if (!idType) {
      return value.toUpperCase();
    }

    const uppercase = value.toUpperCase();
    const digits = uppercase.replace(/[^0-9]/g, "");
    const letters = uppercase.replace(/[^A-Z]/g, "");

    switch (idType) {
      case "National ID": {
        const numberPart = digits.slice(0, 11);
        const firstSegment = numberPart.slice(0, 10);
        const checkDigit = numberPart.slice(10);
        if (!firstSegment) return "GHA";
        if (!checkDigit) return `GHA-${firstSegment}`;
        return `GHA-${firstSegment}-${checkDigit}`;
      }
      case "Voters ID": {
        const voterDigits = digits.slice(0, 12);
        const parts = [voterDigits.slice(0, 4), voterDigits.slice(4, 8), voterDigits.slice(8, 12)].filter(Boolean);
        return parts.join("-");
      }
      case "Drivers License": {
        const licenseDigits = digits.slice(0, 7);
        return licenseDigits ? `DL-${licenseDigits}` : "DL";
      }
      case "Passport": {
        const passportNumber = (letters.slice(0, 1) + digits.slice(0, 8)).slice(0, 9);
        if (!passportNumber) return "";
        return passportNumber;
      }
      default:
        return uppercase;
    }
  };

  const getIdNumberPlaceholder = (idType) => {
    switch (idType) {
      case "National ID":
        return "GHA-1234567890-1";
      case "Voters ID":
        return "1234-5678-9012";
      case "Drivers License":
        return "DL-1234567";
      case "Passport":
        return "A12345678";
      default:
        return "ID number";
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormError("");

    if (name === "gps_address") {
      setFormData((prev) => ({ ...prev, [name]: formatGpsAddress(value) }));
      return;
    }

    if (name === "id_type") {
      const updatedIdType = value;
      const formattedIdNumber = formatIdNumber(formData.id_number, updatedIdType);
      setFormData((prev) => ({ ...prev, id_type: updatedIdType, id_number: formattedIdNumber }));
      return;
    }

    if (name === "id_number") {
      setFormData((prev) => ({ ...prev, [name]: formatIdNumber(value, prev.id_type) }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, date_of_birth: date[0] ? date[0].toISOString().split("T")[0] : "" }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, photo: file }));
    setPhotoPreview((prevPreview) => {
      if (prevPreview) URL.revokeObjectURL(prevPreview);
      return previewUrl;
    });
  };

  useEffect(() => {
    const fetchBranches = async () => {
      setBranchLoading(true);
      setBranchError(null);
      try {
        const api = new APIClient();
        const response = await api.get("/branches");
        if (response?.code === "00" && response?.status === "success") {
          setBranches(response.data || []);
        } else {
          setBranchError(response?.message || "Unable to load branches.");
        }
      } catch (err) {
        setBranchError(err?.message || "Unable to load branches.");
      } finally {
        setBranchLoading(false);
      }
    };

    fetchBranches();

    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const handleSave = async () => {
    try {
      setFormError("");
      const requiredFields = [
        { name: "Profile photo", value: formData.photo },
        { name: "First name", value: formData.first_name },
        { name: "Last name", value: formData.last_name },
        { name: "Date of birth", value: formData.date_of_birth },
        { name: "Gender", value: formData.gender },
        { name: "Profession", value: formData.profession },
        { name: "Branch ID", value: formData.branch_id },
        { name: "Mobile number", value: formData.mobile_number },
        { name: "Residential address", value: formData.residential_address },
        { name: "Marital status", value: formData.marital_status },
        { name: "ID type", value: formData.id_type },
        { name: "ID number", value: formData.id_number },
        { name: "ID expiry", value: formData.id_expiry },
        { name: "Next of kin full name", value: formData.nok_full_name },
        { name: "Next of kin phone", value: formData.nok_phone },
        { name: "Next of kin gender", value: formData.nok_gender },
        { name: "Next of kin relation", value: formData.nok_relation },
        { name: "Account type", value: formData.account_type },
      ];

      const missingFields = requiredFields
        .filter((field) => !field.value || field.value === "")
        .map((field) => field.name);

      if (missingFields.length) {
        const message = `Please provide required fields: ${missingFields.join(", ")}`;
        setFormError(message);
        toast.error(message, { position: "top-right", autoClose: 3000 });
        return;
      }

      // Prepare payload
      const jsonPayload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        other_name: formData.other_name || "",
        date_of_birth: formData.date_of_birth || "",
        gender: formData.gender,
        email: formData.email || null,
        profession: formData.profession || "",
        mobile_number: formData.mobile_number,
        secondary_number: formData.secondary_number || null,
        residential_address: formData.residential_address || "",
        gps_address: formData.gps_address || null,
        marital_status: formData.marital_status,
        id_type: formData.id_type,
        id_number: formData.id_number,
        id_expiry: formData.id_expiry || "",
        nok_full_name: formData.nok_full_name || "",
        nok_phone: formData.nok_phone || "",
        nok_gender: formData.nok_gender || "",
        nok_email: formData.nok_email || null,
        nok_relation: formData.nok_relation || "",
        account_type: formData.account_type,
        branch_id: formData.branch_id ? parseInt(formData.branch_id, 10) : null,
        savings_amount: formData.savings_amount ? parseFloat(formData.savings_amount) : null,
        savings_frequency: formData.savings_frequency || null,
      };

      const payload = formData.photo
        ? (() => {
            const formDataPayload = new FormData();
            Object.entries(jsonPayload).forEach(([key, value]) => {
              if (value !== null && value !== undefined) {
                formDataPayload.append(key, value);
              }
            });
            formDataPayload.append("photo", formData.photo);
            return formDataPayload;
          })()
        : jsonPayload;

      const result = await dispatch(createUser(payload)).unwrap();

      if (formData.photo && result.id) {
        await dispatch(uploadUserPhoto({ user_id: result.id, file: formData.photo })).unwrap();
      }

      toast.success("User created successfully!", { position: "top-right", autoClose: 3000 });
      setTimeout(() => navigate("/users-list"), 800);
    } catch (error) {
      const message = (error?.message || error || "Failed to create user").toString();
      setFormError(message);
      toast.error(message, { position: "top-right", autoClose: 3000 });
    }
  };

  const handleAccountTypeUpdate = () => {
    // noop on create page
  };

  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const photoUploadLoading = false;
  const accountTypeLoading = false;
  const accountTypeError = null;

  const profileImage = photoPreview ? photoPreview : `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.first_name || formData.last_name || "User")}&background=0D8ABC&color=fff&size=128`;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Create User" pageTitle="Users Management" />

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
                      <img src={profileImage} className={`rounded-circle avatar-xl img-thumbnail user-profile-image ${photoUploadLoading ? "opacity-75" : ""}`} alt="user-profile" />
                      <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                        <Input id="profile-img-file-input" type="file" className="profile-img-file-input" accept="image/*" onChange={handlePhotoChange} />
                        <Label htmlFor="profile-img-file-input" className="profile-photo-edit avatar-xs" title="Select profile photo">
                          <span className="avatar-title rounded-circle bg-light text-body">
                            <i className="ri-camera-fill"></i>
                          </span>
                        </Label>
                      </div>
                    </div>
                    <p htmlFor="profile-img-file-input" className="form-label">{requiredLabel("Profile Photo")}</p>
                    {formData.first_name || formData.last_name ? (
                      <h5 className="fs-16 mb-1">{`${formData.first_name} ${formData.last_name}`.trim()}</h5>
                    ) : null}
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
                        <Form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                          {formError && <div className="text-danger mb-3">{formError}</div>}
                          <div className="border-bottom mb-3 pb-2">
                            <h5 className="card-title mb-0 text-primary">Personal Details</h5>
                            <p className="text-muted mb-0">Required fields are marked with <span className="text-danger">*</span>.</p>
                          </div>
                          <Row>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="firstnameInput" className="form-label">{requiredLabel("First Name")}</Label>
                                <Input type="text" className="form-control" id="firstnameInput" name="first_name" placeholder="First name" value={formData.first_name} onChange={handleInputChange} />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="lastnameInput" className="form-label">{requiredLabel("Last Name")}</Label>
                                <Input type="text" className="form-control" id="lastnameInput" name="last_name" placeholder="Last name" value={formData.last_name} onChange={handleInputChange} />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="othernameInput" className="form-label">Other Name</Label>
                                <Input type="text" className="form-control" id="othernameInput" name="other_name" placeholder="Other name" value={formData.other_name} onChange={handleInputChange} />
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
                                <Input type="text" className="form-control" id="professionInput" name="profession" placeholder="Profession" value={formData.profession} onChange={handleInputChange} />
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
                                <Input type="text" className="form-control" id="idNumberInput" name="id_number" placeholder={getIdNumberPlaceholder(formData.id_type)} value={formData.id_number} onChange={handleInputChange} />
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
                                <Input type="email" className="form-control" id="emailInput" name="email" placeholder="Email address" value={formData.email} onChange={handleInputChange} />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="phonenumberInput" className="form-label">{requiredLabel("Phone Number")}</Label>
                                <Input type="text" className="form-control" id="phonenumberInput" name="mobile_number" placeholder="Mobile number" value={formData.mobile_number} onChange={handleInputChange} />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="secondaryNumberInput" className="form-label">Secondary Number</Label>
                                <Input type="text" className="form-control" id="secondaryNumberInput" name="secondary_number" placeholder="Secondary number" value={formData.secondary_number} onChange={handleInputChange} />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="residentialAddressInput" className="form-label">{requiredLabel("Residential Address")}</Label>
                                <Input type="text" className="form-control" id="residentialAddressInput" name="residential_address" placeholder="Residential address" value={formData.residential_address} onChange={handleInputChange} />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="gpsAddressInput" className="form-label">GPS Address</Label>
                                <Input type="text" className="form-control" id="gpsAddressInput" name="gps_address" placeholder="GPS address" value={formData.gps_address} onChange={handleInputChange} />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="branchInput" className="form-label">{requiredLabel("Branch ID")}</Label>
                                <Input
                                  type="select"
                                  className="form-control"
                                  id="branchInput"
                                  name="branch_id"
                                  value={formData.branch_id}
                                  onChange={handleInputChange}
                                  disabled={branchLoading}
                                >
                                  <option value="">Select branch</option>
                                  {branches.map((branch) => (
                                    <option key={branch.id} value={branch.id}>
                                      {branch.name}
                                    </option>
                                  ))}
                                </Input>
                                {branchError ? <div className="form-text text-danger">{branchError}</div> : null}
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
                                <Input type="text" className="form-control" id="nokNameInput" name="nok_full_name" placeholder="Next of kin full name" value={formData.nok_full_name} onChange={handleInputChange} />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="nokPhoneInput" className="form-label">{requiredLabel("Next of Kin Phone")}</Label>
                                <Input type="text" className="form-control" id="nokPhoneInput" name="nok_phone" placeholder="Next of kin phone" value={formData.nok_phone} onChange={handleInputChange} />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="nokEmailInput" className="form-label">Next of Kin Email</Label>
                                <Input type="email" className="form-control" id="nokEmailInput" name="nok_email" placeholder="Next of kin email" value={formData.nok_email} onChange={handleInputChange} />
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

                          <div className="border-bottom mt-4 mb-3 pb-2">
                            <h5 className="card-title mb-0 text-primary">Account Details</h5>
                          </div>
                          <Row>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="accountTypeInput" className="form-label">{requiredLabel("Account Type")}</Label>
                                <Input type="select" id="accountTypeInput" name="account_type" value={formData.account_type} onChange={handleInputChange}>
                                  <option value="">Select account type</option>
                                  <option value="savings">Savings</option>
                                  <option value="loans">Loans</option>
                                  <option value="both">Both</option>
                                </Input>
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="savingsFrequencyInput" className="form-label">Savings Frequency</Label>
                                <Input type="select" id="savingsFrequencyInput" name="savings_frequency" value={formData.savings_frequency} onChange={handleInputChange}>
                                  <option value="">Select frequency</option>
                                  <option value="daily">Daily</option>
                                  <option value="weekly">Weekly</option>
                                  <option value="monthly">Monthly</option>
                                </Input>
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="savingsAmountInput" className="form-label">Savings Amount</Label>
                                <Input type="number" className="form-control" id="savingsAmountInput" name="savings_amount" placeholder="Savings amount" value={formData.savings_amount} onChange={handleInputChange} />
                              </div>
                            </Col>
                          </Row>

                          {updateError && <div className="text-danger mb-3">{updateError}</div>}
                          {createError && <div className="text-danger mb-3">{createError}</div>}
                          <div className="text-end">
                            <Button type="button" color="secondary" className="me-2" onClick={() => navigate("/users-list")}>Cancel</Button>
                            <Button type="submit" color="primary" disabled={createLoading}>
                              {createLoading ? "Creating..." : "Create User"}
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

export default CreateUser;
