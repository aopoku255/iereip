import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Col, Container, Input, Label, Row, Button, Form, FormFeedback, Alert, Spinner } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { createSelector } from 'reselect';
import AuthSlider from '../authCarousel';
import withRouter from '../../../Components/Common/withRouter';
import { loginUser, resetLoginFlag } from '../../../slices/thunks';
import logoLight from '../../../assets/images/logo-light.png';

const CoverSignIn = (props) => {
    const dispatch = useDispatch();
    const selectLayoutState = (state) => state;
    const loginpageData = createSelector(
        selectLayoutState,
        (state) => ({
            user: state.Account.user,
            error: state.Login.error,
            loading: state.Login.loading,
            errorMsg: state.Login.errorMsg,
        })
    );
    const { user, error, loading, errorMsg } = useSelector(loginpageData);

    const [userLogin, setUserLogin] = useState([]);
    const [passwordShow, setPasswordShow] = useState(false);

    useEffect(() => {
        if (user) {
            const updatedUserData = import.meta.env.VITE_DEFAULTAUTH === 'firebase'
                ? user.multiFactor.user.email
                : user?.user?.email || user?.email || user?.admin?.email || '';
            const updatedUserPassword = import.meta.env.VITE_DEFAULTAUTH === 'firebase'
                ? ''
                : user?.user?.confirm_password || '';
            setUserLogin({
                email: updatedUserData,
                password: updatedUserPassword,
            });
        }
    }, [user]);

    const navigate = props?.router?.navigate || props?.navigate;

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            email: userLogin.email || '' || '',
            password: userLogin.password || '' || '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Please enter a valid email').required('Please Enter Your Email'),
            password: Yup.string().required('Please Enter Your Password'),
        }),
        onSubmit: (values) => {
            dispatch(loginUser(values, navigate));
        },
    });

    useEffect(() => {
        if (errorMsg) {
            setTimeout(() => {
                dispatch(resetLoginFlag());
            }, 3000);
        }
    }, [dispatch, errorMsg]);

    document.title = 'Sign In | IEREIP Enterprice';
    return (
        <React.Fragment>
            <div className="auth-page-wrapper py-5 d-flex justify-content-center align-items-center min-vh-100" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 48%, #f8fbff 100%)' }}>
                <div className="bg-overlay" style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.18), rgba(59, 130, 246, 0.08))' }}></div>

                <div className="auth-page-content overflow-hidden pt-lg-5">
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <Card className="overflow-hidden border-0 shadow-xxl rounded-4" style={{ background: '#ffffff', boxShadow: '0 24px 60px rgba(15, 23, 42, 0.12)' }}>
                                    <Row className="g-0">
                                        <AuthSlider />

                                        <Col lg={6}>
                                            <div className="p-lg-5 p-4 h-100 d-flex flex-column justify-content-center">
                                                <div className="mb-4">
                                                    {/* <div className="d-flex align-items-center gap-2 mb-3">
                                                        <img src={logoLight} alt="IEREIP logo" height="34" />
                                                        <span className="fw-semibold text-dark">IEREIP Enterprise</span>
                                                    </div> */}
                                                    {/* <span className="badge rounded-pill bg-success-subtle text-success px-3 py-2 mb-3">Secure sign-in</span> */}
                                                    <h3 className="fw-semibold mb-2">Welcome back</h3>
                                                    <p className="text-muted mb-0">Sign in to continue to your finance, loan, and operations workspace.</p>
                                                </div>

                                                <div className="mt-4">
                                                    <Form onSubmit={validation.handleSubmit} action="#">
                                                        {error && error ? <Alert color="danger">{error}</Alert> : null}

                                                        <div className="mb-3">
                                                            <Label htmlFor="email" className="form-label">Email</Label>
                                                            <Input
                                                                name="email"
                                                                className="form-control"
                                                                placeholder="Enter email"
                                                                type="email"
                                                                onChange={validation.handleChange}
                                                                onBlur={validation.handleBlur}
                                                                value={validation.values.email || ''}
                                                                invalid={validation.touched.email && validation.errors.email ? true : false}
                                                            />
                                                            {validation.touched.email && validation.errors.email ? (
                                                                <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                                                            ) : null}
                                                        </div>

                                                        <div className="mb-3">
                                                            <Label className="form-label" htmlFor="password-input">Password</Label>
                                                            <div className="position-relative auth-pass-inputgroup mb-3">
                                                                <Input
                                                                    name="password"
                                                                    value={validation.values.password || ''}
                                                                    type={passwordShow ? 'text' : 'password'}
                                                                    className="form-control pe-5"
                                                                    placeholder="Enter Password"
                                                                    onChange={validation.handleChange}
                                                                    onBlur={validation.handleBlur}
                                                                    invalid={validation.touched.password && validation.errors.password ? true : false}
                                                                />
                                                                {validation.touched.password && validation.errors.password ? (
                                                                    <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                                                                ) : null}
                                                                <button
                                                                    className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                                                                    onClick={() => setPasswordShow(!passwordShow)}
                                                                    type="button"
                                                                    id="password-addon"
                                                                >
                                                                    <i className="ri-eye-fill align-middle"></i>
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="mb-4">
                                                            <div className="form-check">
                                                                <Input className="form-check-input" type="checkbox" value="" id="auth-remember-check" />
                                                                <Label className="form-check-label" htmlFor="auth-remember-check">Remember me</Label>
                                                            </div>
                                                        </div>

                                                        <div className="mt-4">
                                                            <Button color="success" disabled={loading} className="w-100 py-2 fw-semibold rounded-3 shadow-sm" type="submit">
                                                                {loading ? <Spinner size="sm" className="me-2">Loading...</Spinner> : null}
                                                                Sign In
                                                            </Button>
                                                        </div>

                                                        {/* <div className="mt-4 pt-3 border-top text-muted small">
                                                            <div className="d-flex flex-wrap gap-2 justify-content-center">
                                                                <span className="badge rounded-pill bg-light text-muted">Fast access</span>
                                                                <span className="badge rounded-pill bg-light text-muted">Secure sessions</span>
                                                                <span className="badge rounded-pill bg-light text-muted">Role-based access</span>
                                                            </div>
                                                        </div> */}
                                                    </Form>
                                                </div>

                                            </div>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>

                <footer className="footer">
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <div className="text-center">
                                    <p className="mb-0">&copy; {new Date().getFullYear()} IEREIP. Design & Develop by <a href="https://deducesolutions.com" target="_blank" rel="noopener noreferrer">DeduceInc</a></p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </footer>

            </div>
        </React.Fragment>
    );
};

export default withRouter(CoverSignIn);