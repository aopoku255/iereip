import React from 'react';
import Flatpickr from "react-flatpickr";
import { Col } from 'reactstrap';

const UpcomingSchedules = () => {
    return (
        <React.Fragment>
            <Col xl={5}>
                <div className="card card-height-100">
                    <div className="card-header border-0">
                        <h4 className="card-title mb-0">Calendar</h4>
                    </div>
                    <div className="card-body pt-0">
                        <div className="upcoming-scheduled">
                            <Flatpickr
                                className="form-control"
                                options={{
                                    dateFormat: "d M, Y",
                                    inline: true
                                }}
                            />
                        </div>
                    </div>
                </div>
            </Col>
        </React.Fragment>
    );
};

export default UpcomingSchedules;