import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, CardHeader, Col, Container, Row, Spinner, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from "reactstrap";
import { toast } from "react-toastify";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { BranchColumnFilter, StatusColumnFilter } from "../../Components/Common/filters";
import TableContainer from "../../Components/Common/TableContainer";
import { APIClient } from "../../helpers/api_helper";
import { getUsers } from "../../slices/thunks";

const SendSMS = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.Users || {});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setMessage("");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
    setMessage("");
  };

  const handleSendSMS = async () => {
    if (!selectedUser?.id) {
      toast.error("Please select a user first.", { position: "top-right", autoClose: 3000 });
      return;
    }

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      toast.error("Please enter a message to send.", { position: "top-right", autoClose: 3000 });
      return;
    }

    setSending(true);
    try {
      const apiClient = new APIClient();
      const response = await apiClient.create("https://iereip-api.deducesolutions.com/api/v1/sms/send", {
        user_id: selectedUser.id,
        message: trimmedMessage,
      });

      const payload = response?.data || response;
      if (payload?.status === "success" || payload?.code === "00") {
        toast.success(payload?.message || "SMS sent successfully.", { position: "top-right", autoClose: 3000 });
        handleCloseModal();
      } else {
        toast.error(payload?.message || "Failed to send SMS.", { position: "top-right", autoClose: 3000 });
      }
    } catch (err) {
      toast.error(err?.message || "Failed to send SMS.", { position: "top-right", autoClose: 3000 });
    } finally {
      setSending(false);
    }
  };

  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      {
        Header: "User",
        accessor: "full_name",
        Cell: ({ row }) => {
          const user = row.original;
          const avatar = user.photo_url || user.profile_image || user.avatar || user.image || user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || "User")}&background=0D8ABC&color=fff&size=40`;
          return (
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <img
                  src={avatar}
                  alt={user.full_name || "User"}
                  className="rounded-circle avatar-xs"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || "User")}&background=0D8ABC&color=fff&size=40`;
                  }}
                />
              </div>
              <div className="flex-grow-1 ms-2">
                <h6 className="mb-1 fw-semibold">{user.full_name || "-"}</h6>
                <small className="text-muted">{user.user_id || "-"}</small>
              </div>
            </div>
          );
        },
      },
      {
        Header: "Contact",
        accessor: "email",
        Cell: ({ row }) => (
          <div>
            <div className="mb-1 fw-semibold">{row.original.email || "-"}</div>
            <small className="text-muted">{row.original.mobile_number || "-"}</small>
          </div>
        ),
      },
      {
        Header: "Branch",
        id: "branch",
        accessor: (row) => (row.branch ? row.branch.name : ""),
        Filter: BranchColumnFilter,
        showFilterInHeader: false,
      },
      { Header: "Account Type", accessor: "account_type" },
      {
        Header: "Status",
        accessor: "is_active",
        Filter: StatusColumnFilter,
        showFilterInHeader: false,
        Cell: ({ value }) => (
          value ? <span className="badge bg-success-subtle text-success">Active</span> : <span className="badge bg-danger-subtle text-danger">Inactive</span>
        ),
      },
      {
        Header: "Actions",
        id: "actions",
        disableFilters: true,
        Cell: ({ row }) => (
          <Button
            type="button"
            color="primary"
            className="btn-sm"
            onClick={() => handleOpenModal(row.original)}
          >
            Send SMS
          </Button>
        ),
      },
    ],
    []
  );

  document.title = "Send SMS | IEREIP - Loan Management System";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Send SMS" pageTitle="SMS" />
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader className="align-items-center d-flex">
                  <div>
                    <h4 className="card-title mb-0">Send SMS</h4>
                    <p className="text-muted mb-0 small">Select a user and send a message directly from here.</p>
                  </div>
                </CardHeader>
                <CardBody>
                  {loading ? (
                    <div className="text-center py-5">
                      <Spinner color="primary" />
                    </div>
                  ) : error ? (
                    <div className="text-danger py-4">{error}</div>
                  ) : (
                    <TableContainer
                      columns={columns}
                      data={Array.isArray(users) ? users : []}
                      isGlobalFilter
                      topFiltersOnRight
                      isGlobalSearch
                      hideHeaderFilters
                      customPageSize={10}
                    />
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>

        <Modal isOpen={modalOpen} toggle={handleCloseModal} centered>
          <ModalHeader toggle={handleCloseModal}>Send SMS</ModalHeader>
          <ModalBody>
            {sending ? (
              <div className="text-center py-4">
                <Spinner color="primary" />
                <p className="mb-0 mt-2 text-muted">Sending SMS...</p>
              </div>
            ) : (
              <>
                {selectedUser && (
                  <div className="mb-3">
                    <p className="mb-1 fw-semibold">{selectedUser.full_name || "Selected user"}</p>
                    <small className="text-muted">{selectedUser.mobile_number || selectedUser.email || "No contact info available"}</small>
                  </div>
                )}
                <FormGroup>
              <Label for="smsMessage">Message</Label>
                  <Input
                    id="smsMessage"
                    type="textarea"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your SMS message here"
                  />
                </FormGroup>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" outline onClick={handleCloseModal} disabled={sending}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleSendSMS} disabled={sending}>
              {sending ? "Sending..." : "Send SMS"}
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default SendSMS;
