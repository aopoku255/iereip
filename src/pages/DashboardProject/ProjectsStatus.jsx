import React, { useEffect } from 'react';
import { Card, CardBody, CardHeader, Col } from 'reactstrap';
import { useSelector, useDispatch } from "react-redux";
import { getDashboardMetrics } from '../../slices/dashboardMetrics/thunk';
import { LoansStatusChart } from './DashboardProjectCharts';

const ProjectsStatus = () => {
    const dispatch = useDispatch();
    const { metrics = null } = useSelector((state) => state.DashboardMetrics || {});

    useEffect(() => {
        if (!metrics) {
            dispatch(getDashboardMetrics());
        }
    }, [dispatch, metrics]);

    const loansData = metrics?.loans?.by_status ? [
        metrics.loans.by_status.active?.count || 0,
        metrics.loans.by_status.pending_approval?.count || 0,
        metrics.loans.by_status.closed?.count || 0
    ] : [0, 0, 0];

    const totalLoans = loansData.reduce((a, b) => a + b, 0);

    return (
        <React.Fragment>
            <Card className="card-height-100">
                    <CardHeader className="align-items-center d-flex">
                        <h4 className="card-title mb-0 flex-grow-1">Loans by Status</h4>
                    </CardHeader>

                    <CardBody>
                        <div id="loans-status" className="apex-charts" dir="ltr">
                            <LoansStatusChart 
                                series={loansData} 
                                dataColors='["--vz-success", "--vz-warning", "--vz-secondary"]' 
                            />
                        </div>
                        <div className="mt-3">
                            <div className="d-flex justify-content-center align-items-center mb-4">
                                <h2 className="me-3 ff-secondary mb-0">{totalLoans}</h2>
                                <div>
                                    <p className="text-muted mb-0">Total Loans</p>
                                    <p className="text-success fw-medium mb-0">
                                        <span className="badge bg-success-subtle text-success p-1 rounded-circle"><i className="ri-arrow-right-up-line"></i></span> {metrics?.loans?.summary?.active || 0} Active
                                    </p>
                                </div>
                            </div>

                            <div className="d-flex justify-content-between border-bottom border-bottom-dashed py-2">
                                <p className="fw-medium mb-0"><i className="ri-checkbox-blank-circle-fill text-success align-middle me-2"></i> Active Loans</p>
                                <div>
                                    <span className="text-muted pe-3">{metrics?.loans?.by_status?.active?.count || 0} Loans</span>
                                    <span className="text-success fw-medium fs-13">₵ {metrics?.loans?.by_status?.active?.total_disbursed?.toLocaleString() || 0}</span>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between border-bottom border-bottom-dashed py-2">
                                <p className="fw-medium mb-0"><i className="ri-checkbox-blank-circle-fill text-warning align-middle me-2"></i> Pending Approval</p>
                                <div>
                                    <span className="text-muted pe-3">{metrics?.loans?.by_status?.pending_approval?.count || 0} Loans</span>
                                    <span className="text-success fw-medium fs-13">₵ {metrics?.loans?.by_status?.pending_approval?.total_disbursed?.toLocaleString() || 0}</span>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between py-2">
                                <p className="fw-medium mb-0"><i className="ri-checkbox-blank-circle-fill text-secondary align-middle me-2"></i> Closed Loans</p>
                                <div>
                                    <span className="text-muted pe-3">{metrics?.loans?.by_status?.closed?.count || 0} Loans</span>
                                    <span className="text-success fw-medium fs-13">₵ {metrics?.loans?.by_status?.closed?.total_disbursed?.toLocaleString() || 0}</span>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
        </React.Fragment>
    );
};

export default ProjectsStatus;