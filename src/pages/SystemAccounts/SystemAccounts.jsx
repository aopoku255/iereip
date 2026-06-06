import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Badge, Button, Col, Container, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import FeatherIcon from "feather-icons-react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import { createSystemAccount, getSystemAccounts } from "../../slices/thunks";

const SystemAccounts = () => {
  const dispatch = useDispatch();
  const { accounts, loading, error, createLoading, createError } = useSelector(
    (state) => state.SavingsAccounts || {
      accounts: [],
      loading: false,
      error: null,
      createLoading: false,
      createError: null,
    }
  );

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAccount, setNewAccount] = useState({ name: "", description: "" });
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    dispatch(getSystemAccounts());
  }, [dispatch]);

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
        disableFilters: true,
      },
      {
        Header: "Account Number",
        accessor: "account_number",
        disableFilters: true,
      },
      {
        Header: "Name",
        accessor: "name",
        disableFilters: true,
      },
      {
        Header: "Description",
        accessor: "description",
        disableFilters: true,
      },
      {
        Header: "Balance",
        accessor: "balance",
        disableFilters: true,
        Cell: ({ value }) => <span>₵{Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true })}</span>,
      },
      {
        Header: "Status",
        accessor: "is_active",
        disableFilters: true,
        Cell: ({ value }) => {
          const badgeClass = value ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger";
          return <span className={`rounded-pill badge ${badgeClass}`}>{value ? "Active" : "Inactive"}</span>;
        },
      },
      {
        Header: "Created At",
        accessor: "created_at",
        disableFilters: true,
        Cell: ({ value }) => (
          <span className="text-muted">
            {value ? (
              <>
                <span className="fw-bold">{new Date(value).toLocaleDateString()}</span> <small>{new Date(value).toLocaleTimeString()}</small>
              </>
            ) : "-"}
          </span>
        ),
      },
      {
        Header: "Actions",
        id: "actions",
        disableFilters: true,
        Cell: ({ row }) => (
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
                  // Add view account logic here
                }}
              >
                <FeatherIcon icon="eye" className="me-2" size={15} />
                View
              </DropdownItem>
              <DropdownItem
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  // Add edit account logic here
                }}
              >
                <FeatherIcon icon="edit" className="me-2" size={15} />
                Edit
              </DropdownItem>
              <DropdownItem
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  // Add delete account logic here
                }}
              >
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

  const data = useMemo(() => accounts || [], [accounts]);

  const toggleCreateModal = () => {
    setShowCreateModal((current) => !current);
    if (showCreateModal) {
      setNewAccount({ name: "", description: "" });
      setFormError(null);
    }
  };

  const handleNewAccountChange = (event) => {
    const { name, value } = event.target;
    setNewAccount((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateAccount = async (event) => {
    event.preventDefault();
    setFormError(null);

    if (!newAccount.name.trim()) {
      setFormError("Account name is required.");
      return;
    }

    try {
      await dispatch(createSystemAccount({
        name: newAccount.name.trim(),
        description: newAccount.description.trim(),
      })).unwrap();
      setShowCreateModal(false);
      setNewAccount({ name: "", description: "" });
      setFormError(null);
    } catch (createErr) {
      setFormError(createErr?.message || "Unable to create account.");
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Savings Accounts" pageTitle="Pages" />
          <Row className="mb-4">
            <Col className="text-end">
              <Button color="primary" onClick={toggleCreateModal} className="mb-2">
                <i className="mdi mdi-plus-circle-outline me-1" /> Create System Account
              </Button>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              {error && <div className="alert alert-danger">{error}</div>}
              {loading ? (
                <div className="text-center py-4">
                  <Spinner color="primary" />
                </div>
              ) : (
                <TableContainer
                  columns={columns}
                  data={data}
                  isGlobalFilter={true}
                  customPageSize={10}
                  className="table-striped"
                  tableClass="table table-hover"
                />
              )}
            </Col>
          </Row>
        </Container>

        <Modal isOpen={showCreateModal} toggle={toggleCreateModal} size="md" centered>
          <ModalHeader toggle={toggleCreateModal}>Create System Account</ModalHeader>
          <ModalBody>
            <Form onSubmit={handleCreateAccount}>
              {(formError || createError) && (
                <div className="alert alert-danger">{formError || createError}</div>
              )}
              <FormGroup>
                <Label for="name">Name <span className="text-danger">*</span></Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={newAccount.name}
                  onChange={handleNewAccountChange}
                  placeholder="Enter account name"
                />
              </FormGroup>
              <FormGroup>
                <Label for="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  type="text"
                  value={newAccount.description}
                  onChange={handleNewAccountChange}
                  placeholder="Enter account description"
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleCreateModal} disabled={createLoading}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleCreateAccount} disabled={createLoading}>
              {createLoading ? "Saving..." : "Save Account"}
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default SystemAccounts;
