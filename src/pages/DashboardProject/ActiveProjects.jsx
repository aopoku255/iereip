import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { getApprovedLoanApplications } from '../../slices/loans/thunk';

const ActiveProjects = () => {
    const dispatch = useDispatch();
    const { approvedLoans, approvedLoansLoading } = useSelector(state => state.Loans || {});

    useEffect(() => {
        dispatch(getApprovedLoanApplications());
    }, [dispatch]);

    const activeLoansList = (approvedLoans || []).slice(0, 5);

    return (
        <React.Fragment>
            <Col xl={7}>
                <Card className="card-height-100">
                    <CardHeader className="d-flex align-items-center">
                        <h4 className="card-title flex-grow-1 mb-0">Active Loans</h4>
                        <div className="flex-shrink-0">
                            <Link to="/apps/invoices-list" className="btn btn-soft-secondary btn-sm">View All</Link>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div className="table-responsive table-card">
                            <table className="table table-nowrap table-centered align-middle">
                                <thead className="bg-light text-muted">
                                    <tr>
                                        <th scope="col">Loan ID</th>
                                        <th scope="col">Borrower</th>
                                        <th scope="col">Amount Disbursed</th>
                                        <th scope="col">Outstanding</th>
                                        <th scope="col">Status</th>
                                        <th scope="col" style={{ width: "10%" }}>Progress</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {approvedLoansLoading ? (
                                        <tr>
                                            <td colSpan="6" className="text-center text-muted py-4">
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : activeLoansList.length > 0 ? (
                                        activeLoansList.map((loan, index) => (
                                            <tr key={loan.id || index}>
                                                <td className="fw-medium">{loan.loan_id || "LN-" + Math.floor(Math.random() * 10000)}</td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="avatar-xs me-2 flex-shrink-0">
                                                            <span className="avatar-title bg-success-subtle rounded-circle">
                                                                {loan.user?.full_name?.charAt(0) || "B"}
                                                            </span>
                                                        </div>
                                                        <span>{loan.user?.full_name || "Unknown"}</span>
                                                    </div>
                                                </td>
                                                <td className="fw-semibold">₵ {(loan.loan_capital || 0).toLocaleString()}</td>
                                                <td>
                                                    <span className="text-danger fw-semibold">₵ {(loan.outstanding_balance || 0).toLocaleString()}</span>
                                                </td>
                                                <td><span className="badge bg-success-subtle text-success">{loan.status || "Active"}</span></td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="flex-shrink-0 me-1">
                                                            <Link to={`/apps/loans/${loan.id}`} className="text-reset fw-medium">
                                                                View
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center text-muted py-4">
                                                No active loans found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="align-items-center mt-xl-3 mt-4 justify-content-between d-flex">
                            <div className="flex-shrink-0">
                                <div className="text-muted">Total Active Loans: <span className="fw-semibold">{approvedLoans?.length || 0}</span>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default ActiveProjects;