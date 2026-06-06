import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardBody, CardHeader, Col, Row, Spinner } from 'reactstrap';
import CountUp from 'react-countup';
import FeatherIcon from 'feather-icons-react';
import { getDashboardMetrics } from '../../slices/dashboardMetrics/thunk';

const MetricCard = ({ title, value, icon, iconColor, trend, trendType = "success" }) => {
  const numValue = parseInt(value) || 0;
  return (
    <Card className="card-animate">
      <CardBody>
        <div className="d-flex align-items-center">
          <div className="avatar-sm flex-shrink-0">
            <span className={`avatar-title bg-${iconColor}-subtle text-${iconColor} rounded-2 fs-2`}>
              <FeatherIcon icon={icon} className={`text-${iconColor}`} />
            </span>
          </div>
          <div className="flex-grow-1 overflow-hidden ms-3">
            <p className="text-uppercase fw-medium text-muted text-truncate mb-3 fs-12">{title}</p>
            <h4 className="fs-4 flex-grow-1 mb-2">
              <span className="counter-value">
                {typeof value === "number" ? (
                  <CountUp start={0} end={value} duration={2} separator="," />
                ) : (
                  value
                )}
              </span>
            </h4>
            {trend && (
              <p className="text-muted text-truncate mb-0">
                <span className={`badge bg-${trendType}-subtle text-${trendType}`}>
                  <i className={`fs-12 align-middle me-1 ri-arrow-${trendType === "success" ? "up" : "down"}-line`}></i>
                  {trend}
                </span>
              </p>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

const DashboardMetrics = () => {
  const dispatch = useDispatch();
  const { metrics = null, loading = false, error = null } = useSelector(
    (state) => state.DashboardMetrics || {}
  );

  useEffect(() => {
    dispatch(getDashboardMetrics());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardBody>
          <div className="alert alert-danger" role="alert">
            Error loading dashboard metrics: {error}
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!metrics) {
    return null;
  }

  const { users, savings, loans, branches } = metrics;

  return (
    <React.Fragment>
      {/* Top Metrics Cards */}
      <Row className="mb-4">
        <Col lg={3} md={6} sm={12} className="mb-4">
          <MetricCard
            title="Total Active Users"
            value={users?.total_active || 0}
            icon="users"
            iconColor="primary"
            trend={`+${users?.new_this_month || 0} this month`}
          />
        </Col>

        <Col lg={3} md={6} sm={12} className="mb-4">
          <MetricCard
            title="Savings Accounts"
            value={savings?.total_active_accounts || 0}
            icon="save"
            iconColor="success"
            trend={`₵ ${(savings?.total_balance || 0).toLocaleString()}`}
          />
        </Col>

        <Col lg={3} md={6} sm={12} className="mb-4">
          <MetricCard
            title="Total Loans"
            value={loans?.summary?.total_loans || 0}
            icon="credit-card"
            iconColor="warning"
            trend={`${loans?.summary?.active || 0} active`}
          />
        </Col>

        <Col lg={3} md={6} sm={12} className="mb-4">
          <MetricCard
            title="Total Disbursed"
            value={`₵ ${(loans?.summary?.total_disbursed || 0).toLocaleString()}`}
            icon="trending-up"
            iconColor="info"
            trend={`Outstanding: ₵ ${(loans?.summary?.total_outstanding || 0).toLocaleString()}`}
          />
        </Col>
      </Row>

      {/* Loans by Status & Branches */}
      <Row className="mb-4">
        <Col xl={6} className="mb-4">
          <Card>
            <CardHeader className="border-0 align-items-center d-flex">
              <h4 className="card-title mb-0 flex-grow-1">Loans by Status</h4>
            </CardHeader>
            <CardHeader className="p-0 border-0 bg-light-subtle">
              <Row className="g-0 text-center">
                {loans?.by_status?.active && (
                  <Col xs={6} sm={4}>
                    <div className="p-3 border border-dashed border-start-0">
                      <h5 className="mb-1">
                        <span className="counter-value">
                          <CountUp start={0} end={loans.by_status.active.count} duration={2} />
                        </span>
                        <span className="text-success ms-1 fs-12">
                          <i className="ri-arrow-right-up-line ms-1 align-middle"></i>
                        </span>
                      </h5>
                      <p className="text-muted mb-0">Active Loans</p>
                    </div>
                  </Col>
                )}
                {loans?.by_status?.pending_approval && (
                  <Col xs={6} sm={4}>
                    <div className="p-3 border border-dashed border-start-0">
                      <h5 className="mb-1">
                        <span className="counter-value">
                          <CountUp start={0} end={loans.by_status.pending_approval.count} duration={2} />
                        </span>
                        <span className="text-warning ms-1 fs-12">
                          <i className="ri-alert-line ms-1 align-middle"></i>
                        </span>
                      </h5>
                      <p className="text-muted mb-0">Pending</p>
                    </div>
                  </Col>
                )}
                {loans?.by_status?.closed && (
                  <Col xs={6} sm={4}>
                    <div className="p-3 border border-dashed border-start-0 border-end-0">
                      <h5 className="mb-1">
                        <span className="counter-value">
                          <CountUp start={0} end={loans.by_status.closed.count} duration={2} />
                        </span>
                        <span className="text-secondary ms-1 fs-12">
                          <i className="ri-check-line ms-1 align-middle"></i>
                        </span>
                      </h5>
                      <p className="text-muted mb-0">Closed</p>
                    </div>
                  </Col>
                )}
              </Row>
            </CardHeader>
            <CardBody>
              <div className="table-responsive">
                <table className="table table-sm mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Status</th>
                      <th>Count</th>
                      <th>Disbursed</th>
                      <th>Outstanding</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loans?.by_status?.active && (
                      <tr>
                        <td><span className="badge bg-success-subtle text-success">Active</span></td>
                        <td>{loans.by_status.active.count}</td>
                        <td className="fw-semibold fs-12">₵ {loans.by_status.active.total_disbursed?.toLocaleString()}</td>
                        <td className="fw-semibold fs-12">₵ {loans.by_status.active.total_outstanding?.toLocaleString()}</td>
                      </tr>
                    )}
                    {loans?.by_status?.pending_approval && (
                      <tr>
                        <td><span className="badge bg-warning-subtle text-warning">Pending</span></td>
                        <td>{loans.by_status.pending_approval.count}</td>
                        <td className="fw-semibold fs-12">₵ {loans.by_status.pending_approval.total_disbursed?.toLocaleString()}</td>
                        <td className="fw-semibold fs-12">₵ {loans.by_status.pending_approval.total_outstanding?.toLocaleString()}</td>
                      </tr>
                    )}
                    {loans?.by_status?.closed && (
                      <tr>
                        <td><span className="badge bg-secondary-subtle text-secondary">Closed</span></td>
                        <td>{loans.by_status.closed.count}</td>
                        <td className="fw-semibold fs-12">₵ {loans.by_status.closed.total_disbursed?.toLocaleString()}</td>
                        <td className="fw-semibold fs-12">₵ {loans.by_status.closed.total_outstanding?.toLocaleString()}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col xl={6} className="mb-4">
          <Card>
            <CardHeader className="border-0 align-items-center d-flex">
              <h4 className="card-title mb-0 flex-grow-1">Branches Overview</h4>
            </CardHeader>
            <CardBody>
              <div className="table-responsive">
                <table className="table table-sm mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Branch Name</th>
                      <th>Users</th>
                      <th>Savings Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branches?.map((branch) => (
                      <tr key={branch.branch_id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-xs flex-shrink-0">
                              <span className="avatar-title bg-info-subtle text-info rounded-circle">
                                <FeatherIcon icon="map-pin" className="fs-12" />
                              </span>
                            </div>
                            <span className="ms-2 fw-medium">{branch.branch_name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-primary-subtle text-primary">{branch.user_count}</span>
                        </td>
                        <td className="fw-semibold fs-12">₵ {branch.savings_balance?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Contribution and Repayment Stats */}
      <Row>
        <Col lg={6} className="mb-4">
          <Card>
            <CardHeader className="border-0 align-items-center d-flex">
              <h4 className="card-title mb-0 flex-grow-1">Savings Contributions</h4>
              <FeatherIcon icon="trending-up" className="text-success fs-4" />
            </CardHeader>
            <CardHeader className="p-0 border-0 bg-light-subtle">
              <Row className="g-0 text-center">
                <Col xs={6}>
                  <div className="p-3 border border-dashed border-start-0">
                    <h5 className="mb-1">
                      <span className="counter-value">
                        <CountUp start={0} end={savings?.contributions?.all_time?.count || 0} duration={2} />
                      </span>
                    </h5>
                    <p className="text-muted mb-2">All Time Transactions</p>
                    <h5 className="text-success fw-semibold mb-0 fs-4">
                      ₵ <CountUp start={0} end={savings?.contributions?.all_time?.total_amount || 0} duration={2} separator="," />
                    </h5>
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="p-3 border border-dashed border-start-0 border-end-0">
                    <h5 className="mb-1">
                      <span className="counter-value">
                        <CountUp start={0} end={savings?.contributions?.this_month?.count || 0} duration={2} />
                      </span>
                    </h5>
                    <p className="text-muted mb-2">This Month</p>
                    <h5 className="text-success fw-semibold mb-0 fs-4">
                      ₵ <CountUp start={0} end={savings?.contributions?.this_month?.total_amount || 0} duration={2} separator="," />
                    </h5>
                  </div>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Avg. Contribution per Month</p>
                  <h4 className="ff-secondary fw-semibold mb-0 fs-3">
                    ₵ {savings?.contributions?.this_month?.total_amount ? Math.round(savings.contributions.this_month.total_amount / 12) : 0}
                  </h4>
                </div>
                <div className="avatar-md flex-shrink-0">
                  <span className="avatar-title bg-success-subtle rounded-circle">
                    <FeatherIcon icon="save" className="text-success fs-3" />
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          <Card>
            <CardHeader className="border-0 align-items-center d-flex">
              <h4 className="card-title mb-0 flex-grow-1">Loan Repayments</h4>
              <FeatherIcon icon="check-circle" className="text-info fs-4" />
            </CardHeader>
            <CardHeader className="p-0 border-0 bg-light-subtle">
              <Row className="g-0 text-center">
                <Col xs={6}>
                  <div className="p-3 border border-dashed border-start-0">
                    <h5 className="mb-1">
                      <span className="counter-value">
                        <CountUp start={0} end={loans?.repayments?.all_time?.count || 0} duration={2} />
                      </span>
                    </h5>
                    <p className="text-muted mb-2">All Time Payments</p>
                    <h5 className="text-info fw-semibold mb-0 fs-4">
                      ₵ <CountUp start={0} end={loans?.repayments?.all_time?.total_amount || 0} duration={2} separator="," />
                    </h5>
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="p-3 border border-dashed border-start-0 border-end-0">
                    <h5 className="mb-1">
                      <span className="counter-value">
                        <CountUp start={0} end={loans?.repayments?.this_month?.count || 0} duration={2} />
                      </span>
                    </h5>
                    <p className="text-muted mb-2">This Month</p>
                    <h5 className="text-info fw-semibold mb-0 fs-4">
                      ₵ <CountUp start={0} end={loans?.repayments?.this_month?.total_amount || 0} duration={2} separator="," />
                    </h5>
                  </div>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Repayment Rate</p>
                  <h4 className="ff-secondary fw-semibold mb-0 fs-3">
                    {loans?.summary?.total_outstanding && loans.summary.total_disbursed ? 
                      ((loans.summary.total_disbursed - loans.summary.total_outstanding) / loans.summary.total_disbursed * 100).toFixed(1) 
                      : 0}%
                  </h4>
                </div>
                <div className="avatar-md flex-shrink-0">
                  <span className="avatar-title bg-info-subtle rounded-circle">
                    <FeatherIcon icon="arrow-right" className="text-info fs-3" />
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default DashboardMetrics;
