import React from "react";
import { Row, Col } from "reactstrap";

const LoanRepayment = ({ repayments }) => {
  const items = Array.isArray(repayments) ? repayments : [];
  const totalRepaid = items.reduce((s, r) => s + (Number(r.amount) || 0), 0);

  return (
    <div>
      <h5 className="mb-3">Repayment</h5>
      <Row>
        <Col lg={4} className="mb-3">
          <div className="border rounded p-3">
            <div className="text-muted small">Total Repaid</div>
            <div className="fs-5 fw-semibold">₵{totalRepaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
        </Col>
        <Col lg={8} className="mb-3">
          <div className="border rounded p-3">
            <div className="text-muted small mb-2">Repayment History</div>
            {items.length ? (
              <ul className="ps-3 mb-0">
                {items.map((r, idx) => (
                  <li key={idx} className="mb-2">
                    <div><strong>₵{(Number(r.amount)||0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> — {r.date || r.created_at || "-"}</div>
                    <div className="text-muted small">{r.method || r.note || ""}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-muted">No repayments recorded.</div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default LoanRepayment;
