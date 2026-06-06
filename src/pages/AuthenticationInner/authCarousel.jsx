import React from "react";
import { Col } from "reactstrap";
import { Link } from "react-router-dom";

// Import Images
import logoLight from "../../assets/images/logo-light.png";
import authOneBg from "../../assets/images/loginbg.png";

const AuthSlider = () => {
    return (
        <React.Fragment>

            <Col lg={6}>
                <div
                    className="p-lg-5 p-4 h-100 position-relative overflow-hidden rounded-4"
                    style={{
                        backgroundImage: `url(${authOneBg})`,
                        backgroundPosition: 'left',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        minHeight: '520px',
                        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
                    }}
                >
                    <div className="bg-overlay" style={{ background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.82), rgba(15, 23, 42, 0.45))' }}></div>
                    <div className="position-relative h-100 d-flex flex-column justify-content-between">
                        <div>
                            <Link to="/dashboard" className="d-inline-flex align-items-center gap-2 text-decoration-none text-white-50">
                                <img src={logoLight} alt="IEREIP logo" height="32" />
                                {/* <span className="fw-semibold text-white">IEREIP</span> */}
                            </Link>
                           
                        </div>

                        
                    </div>
                </div>
            </Col>
        </React.Fragment >
    );
};

export default AuthSlider;