import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Spinner,
  Button,
} from "reactstrap";
import classnames from "classnames";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import progileBg from "../../assets/images/profile-bg.jpg";
import { getLoanApplicationById, createLoanCollateral, createLoanGuarantor, createLoanDocument, createLoanRepayment } from "../../slices/loans/thunk";
import Dropzone from "react-dropzone";
import DropzoneUpload from "../../Components/Common/DropzoneUpload";
// FilePond upload component for documents
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const LoanApplicationDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Initialize activeTab from localStorage, default to "1"
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem(`loanTab_${id}`);
    return savedTab || "1";
  });

  const { selectedLoan, selectedLoanLoading, selectedLoanError } = useSelector((state) => state.Loans || {});

  const collateralEntries = useMemo(() => {
    const c = selectedLoan?.collateral;
    if (!c) return [];
    return Array.isArray(c) ? c : [c];
  }, [selectedLoan?.collateral]);

  const guarantorEntries = useMemo(() => {
    const g = selectedLoan?.guarantors;
    if (!g) return [];
    return Array.isArray(g) ? g : [g];
  }, [selectedLoan?.guarantors]);

  const [collateralForm, setCollateralForm] = useState(() => {
    const saved = localStorage.getItem(`collateralForm_${id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // If parsing fails, use default
      }
    }
    return {
      collateral_type: "",
      description: "",
      car_registration_number: "",
      car_chassis_number: "",
      car_color: "",
      car_make: "",
      car_model: "",
      car_year: "",
      land_registration_number: "",
      land_area: "",
      land_area_value: "",
      land_area_unit: "acres",
      land_location: "",
      land_dimensions: "",
      car_reg_cert: null,
      car_utility_bill: null,
      land_reg_cert: null,
    };
  });

  const [submittingCollateral, setSubmittingCollateral] = useState(false);
  const [collateralSaved, setCollateralSaved] = useState(false);
  const [previewUrls, setPreviewUrls] = useState(() => {
    // Restore preview URLs from localStorage on mount
    const savedUrls = localStorage.getItem(`previewUrls_${id}`);
    return savedUrls ? JSON.parse(savedUrls) : [];
  });

  const [guarantorForm, setGuarantorForm] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    address: "",
    guarantor_type: "",
    id_type: "",
    id_number: "",
    photo: null,
  });
  const [savedGuarantors, setSavedGuarantors] = useState([]);
  const [editingGuarantorIndex, setEditingGuarantorIndex] = useState(null);
  const [submittingGuarantor, setSubmittingGuarantor] = useState(false);
  const [guarantorSaved, setGuarantorSaved] = useState(false);
  const [guarantorErrors, setGuarantorErrors] = useState({});

  const [documentType, setDocumentType] = useState("");
  const [documentFiles, setDocumentFiles] = useState([]);
  const [submittingDocument, setSubmittingDocument] = useState(false);
  const [documentSaved, setDocumentSaved] = useState(false);
  const [documentErrors, setDocumentErrors] = useState({});

  const [repaymentForm, setRepaymentForm] = useState({ amount: "", narration: "" });
  const [repaymentError, setRepaymentError] = useState("");
  const [submittingRepayment, setSubmittingRepayment] = useState(false);
  const [repaymentSaved, setRepaymentSaved] = useState(false);
  const [localRepayments, setLocalRepayments] = useState(() =>
    Array.isArray(selectedLoan?.repayments) ? selectedLoan.repayments : []
  );

  const DOCUMENT_TYPE_OPTIONS = [
    { value: "car_registration", label: "Car Registration" },
    { value: "land_cert", label: "Land Certificate" },
    { value: "id_document", label: "ID Document" },
  ];

  // In-memory guarantor state only (no localStorage persistence)

  const GUARANTOR_TYPE_OPTIONS = [
    { value: "family member", label: "Family Member" },
    { value: "friend", label: "Friend" },
    { value: "colleague", label: "Colleague" },
    { value: "other", label: "Other" },
  ];

  const GUARANTOR_ID_TYPE_OPTIONS = [
    { value: "national_id", label: "National ID" },
    { value: "voters_id", label: "Voters ID" },
    { value: "drivers_license", label: "Drivers License" },
    { value: "passport", label: "Passport" },
  ];

  const getGuarantorTypeLabel = (value) => GUARANTOR_TYPE_OPTIONS.find((option) => option.value === value)?.label || value || "-";
  const getGuarantorIdTypeLabel = (value) => GUARANTOR_ID_TYPE_OPTIONS.find((option) => option.value === value)?.label || value || "-";

  const ID_TYPE_PATTERNS = {
    national_id: {
      pattern: /^GHA-\d{10}-\d$/i,
      message: "Use Ghana Card format, e.g. GHA-7263748476-3.",
    },
    voters_id: {
      pattern: /^[A-Z0-9]{8,12}$/i,
      message: "Use 8-12 alphanumeric characters.",
    },
    drivers_license: {
      pattern: /^[A-Z0-9]{6,12}$/i,
      message: "Use 6-12 alphanumeric characters.",
    },
    passport: {
      pattern: /^[A-Z0-9]{5,9}$/i,
      message: "Use 5-9 alphanumeric characters.",
    },
  };

  const allGuarantors = savedGuarantors;
  const canAddGuarantor = allGuarantors.length < 2;
  const isEditingGuarantor = editingGuarantorIndex !== null;

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`loanTab_${id}`, activeTab);
  }, [activeTab, id]);

  // Save preview URLs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`previewUrls_${id}`, JSON.stringify(previewUrls));
  }, [previewUrls, id]);

  // Save collateralForm to localStorage whenever it changes (exclude file objects)
  useEffect(() => {
    // Create a serializable copy without file objects
    const serializableForm = {
      ...collateralForm,
      car_reg_cert: collateralForm.car_reg_cert?.preview || collateralForm.car_reg_cert || null,
      car_utility_bill: collateralForm.car_utility_bill?.preview || collateralForm.car_utility_bill || null,
      land_reg_cert: collateralForm.land_reg_cert?.preview || collateralForm.land_reg_cert || null,
    };
    localStorage.setItem(`collateralForm_${id}`, JSON.stringify(serializableForm));
  }, [collateralForm, id]);

  useEffect(() => {
    setSavedGuarantors(guarantorEntries || []);
  }, [guarantorEntries]);

  useEffect(() => {
    if (Array.isArray(selectedLoan?.repayments)) {
      setLocalRepayments(selectedLoan.repayments);
    } else {
      setLocalRepayments([]);
    }
  }, [selectedLoan?.repayments]);

  const clearGuarantorForm = () => {
    setGuarantorForm({
      full_name: "",
      phone_number: "",
      email: "",
      address: "",
      guarantor_type: "",
      id_type: "",
      id_number: "",
      photo: null,
    });
    setEditingGuarantorIndex(null);
    setGuarantorErrors({});
  };

  const handleEditGuarantor = (index) => {
    const guarantor = allGuarantors[index];
    if (!guarantor) return;
    setGuarantorForm({
      full_name: guarantor.full_name || "",
      phone_number: guarantor.phone_number || "",
      email: guarantor.email || "",
      address: guarantor.address || "",
      guarantor_type: guarantor.guarantor_type || "",
      id_type: guarantor.id_type || "",
      id_number: guarantor.id_number || "",
      photo: buildPhotoPreview(guarantor.photo || guarantor.photo_url),
    });
    setEditingGuarantorIndex(index);
    setGuarantorErrors({});
  };

  const handleCollateralChange = (e) => {
    const { name, value } = e.target;
    setCollateralForm((s) => ({ ...s, [name]: value }));
  };

  const formatNationalIdValue = (value) => {
    if (!value) return value;
    const normalized = value.trim().toUpperCase();
    if (normalized.startsWith("GHA-")) return normalized;
    const digits = normalized.replace(/\D/g, "");
    if (digits.length === 11) {
      return `GHA-${digits.slice(0, 10)}-${digits.slice(10)}`;
    }
    if (digits.length === 10) {
      return `GHA-${digits}`;
    }
    return normalized;
  };

  const handleGuarantorChange = (e) => {
    const { name, value } = e.target;
    let nextValue = value;

    if (name === "id_number" && guarantorForm.id_type === "national_id") {
      nextValue = formatNationalIdValue(value);
    }

    if (name === "id_type" && value === "national_id" && guarantorForm.id_number) {
      nextValue = value;
      setGuarantorForm((s) => ({
        ...s,
        id_type: value,
        id_number: formatNationalIdValue(s.id_number),
      }));
      setGuarantorErrors((s) => ({ ...s, id_type: "", id_number: "" }));
      return;
    }

    setGuarantorForm((s) => ({ ...s, [name]: nextValue }));
    setGuarantorErrors((s) => ({ ...s, [name]: "" }));
  };

  const handleDocumentTypeChange = (e) => {
    setDocumentType(e.target.value);
    setDocumentErrors((s) => ({ ...s, document_type: "" }));
  };

  const handleDocumentFilesUpdate = (fileItems) => {
    setDocumentFiles(Array.isArray(fileItems) ? fileItems : []);
    setDocumentErrors((s) => ({ ...s, files: "" }));
  };

  const submitDocument = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!documentType.trim()) {
      errors.document_type = "Document type is required.";
    }
    if (!documentFiles.length) {
      errors.files = "Upload at least one document file.";
    }
    setDocumentErrors(errors);
    if (Object.keys(errors).length) return;

    const formData = new FormData();
    formData.append("document_type", documentType.trim());
    documentFiles.forEach((item) => {
      const file = item?.file || item;
      if (file) {
        formData.append("files", file);
      }
    });

    setSubmittingDocument(true);
    try {
      const resultAction = await dispatch(createLoanDocument({ loan_id: id, formData }));
      if (createLoanDocument.fulfilled.match(resultAction)) {
        setDocumentSaved(true);
        setDocumentType("");
        setDocumentFiles([]);
        setDocumentErrors({});
        if (id) {
          dispatch(getLoanApplicationById(id));
        }
        window.setTimeout(() => setDocumentSaved(false), 3000);
      } else {
        const err = resultAction.payload || resultAction.error?.message || "Failed to upload documents";
        console.error("Document upload failed:", err);
      }
    } catch (err) {
      console.error("Error uploading documents:", err);
    } finally {
      setSubmittingDocument(false);
    }
  };

  const handleRepaymentChange = (e) => {
    const { name, value } = e.target;
    setRepaymentForm((s) => ({ ...s, [name]: value }));
    if (repaymentError) {
      setRepaymentError("");
    }
  };

  const submitRepayment = async (e) => {
    e.preventDefault();
    const amountValue = parseFloat(repaymentForm.amount);
    if (Number.isNaN(amountValue) || amountValue <= 0) {
      setRepaymentError("Enter a repayment amount greater than zero.");
      return;
    }

    setSubmittingRepayment(true);
    setRepaymentError("");
    try {
      const resultAction = await dispatch(
        createLoanRepayment({
          loan_id: Number(id),
          amount: amountValue,
          narration: repaymentForm.narration.trim(),
        })
      );

      if (createLoanRepayment.fulfilled.match(resultAction)) {
        const savedRepayment = resultAction.payload || {
          amount: amountValue,
          narration: repaymentForm.narration.trim(),
          date: new Date().toISOString().slice(0, 10),
          method: "Manual entry",
        };
        setLocalRepayments((prev) => [savedRepayment, ...(prev || [])]);
        setRepaymentForm({ amount: "", narration: "" });
        setRepaymentSaved(true);
        if (id) {
          dispatch(getLoanApplicationById(id));
        }
        window.setTimeout(() => setRepaymentSaved(false), 3000);
      } else {
        const err = resultAction.payload || resultAction.error?.message || "Failed to create repayment";
        setRepaymentError(err);
      }
    } catch (err) {
      setRepaymentError(err?.message || "Failed to create repayment");
    } finally {
      setSubmittingRepayment(false);
    }
  };

  const handleCollateralFile = (e) => {
    const { name, files } = e.target;
    setCollateralForm((s) => ({ ...s, [name]: files && files[0] ? files[0] : null }));
  };

  const handleGuarantorAcceptedFiles = (field, files) => {
    if (!files || !files.length) return;
    const file = files[0];
    Object.assign(file, {
      preview: URL.createObjectURL(file),
    });
    setGuarantorForm((s) => ({ ...s, [field]: file }));
    setPreviewUrls((p) => [...p, file.preview]);
  };

  const validatePhoneNumber = (value) => {
    const pattern = /^(\+233|0)\d{9}$/;
    return pattern.test((value || "").trim());
  };

  const validateEmail = (value) => {
    if (!value) return true;
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value.trim());
  };

  const validateIdNumber = (type, value) => {
    if (!type || !value) return false;
    const idTypeSpec = ID_TYPE_PATTERNS[type];
    return idTypeSpec ? idTypeSpec.pattern.test(value.trim()) : true;
  };

  const validateGuarantorForm = () => {
    const errors = {};

    if (!guarantorForm.full_name?.trim()) {
      errors.full_name = "Full name is required.";
    }

    if (!guarantorForm.phone_number?.trim()) {
      errors.phone_number = "Phone number is required.";
    } else if (!validatePhoneNumber(guarantorForm.phone_number)) {
      errors.phone_number = "Use Ghana phone format, e.g. 0541234567 or +233541234567.";
    }

    if (!guarantorForm.guarantor_type) {
      errors.guarantor_type = "Guarantor type is required.";
    }

    if (!guarantorForm.id_type) {
      errors.id_type = "ID type is required.";
    }

    if (!guarantorForm.id_number?.trim()) {
      errors.id_number = "ID number is required.";
    } else if (!validateIdNumber(guarantorForm.id_type, guarantorForm.id_number)) {
      errors.id_number = ID_TYPE_PATTERNS[guarantorForm.id_type]?.message || "Invalid ID number format.";
    }

    if (guarantorForm.email && !validateEmail(guarantorForm.email)) {
      errors.email = "Please enter a valid email address.";
    }

    setGuarantorErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const buildPhotoPreview = (photo) => {
    if (!photo) return null;
    if (typeof photo === "string") {
      return {
        preview: photo,
        name: photo.split("/").pop() || "photo.jpg",
        size: 0,
        type: "image/jpeg",
      };
    }
    return photo;
  };

  const handleAcceptedFiles = (field, files) => {
    if (!files || !files.length) return;
    const file = files[0];
    Object.assign(file, {
      preview: URL.createObjectURL(file),
    });
    setCollateralForm((s) => ({ ...s, [field]: file }));
    setPreviewUrls((p) => [...p, file.preview]);
  };

  const validateCarRegistration = (value) => {
    // Ghana vehicle reg pattern: e.g. "GE 1234-21" (2 letters, space, 3-4 digits, hyphen, 2 digits year)
    const pattern = /^[A-Z]{2}\s\d{3,4}-\d{2}$/i;
    return pattern.test((value || "").trim());
  };

  const currentYear = new Date().getFullYear();
  const generateYears = (start = 1980) => {
    const years = [];
    for (let y = currentYear; y >= start; y--) years.push(y);
    return years;
  };

  useEffect(() => {
    return () => {
      previewUrls.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch (e) {
          // ignore
        }
      });
    };
  }, [previewUrls]);

  const showCar = collateralForm.collateral_type === "car" || collateralForm.collateral_type === "both";
  const showLand = collateralForm.collateral_type === "land" || collateralForm.collateral_type === "both";

  const submitGuarantor = async (e) => {
    e.preventDefault();
    console.log("submitGuarantor called");
    console.log("canAddGuarantor:", canAddGuarantor);
    console.log("isEditingGuarantor:", isEditingGuarantor);
    
    if (!canAddGuarantor && !isEditingGuarantor) {
      console.log("Blocked: Cannot add more guarantors and not editing");
      return;
    }
    
    console.log("guarantorForm:", guarantorForm);
    if (!validateGuarantorForm()) {
      console.log("Form validation failed");
      return;
    }
    
    setSubmittingGuarantor(true);
    try {
      if (isEditingGuarantor) {
        console.log("Editing guarantor");
        // Handle editing
        setSavedGuarantors((prev) => prev.map((g, idx) => (idx === editingGuarantorIndex ? guarantorForm : g)));
        setGuarantorSaved(true);
        clearGuarantorForm();
      } else {
        // Adding new guarantor - send to API via Redux thunk
        console.log("Adding new guarantor via thunk");
        
        const formData = new FormData();
        
        // Trim and append required fields
        const fullName = (guarantorForm.full_name || "").trim();
        const phoneNumber = (guarantorForm.phone_number || "").trim();
        const guarantorType = (guarantorForm.guarantor_type || "").trim();
        const idType = (guarantorForm.id_type || "").trim();
        const idNumber = (guarantorForm.id_number || "").trim();
        
        // Trim and append optional fields
        const email = (guarantorForm.email || "").trim();
        const address = (guarantorForm.address || "").trim();
        
        // Log what we're about to send
        console.log("FormData values:", {
          full_name: fullName,
          phone_number: phoneNumber,
          email: email,
          address: address,
          guarantor_type: guarantorType,
          id_type: idType,
          id_number: idNumber,
          photo: guarantorForm.photo ? "File present" : "No file"
        });
        
        formData.append("full_name", fullName);
        formData.append("phone_number", phoneNumber);
        formData.append("email", email);
        formData.append("address", address);
        formData.append("guarantor_type", guarantorType);
        formData.append("id_type", idType);
        formData.append("id_number", idNumber);

        if (guarantorForm.photo && guarantorForm.photo instanceof File) {
          console.log("Adding photo file", guarantorForm.photo.name);
          formData.append("photo", guarantorForm.photo);
        }

        console.log("Dispatching createLoanGuarantor with loan_id:", id);
        const resultAction = await dispatch(
          createLoanGuarantor({
            loan_id: id,
            formData,
          })
        );

        console.log("Result action:", resultAction);

        if (createLoanGuarantor.fulfilled.match(resultAction)) {
          console.log("Guarantor saved successfully");
          setGuarantorSaved(true);
          const savedGuarantor = resultAction.payload || guarantorForm;
          setSavedGuarantors((prev) => [...prev, savedGuarantor]);
          clearGuarantorForm();
          // Refresh loan details to get updated guarantors
          if (id) dispatch(getLoanApplicationById(id));
        } else {
          const err = resultAction.payload || resultAction.error?.message || "Failed to save guarantor";
          console.error("Failed to save guarantor:", err);
        }
      }
    } catch (err) {
      console.error("Error in submitGuarantor:", err);
    } finally {
      setSubmittingGuarantor(false);
      setTimeout(() => setGuarantorSaved(false), 3000);
    }
  };

  const submitCollateral = async (e) => {
    e.preventDefault();
    if (!collateralForm.collateral_type) return;
    setSubmittingCollateral(true);
    try {
      // build multipart form data and dispatch thunk to save collateral
      const formData = new FormData();
      const collateralType = collateralForm.collateral_type === "both" ? "other" : collateralForm.collateral_type;
      formData.append("collateral_type", collateralType || "");
      formData.append("description", collateralForm.description || "");
      formData.append("car_registration_number", collateralForm.car_registration_number || "");
      formData.append("car_chassis_number", collateralForm.car_chassis_number || "");
      formData.append("car_color", collateralForm.car_color || "");
      formData.append("car_make", collateralForm.car_make || "");
      formData.append("car_model", collateralForm.car_model || "");
      formData.append("car_year", collateralForm.car_year || "");
      // ensure land_area string is present
      const landArea = collateralForm.land_area || (collateralForm.land_area_value ? `${collateralForm.land_area_value} ${collateralForm.land_area_unit || "acres"}` : "");
      formData.append("land_registration_number", collateralForm.land_registration_number || "");
      formData.append("land_area", landArea);
      formData.append("land_location", collateralForm.land_location || "");
      formData.append("land_dimensions", collateralForm.land_dimensions || "");

      if (collateralForm.car_reg_cert) formData.append("car_reg_cert", collateralForm.car_reg_cert);
      if (collateralForm.car_utility_bill) formData.append("car_utility_bill", collateralForm.car_utility_bill);
      if (collateralForm.land_reg_cert) formData.append("land_reg_cert", collateralForm.land_reg_cert);

      const resultAction = await dispatch(createLoanCollateral({ loan_id: id, formData }));
      if (createLoanCollateral.fulfilled.match(resultAction)) {
        setCollateralSaved(true);
        // refresh loan details
        if (id) dispatch(getLoanApplicationById(id));
        setCollateralForm({
        collateral_type: "",
        description: "",
        car_registration_number: "",
        car_chassis_number: "",
        car_color: "",
        car_make: "",
        car_model: "",
        car_year: "",
        land_registration_number: "",
        land_area: "",
        land_area_value: "",
        land_area_unit: "acres",
        land_location: "",
        land_dimensions: "",
        car_reg_cert: null,
        car_utility_bill: null,
        land_reg_cert: null,
      });
      } else {
        const err = resultAction.payload || resultAction.error?.message || "Failed to save collateral";
        console.error("Failed to save collateral:", err);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingCollateral(false);
      setTimeout(() => setCollateralSaved(false), 3000);
    }
  };

  useEffect(() => {
    if (id) dispatch(getLoanApplicationById(id));
  }, [dispatch, id]);

  // Persist data by caching loan ID for app reload
  useEffect(() => {
    // Cache current loan ID
    if (id) {
      localStorage.setItem(`currentLoanId`, id);
    }
  }, [id]);

  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const profileImage =
    selectedLoan?.user?.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedLoan?.user?.full_name || "User")}&background=0D8ABC&color=fff&size=128`;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Loan Details" pageTitle="Loan Application" />

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
                    </div>
                    <h5 className="fs-16 mb-1">{selectedLoan?.user?.full_name || "-"}</h5>
                    <p className="text-muted mb-0">{selectedLoan?.user?.user_id || "-"}</p>
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
                      <Button color="light" size="sm" onClick={() => navigate(-1)}>
                        Back
                      </Button>
                    </div>
                  </div>
                  <div className="mb-3 d-flex">
                    <div className="avatar-xs d-block flex-shrink-0 me-3">
                      <span className="avatar-title rounded-circle fs-16 bg-body text-body">
                        <i className="ri-id-card-line"></i>
                      </span>
                    </div>
                    <Input type="email" className="form-control" placeholder="User ID" value={selectedLoan?.user?.user_id || "-"} disabled />
                  </div>
                  <div className="mb-3 d-flex">
                    <div className="avatar-xs d-block flex-shrink-0 me-3">
                      <span className="avatar-title rounded-circle fs-16 bg-primary-subtle text-primary">
                        <i className="ri-building-4-line"></i>
                      </span>
                    </div>
                    <Input type="text" className="form-control" placeholder="Branch" value={selectedLoan?.user?.branch?.name || "-"} disabled />
                  </div>
                  <div className="mb-3 d-flex">
                    <div className="avatar-xs d-block flex-shrink-0 me-3">
                      <span className="avatar-title rounded-circle fs-16 bg-success-subtle text-success">
                        <i className="ri-briefcase-4-line"></i>
                      </span>
                    </div>
                    <Input type="text" className="form-control" placeholder="Account Type" value={selectedLoan?.user?.account_type || "-"} disabled />
                  </div>
                  <div className="d-flex">
                    <div className="avatar-xs d-block flex-shrink-0 me-3">
                      <span className="avatar-title rounded-circle fs-16 bg-danger-subtle text-danger">
                        <i className="ri-shield-check-line"></i>
                      </span>
                    </div>
                    <Input type="text" className="form-control" placeholder="Status" value={selectedLoan?.user?.is_active ? "Active" : "Inactive"} disabled />
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
                        Collateral
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink className={classnames({ active: activeTab === "2" })} onClick={() => tabChange("2")}>
                        Guarantors
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink className={classnames({ active: activeTab === "3" })} onClick={() => tabChange("3")}>
                        Documents
                      </NavLink>
                    </NavItem>
                    {selectedLoan?.status === "active" && (
                      <NavItem>
                        <NavLink className={classnames({ active: activeTab === "4" })} onClick={() => tabChange("4")}>
                          Repayment
                        </NavLink>
                      </NavItem>
                    )}
                  </Nav>
                </CardHeader>

                <CardBody className="p-4">
                  {selectedLoanLoading ? (
                    <div className="text-center py-5">
                      <Spinner color="primary" />
                    </div>
                  ) : selectedLoanError ? (
                    <div className="text-danger py-4">{selectedLoanError}</div>
                  ) : (
                    <TabContent activeTab={activeTab}>
                      <TabPane tabId="1">
                        <h5 className="mb-3">Collateral</h5>
                        {collateralEntries.length ? (
                          collateralEntries.map((c, idx) => (
                            <Form key={idx} className="border rounded p-3 mb-3">
                              <div className="fw-semibold mb-3">{c.collateral_type ? c.collateral_type.replace(/_/g, " ") : `Collateral ${idx + 1}`}</div>
                              <Row>
                                <Col lg={6} className="mb-3">
                                  <FormGroup>
                                    <Label className="form-label">Collateral Type</Label>
                                    <Input type="text" className="form-control" value={c.collateral_type || "-"} disabled />
                                  </FormGroup>
                                </Col>
                                <Col lg={6} className="mb-3">
                                  <FormGroup>
                                    <Label className="form-label">Description</Label>
                                    <Input type="text" className="form-control" value={c.description || "-"} disabled />
                                  </FormGroup>
                                </Col>
                                <Col lg={6} className="mb-3">
                                  <FormGroup>
                                    <Label className="form-label">Car Registration Number</Label>
                                    <Input type="text" className="form-control" value={c.car_registration_number || "-"} disabled />
                                  </FormGroup>
                                </Col>
                                <Col lg={6} className="mb-3">
                                  <FormGroup>
                                    <Label className="form-label">Car Chassis Number</Label>
                                    <Input type="text" className="form-control" value={c.car_chassis_number || "-"} disabled />
                                  </FormGroup>
                                </Col>
                                <Col lg={6} className="mb-3">
                                  <FormGroup>
                                    <Label className="form-label">Car Color</Label>
                                    <Input type="text" className="form-control" value={c.car_color || "-"} disabled />
                                  </FormGroup>
                                </Col>
                                <Col lg={6} className="mb-3">
                                  <FormGroup>
                                    <Label className="form-label">Car Make</Label>
                                    <Input type="text" className="form-control" value={c.car_make || "-"} disabled />
                                  </FormGroup>
                                </Col>
                                <Col lg={6} className="mb-3">
                                  <FormGroup>
                                    <Label className="form-label">Car Model</Label>
                                    <Input type="text" className="form-control" value={c.car_model || "-"} disabled />
                                  </FormGroup>
                                </Col>
                                <Col lg={6} className="mb-3">
                                  <FormGroup>
                                    <Label className="form-label">Car Year</Label>
                                    <Input type="text" className="form-control" value={c.car_year != null ? c.car_year : "-"} disabled />
                                  </FormGroup>
                                </Col>
                                <Col lg={6} className="mb-3">
                                  <FormGroup>
                                    <Label className="form-label">Land Registration Number</Label>
                                    <Input type="text" className="form-control" value={c.land_registration_number || "-"} disabled />
                                  </FormGroup>
                                </Col>
                                <Col lg={6} className="mb-3">
                                  <FormGroup>
                                    <Label className="form-label">Land Area</Label>
                                    <Input type="text" className="form-control" value={c.land_area || "-"} disabled />
                                  </FormGroup>
                                </Col>
                                <Col lg={6} className="mb-3">
                                  <FormGroup>
                                    <Label className="form-label">Land Location</Label>
                                    <Input type="text" className="form-control" value={c.land_location || "-"} disabled />
                                  </FormGroup>
                                </Col>
                                <Col lg={6} className="mb-3">
                                  <FormGroup>
                                    <Label className="form-label">Land Dimensions</Label>
                                    <Input type="text" className="form-control" value={c.land_dimensions || "-"} disabled />
                                  </FormGroup>
                                </Col>
                                <Col lg={6} className="mb-3">
                                  <FormGroup>
                                    <Label className="form-label">Car Registration Certificate</Label>
                                    <Input type="text" className="form-control" value={c.car_reg_cert || "-"} disabled />
                                  </FormGroup>
                                </Col>
                                <Col lg={6} className="mb-3">
                                  <FormGroup>
                                    <Label className="form-label">Car Utility Bill</Label>
                                    <Input type="text" className="form-control" value={c.car_utility_bill || "-"} disabled />
                                  </FormGroup>
                                </Col>
                                <Col lg={6} className="mb-3">
                                  <FormGroup>
                                    <Label className="form-label">Land Registration Certificate</Label>
                                    <Input type="text" className="form-control" value={c.land_reg_cert || "-"} disabled />
                                  </FormGroup>
                                </Col>
                              </Row>
                            </Form>
                          ))
                        ) : (
                          <Form className="border rounded p-3" onSubmit={submitCollateral}>
                            <div className="fw-semibold mb-3">Add Collateral</div>
                            <Row>
                              <Col lg={6} className="mb-3">
                                <FormGroup>
                                  <Label className="form-label">Collateral Type <span className="text-danger">*</span></Label>
                                  <Input
                                    name="collateral_type"
                                    type="select"
                                    className="form-control"
                                    value={collateralForm.collateral_type}
                                    onChange={handleCollateralChange}
                                    required
                                  >
                                    <option value="">Select type</option>
                                    <option value="car">Car</option>
                                    <option value="land">Land</option>
                                    <option value="both">Both</option>
                                  </Input>
                                </FormGroup>
                              </Col>
                              <Col lg={6} className="mb-3">
                                <FormGroup>
                                  <Label className="form-label">Description</Label>
                                  <Input name="description" type="text" className="form-control" value={collateralForm.description} onChange={handleCollateralChange} />
                                </FormGroup>
                              </Col>

                              {showCar && (
                                <Col lg={6} className="mb-3">
                                  <FormGroup>
                                    <Label className="form-label">Car Registration Number</Label>
                                    <Input
                                      name="car_registration_number"
                                      type="text"
                                      className="form-control"
                                      placeholder="e.g. GE 1234-21"
                                      title="Format: 2 letters, space, 3-4 digits, hyphen, 2 digits (e.g. GE 1234-21)"
                                      value={collateralForm.car_registration_number}
                                      onChange={handleCollateralChange}
                                      onBlur={(e) => {
                                        const val = e.target.value;
                                        if (val && !validateCarRegistration(val)) {
                                          e.target.setCustomValidity("Expected format: GE 1234-21");
                                        } else {
                                          e.target.setCustomValidity("");
                                        }
                                      }}
                                    />
                                  </FormGroup>
                                </Col>
                              )}

                              {showCar && (
                                <Col lg={6} className="mb-3">
                                  <FormGroup>
                                    <Label className="form-label">Car Chassis Number</Label>
                                    <Input name="car_chassis_number" type="text" className="form-control" value={collateralForm.car_chassis_number} onChange={handleCollateralChange} />
                                  </FormGroup>
                                </Col>
                              )}

                              {showCar && (
                                <Col lg={6} className="mb-3">
                                  <FormGroup>
                                    <Label className="form-label">Car Color</Label>
                                    <Input name="car_color" type="text" className="form-control" value={collateralForm.car_color} onChange={handleCollateralChange} />
                                  </FormGroup>
                                </Col>
                              )}

                              {showCar && (
                                <Col lg={6} className="mb-3">
                                  <FormGroup>
                                    <Label className="form-label">Car Make</Label>
                                    <Input name="car_make" type="text" className="form-control" value={collateralForm.car_make} onChange={handleCollateralChange} />
                                  </FormGroup>
                                </Col>
                              )}

                              {showCar && (
                                <Col lg={6} className="mb-3">
                                  <FormGroup>
                                    <Label className="form-label">Car Model</Label>
                                    <Input name="car_model" type="text" className="form-control" value={collateralForm.car_model} onChange={handleCollateralChange} />
                                  </FormGroup>
                                </Col>
                              )}

                              {showCar && (
                                <Col lg={6} className="mb-3">
                                  <FormGroup>
                                    <Label className="form-label">Car Year</Label>
                                    <Input name="car_year" type="select" className="form-control" value={collateralForm.car_year} onChange={handleCollateralChange}>
                                      <option value="">Select year</option>
                                      {generateYears(1980).map((y) => (
                                        <option key={y} value={y}>
                                          {y}
                                        </option>
                                      ))}
                                    </Input>
                                  </FormGroup>
                                </Col>
                              )}

                              {showLand && (
                                <Col lg={6} className="mb-3">
                                  <FormGroup>
                                    <Label className="form-label">Land Registration Number</Label>
                                    <Input name="land_registration_number" type="text" className="form-control" value={collateralForm.land_registration_number} onChange={handleCollateralChange} />
                                  </FormGroup>
                                </Col>
                              )}

                              {showLand && (
                                <Col lg={6} className="mb-3">
                                  <FormGroup>
                                    <Label className="form-label">Land Area</Label>
                                    <div className="d-flex">
                                      <Input
                                        name="land_area_value"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className="form-control me-2"
                                        placeholder="e.g. 2.50"
                                        value={collateralForm.land_area_value}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setCollateralForm((prev) => ({
                                            ...prev,
                                            land_area_value: val,
                                            land_area: val ? `${val} ${prev.land_area_unit || "acres"}` : "",
                                          }));
                                        }}
                                      />
                                      <Input
                                        name="land_area_unit"
                                        type="select"
                                        value={collateralForm.land_area_unit}
                                        onChange={(e) => {
                                          const unit = e.target.value;
                                          setCollateralForm((prev) => ({
                                            ...prev,
                                            land_area_unit: unit,
                                            land_area: prev.land_area_value ? `${prev.land_area_value} ${unit}` : "",
                                          }));
                                        }}
                                      >
                                        <option value="acres">Acres</option>
                                        <option value="hectares">Hectares</option>
                                        <option value="sqm">Square meters</option>
                                      </Input>
                                    </div>
                                  </FormGroup>
                                </Col>
                              )}

                              {showLand && (
                                <Col lg={6} className="mb-3">
                                  <FormGroup>
                                    <Label className="form-label">Land Location</Label>
                                    <Input name="land_location" type="text" className="form-control" value={collateralForm.land_location} onChange={handleCollateralChange} />
                                  </FormGroup>
                                </Col>
                              )}

                              {showLand && (
                                <Col lg={6} className="mb-3">
                                  <FormGroup>
                                    <Label className="form-label">Land Dimensions</Label>
                                    <Input name="land_dimensions" type="text" className="form-control" value={collateralForm.land_dimensions} onChange={handleCollateralChange} />
                                  </FormGroup>
                                </Col>
                              )}

                              {showCar && (
                                <Col lg={4} className="mb-3">
                                  <FormGroup>
                                    <Label className="form-label">Car Registration Certificate</Label>
                                    <DropzoneUpload onDrop={(files) => handleAcceptedFiles("car_reg_cert", files)} file={collateralForm.car_reg_cert} />
                                  </FormGroup>
                                </Col>
                              )}

                              {showCar && (
                                <Col lg={4} className="mb-3">
                                  <FormGroup>
                                    <Label className="form-label">Car Utility Bill</Label>
                                    <DropzoneUpload onDrop={(files) => handleAcceptedFiles("car_utility_bill", files)} file={collateralForm.car_utility_bill} />
                                  </FormGroup>
                                </Col>
                              )}

                              {showLand && (
                                <Col lg={4} className="mb-3">
                                  <FormGroup>
                                    <Label className="form-label">Land Registration Certificate</Label>
                                    <DropzoneUpload onDrop={(files) => handleAcceptedFiles("land_reg_cert", files)} file={collateralForm.land_reg_cert} />
                                  </FormGroup>
                                </Col>
                              )}
                            </Row>

                            <div className="d-flex justify-content-end">
                              <Button
                                color="secondary"
                                outline
                                className="me-2"
                                onClick={() =>
                                  setCollateralForm({
                                    collateral_type: "",
                                    description: "",
                                    car_registration_number: "",
                                    car_chassis_number: "",
                                    car_color: "",
                                    car_make: "",
                                    car_model: "",
                                    car_year: "",
                                    land_registration_number: "",
                                    land_area: "",
                                    land_area_value: "",
                                    land_area_unit: "acres",
                                    land_location: "",
                                    land_dimensions: "",
                                    car_reg_cert: null,
                                    car_utility_bill: null,
                                    land_reg_cert: null,
                                  })
                                }
                              >
                                Reset
                              </Button>
                              <Button color="primary" type="submit" disabled={submittingCollateral || !collateralForm.collateral_type}>
                                {submittingCollateral ? "Saving..." : "Save Collateral"}
                              </Button>
                            </div>

                            {collateralSaved && <div className="text-success mt-2">Collateral saved (client-side only).</div>}
                          </Form>
                        )}
                      </TabPane>

                      <TabPane tabId="2">
                        <h5 className="mb-3">Guarantors</h5>
                        {allGuarantors.length ? (
                          allGuarantors.map((g, idx) => {
                            const photoSource =
                              g.photo?.preview ||
                              g.photo_url ||
                              (typeof g.photo === "string" ? g.photo : null);
                            return (
                              <div className="border rounded p-3 mb-2" key={idx}>
                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                                  <div className="d-flex align-items-center gap-3">
                                    <div className="avatar-sm rounded-circle overflow-hidden bg-light" style={{ width: 56, height: 56 }}>
                                      {photoSource ? (
                                        <img
                                          src={photoSource}
                                          alt={g.full_name || `Guarantor ${idx + 1}`}
                                          className="img-fluid"
                                          style={{ width: 56, height: 56, objectFit: "cover" }}
                                        />
                                      ) : (
                                        <div className="avatar-title bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 56, height: 56 }}>
                                          {g.full_name ? g.full_name.charAt(0).toUpperCase() : "G"}
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      <div className="fw-semibold">{g.full_name || `Guarantor ${idx + 1}`}</div>
                                      <div className="text-muted small">Phone: {g.phone_number || g.phone || "-"} • Email: {g.email || "-"}</div>
                                    </div>
                                  </div>
                                  <Button color="secondary" size="sm" type="button" onClick={() => handleEditGuarantor(idx)}>
                                    Edit
                                  </Button>
                                </div>
                                <div className="mt-3">Address: {g.address || "-"}</div>
                                <div className="mt-2">
                                  Type: {getGuarantorTypeLabel(g.guarantor_type)} • ID Type: {getGuarantorIdTypeLabel(g.id_type)} • ID Number: {g.id_number || "-"}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-muted">No guarantors added.</div>
                        )}

                        {(canAddGuarantor || isEditingGuarantor) ? (
                          <Form className="border rounded p-3 mt-4" onSubmit={submitGuarantor}>
                            <div className="fw-semibold mb-3">{isEditingGuarantor ? "Edit Guarantor" : "Add Guarantor"}</div>
                            {isEditingGuarantor && (
                              <div className="alert alert-info py-2 mb-3">
                                Editing guarantor {editingGuarantorIndex + 1}. Make your changes and save.
                                <Button color="link" className="p-0 ms-2" type="button" onClick={clearGuarantorForm}>
                                  Cancel
                                </Button>
                              </div>
                            )}

                            <Row>
                              <Col lg={12} className="mb-3">
                                <FormGroup>
                                  <Label className="form-label">Photo</Label>
                                  <div style={{ maxWidth: 180 }}>
                                    <DropzoneUpload compact thumbSize={56} onDrop={(files) => handleGuarantorAcceptedFiles("photo", files)} file={guarantorForm.photo} />
                                  </div>
                                </FormGroup>
                              </Col>
                              <Col lg={6} className="mb-3">
                                <FormGroup>
                                  <Label className="form-label">Full Name <span className="text-danger">*</span></Label>
                                  <Input
                                    name="full_name"
                                    type="text"
                                    className="form-control"
                                    value={guarantorForm.full_name}
                                    onChange={handleGuarantorChange}
                                    invalid={!!guarantorErrors.full_name}
                                    required
                                  />
                                  {guarantorErrors.full_name && <div className="invalid-feedback d-block">{guarantorErrors.full_name}</div>}
                                </FormGroup>
                              </Col>
                              <Col lg={6} className="mb-3">
                                <FormGroup>
                                  <Label className="form-label">Phone Number <span className="text-danger">*</span></Label>
                                  <Input
                                    name="phone_number"
                                    type="text"
                                    className="form-control"
                                    value={guarantorForm.phone_number}
                                    onChange={handleGuarantorChange}
                                    invalid={!!guarantorErrors.phone_number}
                                    required
                                  />
                                  {guarantorErrors.phone_number && <div className="invalid-feedback d-block">{guarantorErrors.phone_number}</div>}
                                </FormGroup>
                              </Col>
                              <Col lg={6} className="mb-3">
                                <FormGroup>
                                  <Label className="form-label">Email</Label>
                                  <Input
                                    name="email"
                                    type="email"
                                    className="form-control"
                                    value={guarantorForm.email}
                                    onChange={handleGuarantorChange}
                                    invalid={!!guarantorErrors.email}
                                  />
                                  {guarantorErrors.email && <div className="invalid-feedback d-block">{guarantorErrors.email}</div>}
                                </FormGroup>
                              </Col>
                              <Col lg={6} className="mb-3">
                                <FormGroup>
                                  <Label className="form-label">Address</Label>
                                  <Input
                                    name="address"
                                    type="text"
                                    className="form-control"
                                    value={guarantorForm.address}
                                    onChange={handleGuarantorChange}
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg={6} className="mb-3">
                                <FormGroup>
                                  <Label className="form-label">Guarantor Type <span className="text-danger">*</span></Label>
                                  <Input
                                    name="guarantor_type"
                                    type="select"
                                    className="form-control"
                                    value={guarantorForm.guarantor_type}
                                    onChange={handleGuarantorChange}
                                    invalid={!!guarantorErrors.guarantor_type}
                                    required
                                  >
                                    <option value="">Select type</option>
                                    {GUARANTOR_TYPE_OPTIONS.map((option) => (
                                      <option key={option.value} value={option.value}>
                                        {option.label}
                                      </option>
                                    ))}
                                  </Input>
                                  {guarantorErrors.guarantor_type && <div className="invalid-feedback d-block">{guarantorErrors.guarantor_type}</div>}
                                </FormGroup>
                              </Col>
                              <Col lg={6} className="mb-3">
                                <FormGroup>
                                  <Label className="form-label">ID Type <span className="text-danger">*</span></Label>
                                  <Input
                                    name="id_type"
                                    type="select"
                                    className="form-control"
                                    value={guarantorForm.id_type}
                                    onChange={handleGuarantorChange}
                                    invalid={!!guarantorErrors.id_type}
                                    required
                                  >
                                    <option value="">Select ID type</option>
                                    {GUARANTOR_ID_TYPE_OPTIONS.map((option) => (
                                      <option key={option.value} value={option.value}>
                                        {option.label}
                                      </option>
                                    ))}
                                  </Input>
                                  {guarantorErrors.id_type && <div className="invalid-feedback d-block">{guarantorErrors.id_type}</div>}
                                </FormGroup>
                              </Col>
                              <Col lg={6} className="mb-3">
                                <FormGroup>
                                  <Label className="form-label">ID Number <span className="text-danger">*</span></Label>
                                  <Input
                                    name="id_number"
                                    type="text"
                                    className="form-control"
                                    value={guarantorForm.id_number}
                                    placeholder={guarantorForm.id_type === "national_id" ? "GHA-7263748476-3" : "Enter ID number"}
                                    onChange={handleGuarantorChange}
                                    invalid={!!guarantorErrors.id_number}
                                    required
                                  />
                                  {guarantorErrors.id_number && <div className="invalid-feedback d-block">{guarantorErrors.id_number}</div>}
                                </FormGroup>
                              </Col>
                            </Row>

                            <div className="d-flex flex-wrap justify-content-end gap-2">
                              <Button color="secondary" outline className="me-2" onClick={clearGuarantorForm} type="button">
                                Reset
                              </Button>
                              <Button
                                color="primary"
                                type="submit"
                                disabled={submittingGuarantor || !guarantorForm.full_name || !guarantorForm.phone_number || !guarantorForm.guarantor_type || !guarantorForm.id_type || !guarantorForm.id_number}
                              >
                                {submittingGuarantor ? "Saving..." : isEditingGuarantor ? "Update Guarantor" : "Save Guarantor"}
                              </Button>
                            </div>

                            {guarantorSaved && <div className="text-success mt-2">Guarantor saved (client-side only).</div>}
                          </Form>
                        ) : (
                          <div className="alert alert-warning mt-4">
                            Maximum of 2 guarantors reached. Remove one to add another.
                          </div>
                        )}
                      </TabPane>

                      <TabPane tabId="3">
                        <h5 className="mb-3">Documents</h5>
                        {!Array.isArray(selectedLoan?.documents) || !selectedLoan.documents.length ? (
                          <Form className="border rounded p-3 mb-4" onSubmit={submitDocument}>
                            <div className="fw-semibold mb-3">Add Document</div>
                            <Row>
                              <Col lg={6} className="mb-3">
                                <FormGroup>
                                  <Label className="form-label">Document Type <span className="text-danger">*</span></Label>
                                  <Input
                                    name="document_type"
                                    type="select"
                                    className="form-control"
                                    value={documentType}
                                    onChange={handleDocumentTypeChange}
                                    required
                                  >
                                    <option value="">Select document type</option>
                                    {DOCUMENT_TYPE_OPTIONS.map((option) => (
                                      <option key={option.value} value={option.value}>
                                        {option.label}
                                      </option>
                                    ))}
                                  </Input>
                                  {documentErrors.document_type && <div className="text-danger small mt-1">{documentErrors.document_type}</div>}
                                </FormGroup>
                              </Col>

                              <Col lg={6} className="mb-3">
                                <FormGroup>
                                  <Label className="form-label">Files <span className="text-danger">*</span></Label>
                                  <FilePond
                                    files={documentFiles}
                                    onupdatefiles={handleDocumentFilesUpdate}
                                    allowMultiple={true}
                                    name="documentFiles"
                                    className="filepond filepond-input-multiple"
                                  />
                                  {documentErrors.files && <div className="text-danger small mt-1">{documentErrors.files}</div>}
                                </FormGroup>
                                {documentFiles.length ? (
                                  <div className="mt-2">
                                    <div className="fw-semibold">Selected files</div>
                                    <ul className="ps-3 mb-0">
                                      {documentFiles.map((item, idx) => (
                                        <li key={idx}>{item.file?.name || item.name}</li>
                                      ))}
                                    </ul>
                                  </div>
                                ) : null}
                              </Col>
                            </Row>
                            <Button color="primary" type="submit" disabled={!documentType.trim() || !documentFiles.length}>
                              Save Document
                            </Button>
                          </Form>
                        ) : null}

                        {Array.isArray(selectedLoan?.documents) && selectedLoan.documents.length ? (
                          <div className="list-group">
                            {selectedLoan.documents.map((d, idx) => (
                              <a
                                key={idx}
                                className="list-group-item list-group-item-action"
                                href={d.file_url || "#"}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {d.document_name || d.file_url?.split("/").pop() || `Document ${idx + 1}`}
                                {d.document_type ? ` — ${DOCUMENT_TYPE_OPTIONS.find((option) => option.value === d.document_type)?.label || d.document_type}` : ""}
                              </a>
                            ))}
                          </div>
                        ) : (
                          <div className="text-muted">No documents uploaded.</div>
                        )}
                      </TabPane>
                      {selectedLoan?.status === "active" && (
                        <TabPane tabId="4">
                          <div className="mb-3">
                            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
                              <h5 className="mb-0">Repayment</h5>
                            </div>
                            <Form className="border rounded p-3 mb-4" onSubmit={submitRepayment}>
                              <Row>
                                <Col lg={6} className="mb-3">
                                  <FormGroup>
                                    <Label className="form-label">
                                      Amount <span className="text-danger">*</span>
                                    </Label>
                                    <Input
                                      name="amount"
                                      type="number"
                                      min="0.01"
                                      step="0.01"
                                      className="form-control"
                                      value={repaymentForm.amount}
                                      onChange={handleRepaymentChange}
                                      placeholder="Enter repayment amount"
                                      required
                                    />
                                  </FormGroup>
                                </Col>
                                <Col lg={6} className="mb-3">
                                  <FormGroup>
                                    <Label className="form-label">Narration</Label>
                                    <Input
                                      name="narration"
                                      type="text"
                                      className="form-control"
                                      value={repaymentForm.narration}
                                      onChange={handleRepaymentChange}
                                      placeholder="Enter narration"
                                    />
                                  </FormGroup>
                                </Col>
                              </Row>

                              {repaymentError && <div className="text-danger mb-3">{repaymentError}</div>}

                              <div className="d-flex justify-content-end gap-2">
                                <Button color="primary" type="submit" disabled={submittingRepayment || !repaymentForm.amount}>
                                  {submittingRepayment ? "Saving..." : "Save Repayment"}
                                </Button>
                              </div>

                              {repaymentSaved && <div className="text-success mt-2">Repayment added locally.</div>}
                            </Form>

                            {Array.isArray(localRepayments) && localRepayments.length ? (
                              <div className="list-group">
                                {localRepayments.map((r, idx) => (
                                  <div key={idx} className="list-group-item">
                                    <div className="d-flex justify-content-between flex-wrap gap-2">
                                      <div>
                                        ₵{(Number(r.amount) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        {r.narration ? ` — ${r.narration}` : ""}
                                      </div>
                                      <div className="text-muted small">{r.date || r.created_at || "-"}</div>
                                    </div>
                                    {r.method ? <div className="text-muted small mt-2">{r.method}</div> : null}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-muted">No repayments recorded.</div>
                            )}
                          </div>
                        </TabPane>
                      )}
                      {selectedLoan?.status === "active" && (
                        <TabPane tabId="5">
                          <div className="mb-3">
                            <h5 className="mb-3">Penalties</h5>
                            {Array.isArray(selectedLoan?.penalties) && selectedLoan.penalties.length ? (
                              <div className="list-group">
                                {selectedLoan.penalties.map((penalty, idx) => (
                                  <div key={idx} className="list-group-item">
                                    <div className="d-flex justify-content-between flex-wrap gap-2">
                                      <div className="fw-semibold">{penalty.reason || `Penalty ${idx + 1}`}</div>
                                      <div className="text-muted small">{penalty.date || penalty.created_at || "-"}</div>
                                    </div>
                                    <div className="mt-2">
                                      Amount: ₵{(Number(penalty.amount) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                    {penalty.notes ? <div className="text-muted small mt-1">{penalty.notes}</div> : null}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-muted">No penalties recorded.</div>
                            )}
                          </div>
                        </TabPane>
                      )}
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

export default LoanApplicationDetails;
