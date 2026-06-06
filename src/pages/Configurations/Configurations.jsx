import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Button,
  Input,
  FormGroup,
  Label,
  Form,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { APIClient } from "../../helpers/api_helper";

const Configurations = () => {
  document.title = "Configurations";
  const [configuration, setConfiguration] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedConfig, setEditedConfig] = useState(null);
  const [updateError, setUpdateError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchConfiguration = async () => {
      setLoading(true);
      setError("");
      try {
        const api = new APIClient();
        const response = await api.get("/configurations");
        if (response?.code === "00" && response?.status === "success") {
          setConfiguration(response.data);
        } else {
          setError(response?.message || "Unable to load configuration.");
        }
      } catch (err) {
        setError(err?.message || "Unable to load configuration.");
      } finally {
        setLoading(false);
      }
    };

    fetchConfiguration();
  }, []);

  const handleEdit = () => {
    setEditedConfig({
      booklet_fee: configuration.booklet_fee ?? "",
      savings_cycle_days: configuration.savings_cycle_days ?? "",
      min_withdrawal_contributions: configuration.min_withdrawal_contributions ?? "",
      savings_frequencies: configuration.savings_frequencies?.join(", ") ?? "",
      loan_frequencies: configuration.loan_frequencies?.join(", ") ?? "",
      loan_penalty_rate: configuration.loan_penalty_rate ?? "",
      loan_arrears_rate: configuration.loan_arrears_rate ?? "",
      loan_grace_period_days: configuration.loan_grace_period_days ?? "",
      collateral_types: configuration.collateral_types?.join(", ") ?? "",
      guarantor_types: configuration.guarantor_types?.join(", ") ?? "",
      id_types: configuration.id_types?.join(", ") ?? "",
      marital_statuses: configuration.marital_statuses?.join(", ") ?? "",
      next_of_kin_relations: configuration.next_of_kin_relations?.join(", ") ?? "",
      sms_notifications_enabled: Boolean(configuration.sms_notifications_enabled),
    });
    setIsEditMode(true);
    setUpdateError("");
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setEditedConfig(null);
    setUpdateError("");
  };

  const formatListValue = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map((item) => item.trim()).filter(Boolean);
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const numericFields = [
      "booklet_fee",
      "savings_cycle_days",
      "min_withdrawal_contributions",
      "loan_penalty_rate",
      "loan_arrears_rate",
      "loan_grace_period_days",
    ];

    setEditedConfig((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : numericFields.includes(name) ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setUpdateError("");

    const requiredFields = [
      "booklet_fee",
      "savings_cycle_days",
      "min_withdrawal_contributions",
      "loan_penalty_rate",
      "loan_arrears_rate",
      "loan_grace_period_days",
      "savings_frequencies",
      "loan_frequencies",
      "collateral_types",
      "guarantor_types",
      "id_types",
      "marital_statuses",
      "next_of_kin_relations",
    ];

    const hasMissingField = requiredFields.some((field) => {
      const value = editedConfig[field];
      return value === "" || value === null || value === undefined || (typeof value === "string" && value.trim() === "");
    });

    if (hasMissingField) {
      setUpdateError("Please complete all required fields.");
      return;
    }

    const payload = {
      booklet_fee: editedConfig.booklet_fee,
      savings_cycle_days: editedConfig.savings_cycle_days,
      min_withdrawal_contributions: editedConfig.min_withdrawal_contributions,
      savings_frequencies: String(editedConfig.savings_frequencies || "").trim(),
      loan_frequencies: String(editedConfig.loan_frequencies || "").trim(),
      loan_penalty_rate: editedConfig.loan_penalty_rate,
      loan_arrears_rate: editedConfig.loan_arrears_rate,
      loan_grace_period_days: editedConfig.loan_grace_period_days,
      collateral_types: String(editedConfig.collateral_types || "").trim(),
      guarantor_types: String(editedConfig.guarantor_types || "").trim(),
      id_types: String(editedConfig.id_types || "").trim(),
      marital_statuses: String(editedConfig.marital_statuses || "").trim(),
      next_of_kin_relations: String(editedConfig.next_of_kin_relations || "").trim(),
      sms_notifications_enabled: editedConfig.sms_notifications_enabled,
    };

    setIsSaving(true);
    try {
      const api = new APIClient();
      const response = await api.put("/configurations", payload);
      if (response?.code === "00" && response?.status === "success") {
        setConfiguration(response.data);
        setIsEditMode(false);
        setEditedConfig(null);
      } else {
        setUpdateError(response?.message || "Unable to update configuration.");
      }
    } catch (err) {
      setUpdateError(err?.message || "Unable to update configuration.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Configurations" pageTitle="Pages" />
          <Row>
            <Col xs={12}>
              {error && <div className="alert alert-danger">{error}</div>}
              {loading && (
                <div className="text-center py-5">
                  <Spinner color="primary" />
                </div>
              )}
              {configuration && (
                <>
                  {/* Header with Edit Button */}
                  <Row className="mb-3">
                    <Col xs={12}>
                      {!isEditMode && (
                        <Button
                          color="primary"
                          onClick={handleEdit}
                          className="float-end"
                        >
                          <i className="mdi mdi-pencil-outline"></i> Edit
                        </Button>
                      )}
                    </Col>
                  </Row>

                  {isEditMode && (
                    <Modal centered size="lg" isOpen={isEditMode} toggle={handleCancel}>
                      <ModalHeader toggle={handleCancel}>Edit Configuration</ModalHeader>
                      <ModalBody>
                        <Form onSubmit={handleSave}>
                          {updateError && (
                            <div className="alert alert-danger mb-3">{updateError}</div>
                          )}
                          <FormGroup className="mb-3">
                            <Label for="booklet_fee">
                              Booklet Fee <span className="text-danger">*</span>
                            </Label>
                            <Input
                              id="booklet_fee"
                              name="booklet_fee"
                              type="number"
                              step="0.01"
                              value={editedConfig.booklet_fee}
                              onChange={handleChange}
                              placeholder="Enter booklet fee"
                            />
                          </FormGroup>
                          <FormGroup className="mb-3">
                            <Label for="savings_cycle_days">
                              Savings Cycle Days <span className="text-danger">*</span>
                            </Label>
                            <Input
                              id="savings_cycle_days"
                              name="savings_cycle_days"
                              type="number"
                              value={editedConfig.savings_cycle_days}
                              onChange={handleChange}
                              placeholder="Enter savings cycle days"
                            />
                          </FormGroup>
                          <FormGroup className="mb-3">
                            <Label for="min_withdrawal_contributions">
                              Minimum Withdrawal Contributions <span className="text-danger">*</span>
                            </Label>
                            <Input
                              id="min_withdrawal_contributions"
                              name="min_withdrawal_contributions"
                              type="number"
                              value={editedConfig.min_withdrawal_contributions}
                              onChange={handleChange}
                              placeholder="Enter minimum withdrawal contributions"
                            />
                          </FormGroup>
                          <FormGroup className="mb-3">
                            <Label for="savings_frequencies">
                              Savings Frequencies <span className="text-danger">*</span>
                            </Label>
                            <Input
                              id="savings_frequencies"
                              name="savings_frequencies"
                              type="text"
                              value={editedConfig.savings_frequencies}
                              onChange={handleChange}
                              placeholder="Enter comma-separated savings frequencies"
                            />
                          </FormGroup>
                          <FormGroup className="mb-3">
                            <Label for="loan_frequencies">
                              Loan Frequencies <span className="text-danger">*</span>
                            </Label>
                            <Input
                              id="loan_frequencies"
                              name="loan_frequencies"
                              type="text"
                              value={editedConfig.loan_frequencies}
                              onChange={handleChange}
                              placeholder="Enter comma-separated loan frequencies"
                            />
                          </FormGroup>
                          <FormGroup className="mb-3">
                            <Label for="loan_penalty_rate">
                              Loan Penalty Rate <span className="text-danger">*</span>
                            </Label>
                            <Input
                              id="loan_penalty_rate"
                              name="loan_penalty_rate"
                              type="number"
                              step="0.01"
                              min="0"
                              value={editedConfig.loan_penalty_rate}
                              onChange={handleChange}
                              placeholder="Enter loan penalty rate"
                            />
                          </FormGroup>
                          <FormGroup className="mb-3">
                            <Label for="loan_arrears_rate">
                              Loan Arrears Rate <span className="text-danger">*</span>
                            </Label>
                            <Input
                              id="loan_arrears_rate"
                              name="loan_arrears_rate"
                              type="number"
                              step="0.01"
                              min="0"
                              value={editedConfig.loan_arrears_rate}
                              onChange={handleChange}
                              placeholder="Enter loan arrears rate"
                            />
                          </FormGroup>
                          <FormGroup className="mb-3">
                            <Label for="loan_grace_period_days">
                              Loan Grace Period Days <span className="text-danger">*</span>
                            </Label>
                            <Input
                              id="loan_grace_period_days"
                              name="loan_grace_period_days"
                              type="number"
                              min="0"
                              value={editedConfig.loan_grace_period_days}
                              onChange={handleChange}
                              placeholder="Enter loan grace period days"
                            />
                          </FormGroup>
                          <FormGroup className="mb-3">
                            <Label for="collateral_types">
                              Collateral Types <span className="text-danger">*</span>
                            </Label>
                            <Input
                              id="collateral_types"
                              name="collateral_types"
                              type="text"
                              value={editedConfig.collateral_types}
                              onChange={handleChange}
                              placeholder="Enter comma-separated collateral types"
                            />
                          </FormGroup>
                          <FormGroup className="mb-3">
                            <Label for="guarantor_types">
                              Guarantor Types <span className="text-danger">*</span>
                            </Label>
                            <Input
                              id="guarantor_types"
                              name="guarantor_types"
                              type="text"
                              value={editedConfig.guarantor_types}
                              onChange={handleChange}
                              placeholder="Enter comma-separated guarantor types"
                            />
                          </FormGroup>
                          <FormGroup className="mb-3">
                            <Label for="id_types">
                              ID Types <span className="text-danger">*</span>
                            </Label>
                            <Input
                              id="id_types"
                              name="id_types"
                              type="text"
                              value={editedConfig.id_types}
                              onChange={handleChange}
                              placeholder="Enter comma-separated ID types"
                            />
                          </FormGroup>
                          <FormGroup className="mb-3">
                            <Label for="marital_statuses">
                              Marital Statuses <span className="text-danger">*</span>
                            </Label>
                            <Input
                              id="marital_statuses"
                              name="marital_statuses"
                              type="text"
                              value={editedConfig.marital_statuses}
                              onChange={handleChange}
                              placeholder="Enter comma-separated marital statuses"
                            />
                          </FormGroup>
                          <FormGroup className="mb-3">
                            <Label for="next_of_kin_relations">
                              Next of Kin Relations <span className="text-danger">*</span>
                            </Label>
                            <Input
                              id="next_of_kin_relations"
                              name="next_of_kin_relations"
                              type="text"
                              value={editedConfig.next_of_kin_relations}
                              onChange={handleChange}
                              placeholder="Enter comma-separated kin relations"
                            />
                          </FormGroup>
                          <FormGroup check className="mb-3">
                            <div className="form-check form-switch">
                              <Input
                                id="sms_notifications_enabled"
                                name="sms_notifications_enabled"
                                type="checkbox"
                                className="form-check-input"
                                checked={editedConfig.sms_notifications_enabled}
                                onChange={handleChange}
                              />
                              <Label for="sms_notifications_enabled" className="form-check-label">
                                Enable SMS Notifications
                              </Label>
                            </div>
                          </FormGroup>
                          <ModalFooter className="px-0 border-0">
                            <Button color="secondary" onClick={handleCancel} type="button">
                              Cancel
                            </Button>
                            <Button color="primary" type="submit" disabled={isSaving}>
                              {isSaving ? "Saving..." : "Save Changes"}
                            </Button>
                          </ModalFooter>
                        </Form>
                      </ModalBody>
                    </Modal>
                  )}
                  {!isEditMode && (
                    /* View Mode */
                    <Row>
                      {/* Basic Settings */}
                      <Col lg={6}>
                        <Card className="h-100 border-0 shadow-sm">
                          <CardHeader className="bg-light border-bottom-0">
                            <div className="d-flex align-items-center justify-content-between">
                              <div>
                                <h5 className="card-title mb-1">Basic Settings</h5>
                                <p className="text-muted mb-0 small">Core loan and savings configuration</p>
                              </div>
                              <Button color="outline-primary" size="sm" onClick={handleEdit}>
                                <i className="mdi mdi-pencil-outline me-1"></i> Edit
                              </Button>
                            </div>
                          </CardHeader>
                          <CardBody>
                            <Form className="row g-3">
                              <FormGroup className="col-md-6 mb-0">
                                <Label className="form-label fw-semibold">Booklet Fee</Label>
                                <Input type="text" value={`₵${configuration.booklet_fee ?? 0}`} readOnly className="bg-light" />
                              </FormGroup>
                              <FormGroup className="col-md-6 mb-0">
                                <Label className="form-label fw-semibold">Savings Cycle</Label>
                                <Input type="text" value={`${configuration.savings_cycle_days ?? 0} days`} readOnly className="bg-light" />
                              </FormGroup>
                              <FormGroup className="col-md-6 mb-0">
                                <Label className="form-label fw-semibold">Min Withdrawal</Label>
                                <Input type="text" value={`${configuration.min_withdrawal_contributions ?? 0}%`} readOnly className="bg-light" />
                              </FormGroup>
                              <FormGroup className="col-md-6 mb-0">
                                <Label className="form-label fw-semibold">Penalty Rate</Label>
                                <Input type="text" value={`${configuration.loan_penalty_rate ?? 0}%`} readOnly className="bg-light" />
                              </FormGroup>
                              <FormGroup className="col-md-6 mb-0">
                                <Label className="form-label fw-semibold">Arrears Rate</Label>
                                <Input type="text" value={`${configuration.loan_arrears_rate ?? 0}%`} readOnly className="bg-light" />
                              </FormGroup>
                              <FormGroup className="col-md-6 mb-0">
                                <Label className="form-label fw-semibold">Grace Period</Label>
                                <Input type="text" value={`${configuration.loan_grace_period_days ?? 0} days`} readOnly className="bg-light" />
                              </FormGroup>
                              <FormGroup className="col-md-6 mb-0">
                                <Label className="form-label fw-semibold">SMS Notifications</Label>
                                <Input type="text" value={configuration.sms_notifications_enabled ? "Enabled" : "Disabled"} readOnly className="bg-light" />
                              </FormGroup>
                              <FormGroup className="col-md-6 mb-0">
                                <Label className="form-label fw-semibold">Last Updated</Label>
                                <Input type="text" value={configuration.updated_at ? new Date(configuration.updated_at).toLocaleString() : "-"} readOnly className="bg-light" />
                              </FormGroup>
                            </Form>
                          </CardBody>
                        </Card>
                      </Col>

                      {/* Savings Frequencies */}
                      <Col lg={6}>
                        <Card>
                          <CardHeader>
                            <h5 className="card-title mb-0">Savings Frequencies</h5>
                          </CardHeader>
                          <CardBody>
                            <div className="d-flex flex-wrap gap-2">
                              {configuration.savings_frequencies.map((frequency, index) => (
                                <Badge key={index} color="primary" className="fs-12">
                                  {frequency}
                                </Badge>
                              ))}
                            </div>
                          </CardBody>
                        </Card>
                      </Col>

                      {/* Loan Frequencies */}
                      <Col lg={6}>
                        <Card>
                          <CardHeader>
                            <h5 className="card-title mb-0">Loan Frequencies</h5>
                          </CardHeader>
                          <CardBody>
                            <div className="d-flex flex-wrap gap-2">
                              {configuration.loan_frequencies?.map((frequency, index) => (
                                <Badge key={index} color="secondary" className="fs-12">
                                  {frequency}
                                </Badge>
                              ))}
                            </div>
                          </CardBody>
                        </Card>
                      </Col>

                      {/* Collateral Types */}
                      <Col lg={6}>
                        <Card>
                          <CardHeader>
                            <h5 className="card-title mb-0">Collateral Types</h5>
                          </CardHeader>
                          <CardBody>
                            <div className="d-flex flex-wrap gap-2">
                              {configuration.collateral_types?.map((type, index) => (
                                <Badge key={index} color="success" className="fs-12">
                                  {type}
                                </Badge>
                              ))}
                            </div>
                          </CardBody>
                        </Card>
                      </Col>

                      {/* Guarantor Types */}
                      <Col lg={6}>
                        <Card>
                          <CardHeader>
                            <h5 className="card-title mb-0">Guarantor Types</h5>
                          </CardHeader>
                          <CardBody>
                            <div className="d-flex flex-wrap gap-2">
                              {configuration.guarantor_types?.map((type, index) => (
                                <Badge key={index} color="danger" className="fs-12">
                                  {type}
                                </Badge>
                              ))}
                            </div>
                          </CardBody>
                        </Card>
                      </Col>

                      {/* ID Types */}
                      <Col lg={6}>
                        <Card>
                          <CardHeader>
                            <h5 className="card-title mb-0">ID Types</h5>
                          </CardHeader>
                          <CardBody>
                            <div className="d-flex flex-wrap gap-2">
                              {configuration.id_types?.map((idType, index) => (
                                <Badge key={index} color="success" className="fs-12">
                                  {idType}
                                </Badge>
                              ))}
                            </div>
                          </CardBody>
                        </Card>
                      </Col>

                      {/* Marital Statuses */}
                      <Col lg={6}>
                        <Card>
                          <CardHeader>
                            <h5 className="card-title mb-0">Marital Statuses</h5>
                          </CardHeader>
                          <CardBody>
                            <div className="d-flex flex-wrap gap-2">
                              {configuration.marital_statuses.map((status, index) => (
                                <Badge key={index} color="info" className="fs-12">
                                  {status}
                                </Badge>
                              ))}
                            </div>
                          </CardBody>
                        </Card>
                      </Col>

                      {/* Next of Kin Relations */}
                      <Col lg={12}>
                        <Card>
                          <CardHeader>
                            <h5 className="card-title mb-0">Next of Kin Relations</h5>
                          </CardHeader>
                          <CardBody>
                            <div className="d-flex flex-wrap gap-2">
                              {configuration.next_of_kin_relations.map((relation, index) => (
                                <Badge key={index} color="warning" className="fs-12">
                                  {relation}
                                </Badge>
                              ))}
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  )}
                </>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Configurations;