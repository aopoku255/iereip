import React, { useState, useMemo, useEffect } from "react";
import {
  Badge,
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Offcanvas,
  OffcanvasBody,
  OffcanvasHeader,
  Row,
  Spinner,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import { APIClient } from "../../helpers/api_helper";
import { SelectColumnFilter } from "../../Components/Common/filters";

const ListBranches = () => {
  document.title = "List Branches";
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);
  const [newBranch, setNewBranch] = useState({
    name: "",
    code: "",
    address: "",
    phone: "",
  });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isViewOffcanvasOpen, setIsViewOffcanvasOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedBranch, setEditedBranch] = useState({
    name: "",
    code: "",
    address: "",
    phone: "",
  });
  const [updateError, setUpdateError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const columns = useMemo(
    () => [
      {
        Header: (
          <input
            type="checkbox"
            id="checkBoxAll"
            className="form-check-input"
          />
        ),
        Cell: (cellProps) => {
          return (
            <input
              type="checkbox"
              className="staffCheckBox form-check-input"
              value={cellProps?.row?.original?.id}
            />
          );
        },
        id: "check",
        disableFilters: true,
      },
      {
        Header: "BRANCH NAME",
        accessor: "name",
        disableFilters: true,
        Cell: (cell) => <span>{cell.value}</span>,
      },
      {
        Header: "CODE",
        accessor: "code",
        disableFilters: true,
        Cell: (cell) => <span>{cell.value}</span>,
      },
      {
        Header: "ADDRESS",
        accessor: "address",
        disableFilters: true,
        Cell: (cell) => <span>{cell.value}</span>,
      },
      {
        Header: "PHONE",
        accessor: "phone",
        disableFilters: true,
        Cell: (cell) => <span>{cell.value}</span>,
      },
      {
        Header: "STATUS",
        accessor: (row) => (row.is_active ? "Active" : "Inactive"),
        Filter: SelectColumnFilter,
        showFilterInHeader: false,
        Cell: (cell) => (
          <Badge color={cell.value === "Active" ? "success" : "danger"} pill>
            {cell.value}
          </Badge>
        ),
      },
     
      {
        Header: "CREATED",
        accessor: "created_at",
        disableFilters: true,
        Cell: (cell) => (
          <span className="text-muted">
            {cell.value ? (
              <>
                <span className="fw-bold">{new Date(cell.value).toLocaleDateString()}</span> <small>{new Date(cell.value).toLocaleTimeString()}</small>
              </>
            ) : "-"}
          </span>
        ),
      },
       {
        Header: "ACTIONS",
        id: "actions",
        disableFilters: true,
        Cell: ({ row }) => (
          <div className="d-flex gap-1">
            <Button
              type="button"
              color="soft-primary"
              className="btn-sm"
              onClick={() => handleViewBranch(row.original)}
              title="View Branch"
            >
              <i className="mdi mdi-eye-outline"></i>
            </Button>
            <Button
              type="button"
              color="soft-secondary"
              className="btn-sm"
              onClick={() => handleEditBranchFromTable(row.original)}
              title="Edit Branch"
            >
              <i className="mdi mdi-pencil-outline"></i>
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const toggleAddBranchModal = () => {
    setFormError("");
    setIsAddBranchModalOpen((prev) => !prev);
  };

  const handleBranchChange = (event) => {
    const { name, value } = event.target;
    setNewBranch((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateBranch = async (event) => {
    event.preventDefault();
    setFormError("");

    const { name, code, address, phone } = newBranch;
    if (!name || !code || !address || !phone) {
      setFormError("Please complete all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const api = new APIClient();
      const response = await api.create("/branches", newBranch);
      if (response?.code === "00" && response?.status === "success") {
        setBranches((prev) => [response.data, ...(prev || [])]);
        setNewBranch({ name: "", code: "", address: "", phone: "" });
        setIsAddBranchModalOpen(false);
      } else {
        setFormError(response?.message || "Unable to create branch.");
      }
    } catch (err) {
      setFormError(err?.message || "Unable to create branch.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewBranch = (branch) => {
    setSelectedBranch(branch);
    setEditedBranch({
      name: branch.name,
      code: branch.code,
      address: branch.address,
      phone: branch.phone,
    });
    setIsEditMode(false);
    setUpdateError("");
    setIsViewOffcanvasOpen(true);
  };

  const handleEditBranch = () => {
    setIsEditMode(true);
  };

  const handleEditBranchFromTable = (branch) => {
    setSelectedBranch(branch);
    setEditedBranch({
      name: branch.name,
      code: branch.code,
      address: branch.address,
      phone: branch.phone,
    });
    setIsEditMode(true);
    setUpdateError("");
    setIsViewOffcanvasOpen(true);
  };

  const handleCancelEdit = () => {
    setEditedBranch({
      name: selectedBranch.name,
      code: selectedBranch.code,
      address: selectedBranch.address,
      phone: selectedBranch.phone,
    });
    setIsEditMode(false);
    setUpdateError("");
  };

  const handleEditedBranchChange = (event) => {
    const { name, value } = event.target;
    setEditedBranch((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateBranch = async (event) => {
    event.preventDefault();
    setUpdateError("");

    const { name, code, address, phone } = editedBranch;
    if (!name || !code || !address || !phone) {
      setUpdateError("Please complete all required fields.");
      return;
    }

    setIsUpdating(true);
    try {
      const api = new APIClient();
      const response = await api.put(`/branches/${selectedBranch.id}`, editedBranch);
      if (response?.code === "00" && response?.status === "success") {
        setBranches((prev) =>
          prev.map((branch) =>
            branch.id === selectedBranch.id ? response.data : branch
          )
        );
        setSelectedBranch(response.data);
        setIsEditMode(false);
        setUpdateError("");
      } else {
        setUpdateError(response?.message || "Unable to update branch.");
      }
    } catch (err) {
      setUpdateError(err?.message || "Unable to update branch.");
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleViewOffcanvas = () => {
    setIsViewOffcanvasOpen((prev) => {
      if (prev) {
        setSelectedBranch(null);
      }
      return !prev;
    });
  };

  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true);
      setError("");
      try {
        const api = new APIClient();
        const response = await api.get("/branches");
        if (response?.code === "00" && response?.status === "success") {
          setBranches(response.data || []);
        } else {
          setError(response?.message || "Unable to load branches.");
        }
      } catch (err) {
        setError(err?.message || "Unable to load branches.");
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="List Branches" pageTitle="Pages" />
          <Row>
            <Col xs={12}>
              {error && <div className="alert alert-danger">{error}</div>}
              <TableContainer
                columns={columns}
                data={branches}
                isGlobalFilter={true}
                isAddBranch={true}
                handleAddBranchClick={toggleAddBranchModal}
                customPageSize={10}
                className="table-striped"
                tableClass="table table-hover"
              />
              {loading && (
                <div className="text-center py-5">
                  <Spinner color="primary" />
                </div>
              )}
            </Col>
          </Row>
        </Container>

        <Modal isOpen={isAddBranchModalOpen} toggle={toggleAddBranchModal} size="md" centered>
          <ModalHeader toggle={toggleAddBranchModal}>Create New Branch</ModalHeader>
          <ModalBody>
            <Form onSubmit={handleCreateBranch}>
              {formError && <div className="alert alert-danger">{formError}</div>}
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="name">Branch Name <span className="text-danger">*</span></Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={newBranch.name}
                      onChange={handleBranchChange}
                      placeholder="Enter branch name"
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="code">Branch Code <span className="text-danger">*</span></Label>
                    <Input
                      id="code"
                      name="code"
                      type="text"
                      value={newBranch.code}
                      onChange={handleBranchChange}
                      placeholder="Enter branch code"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FormGroup>
                    <Label for="address">Address <span className="text-danger">*</span></Label>
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      value={newBranch.address}
                      onChange={handleBranchChange}
                      placeholder="Enter address"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FormGroup>
                    <Label for="phone">Phone <span className="text-danger">*</span></Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="text"
                      value={newBranch.phone}
                      onChange={handleBranchChange}
                      placeholder="Enter phone number"
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleAddBranchModal}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleCreateBranch} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Branch"}
            </Button>
          </ModalFooter>
        </Modal>

        <Offcanvas
          isOpen={isViewOffcanvasOpen}
          toggle={toggleViewOffcanvas}
          direction="end"
          className="offcanvas-end"
        >
          <OffcanvasHeader toggle={toggleViewOffcanvas}>
            {isEditMode ? "Edit Branch" : "Branch Details"}
            {!isEditMode && (
              <Button
                color="primary"
                size="sm"
                className="ms-2"
                onClick={handleEditBranch}
              >
                <i className="mdi mdi-pencil-outline"></i> Edit
              </Button>
            )}
          </OffcanvasHeader>
          <OffcanvasBody>
            {selectedBranch ? (
              isEditMode ? (
                <Form onSubmit={handleUpdateBranch}>
                  {updateError && <div className="alert alert-danger">{updateError}</div>}
                  <Row className="mb-3">
                    <Col sm={12}>
                      <FormGroup>
                        <Label for="edit-name">Branch Name <span className="text-danger">*</span></Label>
                        <Input
                          id="edit-name"
                          name="name"
                          type="text"
                          value={editedBranch.name}
                          onChange={handleEditedBranchChange}
                          placeholder="Enter branch name"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={12}>
                      <FormGroup>
                        <Label for="edit-code">Branch Code <span className="text-danger">*</span></Label>
                        <Input
                          id="edit-code"
                          name="code"
                          type="text"
                          value={editedBranch.code}
                          onChange={handleEditedBranchChange}
                          placeholder="Enter branch code"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={12}>
                      <FormGroup>
                        <Label for="edit-address">Address <span className="text-danger">*</span></Label>
                        <Input
                          id="edit-address"
                          name="address"
                          type="text"
                          value={editedBranch.address}
                          onChange={handleEditedBranchChange}
                          placeholder="Enter address"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={12}>
                      <FormGroup>
                        <Label for="edit-phone">Phone <span className="text-danger">*</span></Label>
                        <Input
                          id="edit-phone"
                          name="phone"
                          type="text"
                          value={editedBranch.phone}
                          onChange={handleEditedBranchChange}
                          placeholder="Enter phone number"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <div className="d-flex gap-2">
                    <Button color="secondary" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                    <Button color="primary" type="submit" disabled={isUpdating}>
                      {isUpdating ? "Updating..." : "Update Branch"}
                    </Button>
                  </div>
                </Form>
              ) : (
                <div>
                  <div className="mb-4">
                    <h5 className="mb-1 fw-semibold">{selectedBranch.name}</h5>
                    <div className="d-flex flex-wrap gap-2">
                      <Badge className="rounded-pill bg-success-subtle text-success">
                        {selectedBranch.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <hr className="text-muted" />
                  <Row className="mb-3">
                    <Col sm={4} className="text-muted">
                      Branch Code
                    </Col>
                    <Col sm={8} className="fw-semibold">
                      {selectedBranch.code}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={4} className="text-muted">
                      Address
                    </Col>
                    <Col sm={8} className="fw-semibold">
                      {selectedBranch.address}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={4} className="text-muted">
                      Phone
                    </Col>
                    <Col sm={8} className="fw-semibold">
                      {selectedBranch.phone}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={4} className="text-muted">
                      Created
                    </Col>
                    <Col sm={8} className="fw-semibold">
                      {selectedBranch.created_at ? new Date(selectedBranch.created_at).toLocaleString() : "-"}
                    </Col>
                  </Row>
                </div>
              )
            ) : (
              <div className="text-center py-5">
                <p className="text-muted">Select a branch to view details.</p>
              </div>
            )}
          </OffcanvasBody>
        </Offcanvas>
      </div>
    </React.Fragment>
  );
};

export default ListBranches;
