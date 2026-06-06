import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import { APIClient } from "../../helpers/api_helper";

const Broadcast = () => {
  document.title = "Broadcast";
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleOpenModal = (branch) => {
    setSelectedBranch(branch);
    setMessage("");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBranch(null);
    setMessage("");
    setSending(false);
  };

  const handleBroadcast = async () => {
    const trimmedMessage = message.trim();
    if (!selectedBranch?.id) {
      toast.error("Please select a branch.", { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!trimmedMessage) {
      toast.error("Please enter a broadcast message.", { position: "top-right", autoClose: 3000 });
      return;
    }
    setSending(true);
    try {
      const api = new APIClient();
      const response = await api.create("https://iereip-api.deducesolutions.com/api/v1/sms/broadcast", {
        message: trimmedMessage,
        branch_id: selectedBranch.id,
      });
      if (response?.code === "00" && response?.status === "success") {
        toast.success(response?.message || "Broadcast complete.", { position: "top-right", autoClose: 3000 });
        handleCloseModal();
      } else {
        toast.error(response?.message || "Broadcast failed.", { position: "top-right", autoClose: 3000 });
      }
    } catch (err) {
      toast.error(err?.message || "Broadcast failed.", { position: "top-right", autoClose: 3000 });
    } finally {
      setSending(false);
    }
  };

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
        Cell: (cellProps) => (
          <input
            type="checkbox"
            className="staffCheckBox form-check-input"
            value={cellProps?.row?.original?.id}
          />
        ),
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
        disableFilters: true,
        Cell: (cell) => (
          <span
            className={`badge ${
              cell.value === "Active"
                ? "bg-success-subtle text-success"
                : "bg-danger-subtle text-danger"
            }`}
          >
            {cell.value}
          </span>
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
                <span className="fw-bold">
                  {new Date(cell.value).toLocaleDateString()}
                </span>{" "}
                <small>{new Date(cell.value).toLocaleTimeString()}</small>
              </>
            ) : (
              "-"
            )}
          </span>
        ),
      },
      {
        Header: "ACTIONS",
        id: "actions",
        disableFilters: true,
        Cell: ({ row }) => (
          <Button
            type="button"
            color="primary"
            className="btn-sm"
            onClick={() => handleOpenModal(row.original)}
          >
            Broadcast
          </Button>
        ),
      },
    ],
    [handleOpenModal]
  );

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

  document.title = "Broadcast SMS | IEREIP - Loan Management System";

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Broadcast" pageTitle="SMS" />
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h4 className="card-title mb-0">Broadcast</h4>
                    <p className="text-muted mb-0 small">
                      Select a branch and click Broadcast to send SMS to its contacts.
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                {error && <div className="alert alert-danger">{error}</div>}
                {!error && (
                  <TableContainer
                    columns={columns}
                    data={branches}
                    isGlobalFilter
                    isGlobalSearch
                    customPageSize={10}
                    className="table-striped"
                    tableClass="table table-hover"
                  />
                )}
                {loading && (
                  <div className="text-center py-5">
                    <Spinner color="primary" />
                  </div>
                )}
                <Modal isOpen={modalOpen} toggle={handleCloseModal} centered>
                  <ModalHeader toggle={handleCloseModal}>Broadcast SMS</ModalHeader>
                  <ModalBody>
                    <p className="mb-3">
                      Broadcast to branch: <strong>{selectedBranch?.name || "-"}</strong>
                    </p>
                    <FormGroup>
                      <Label for="broadcastMessage">Message</Label>
                      <Input
                        type="textarea"
                        id="broadcastMessage"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter broadcast message"
                        rows={4}
                        disabled={sending}
                      />
                    </FormGroup>
                    {sending && (
                      <div className="text-center py-3">
                        <Spinner size="sm" color="primary" /> Sending broadcast...
                      </div>
                    )}
                  </ModalBody>
                  <ModalFooter>
                    <Button color="secondary" onClick={handleCloseModal} disabled={sending}>
                      Cancel
                    </Button>
                    <Button color="primary" onClick={handleBroadcast} disabled={sending}>
                      {sending ? (
                        <>
                          <Spinner size="sm" className="me-2" /> Broadcasting...
                        </>
                      ) : (
                        "Broadcast"
                      )}
                    </Button>
                  </ModalFooter>
                </Modal>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Broadcast;
