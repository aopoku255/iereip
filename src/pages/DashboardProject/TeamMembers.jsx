import React, { useEffect } from 'react';
import { Card, CardHeader, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { getStaff } from '../../slices/allStaff/thunk';

const TeamMembers = () => {
    const dispatch = useDispatch();
    const { users = [], loading } = useSelector(state => state.Staff || {});

    useEffect(() => {
        if (!users || users.length === 0) {
            dispatch(getStaff());
        }
    }, [dispatch, users]);

    const staffList = (users || []).slice(0, 5);

    return (
        <React.Fragment>
            <Card className='card-height-100'>
                    <CardHeader className="align-items-center d-flex">
                        <h4 className="card-title mb-0 flex-grow-1">Staff Members</h4>
                        <div className="flex-shrink-0">
                            <UncontrolledDropdown className="card-header-dropdown">
                                <DropdownToggle tag="a" className="text-reset dropdown-btn" role="button">
                                    <span className="fw-semibold text-uppercase fs-12">Sort by: </span><span className="text-muted">Recent<i className="mdi mdi-chevron-down ms-1"></i></span>
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu dropdown-menu-end">
                                    <DropdownItem>Recent</DropdownItem>
                                    <DropdownItem>Active</DropdownItem>
                                    <DropdownItem>Inactive</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div className="table-responsive table-card">
                            <table className="table table-borderless table-nowrap align-middle mb-0">
                                <thead className="table-light text-muted">
                                    <tr>
                                        <th scope="col">Staff Name</th>
                                        <th scope="col">Position</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="4" className="text-center text-muted py-4">
                                                Loading staff members...
                                            </td>
                                        </tr>
                                    ) : staffList.length > 0 ? (
                                        staffList.map((item, key) => (
                                            <tr key={key}>
                                                <td className="d-flex">
                                                    <div className="avatar-xs me-2 flex-shrink-0">
                                                        <span className="avatar-title bg-primary-subtle rounded-circle">
                                                            {item?.name?.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h5 className="fs-13 mb-0">{item?.name || 'N/A'}</h5>
                                                        <p className="fs-12 mb-0 text-muted">{item?.email || 'N/A'}</p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="text-muted">{item?.role || 'Staff'}</span>
                                                </td>
                                                <td>
                                                    <span className="text-muted fs-12">{item?.department || 'N/A'}</span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${item?.status === 'ACTIVE' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                                                        {item?.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center text-muted py-4">
                                                No staff members found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>
        </React.Fragment>
    );
};

export default TeamMembers;