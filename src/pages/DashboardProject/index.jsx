import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import ActiveProjects from './ActiveProjects';
import ProjectsStatus from './ProjectsStatus';
import TeamMembers from './TeamMembers';
import UpcomingSchedules from './UpcomingSchedules';
import Widgets from './Widgets';
import DashboardMetrics from './DashboardMetrics';

const DashboardProject = () => {
    document.title="Dashboard | IEREIP Enterprice";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Dashboard" pageTitle="Dashboards" />
                    {/* Dashboard Metrics Overview */}
                    <div className="mb-4">
                        <DashboardMetrics />
                    </div>
                    <Row className="project-wrapper">
                        <Col xxl={8}>
                            <Widgets />
                        </Col>
                    </Row>
                    <Row>
                        <ActiveProjects />
                        <UpcomingSchedules />
                    </Row>
                    <Row>
                        <Col xxl={6}>
                            <TeamMembers />
                        </Col>
                        <Col xxl={6}>
                            <ProjectsStatus />
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default DashboardProject;