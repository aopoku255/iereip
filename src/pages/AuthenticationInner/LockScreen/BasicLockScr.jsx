import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, Col, Container, Row, Alert } from 'reactstrap';
import ParticlesAuth from "../ParticlesAuth";
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../../slices/auth/login/thunk';
import useLockScreen from '../../../Components/Hooks/useLockScreen';

//import images
import logoLight from "../../../assets/images/logo-light.png";
import avatar1 from "../../../assets/images/users/avatar-1.jpg";


const BasicLockScreen = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { unlockScreen } = useLockScreen();
    const { userProfile } = useSelector(state => state.Login);

    document.title="Lock Screen | IEREIP Enterprice";

    const handleUnlock = async (e) => {
        e.preventDefault();
        if (!password.trim()) {
            setError('Please enter your password');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Get stored user credentials
            const storedUser = JSON.parse(sessionStorage.getItem('authUser'));
            if (!storedUser) {
                setError('Session expired. Please login again.');
                navigate('/login');
                return;
            }

            // Attempt login with stored email and entered password
            await dispatch(loginUser({
                email: storedUser.admin?.email || storedUser.email,
                password: password
            }, navigate));

            // If successful, unlock screen and navigate
            unlockScreen();
        } catch (err) {
            setError('Invalid password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = () => {
        dispatch(logoutUser());
        navigate('/login');
    };

    return (
        <React.Fragment>
            <div className="auth-page-content">
                <div className="auth-page-wrapper">
                    <ParticlesAuth>
                        <div className="auth-page-content">
                            <Container>
                                <Row>
                                    <Col lg={12}>
                                        <div className="text-center mt-sm-5 mb-4 text-white-50">
                                            <div>
                                                <Link to="/dashboard" className="d-inline-block auth-logo">
                                                    <img src={logoLight} alt="" height="20" />
                                                </Link>
                                            </div>
                                            <p className="mt-3 fs-15 fw-medium">Premium Admin & Dashboard Template</p>
                                        </div>
                                    </Col>
                                </Row>

                                <Row className="justify-content-center">
                                    <Col md={8} lg={6} xl={5}>
                                        <Card className="mt-4">
                                            <CardBody className="p-4">
                                                <div className="text-center mt-2">
                                                    <h5 className="text-primary">Lock Screen</h5>
                                                    <p className="text-muted">Enter your password to unlock the screen!</p>
                                                </div>
                                                {error && <Alert color="danger">{error}</Alert>}
                                                <div className="user-thumb text-center">
                                                    <img src={avatar1} className="rounded-circle img-thumbnail avatar-lg" alt="thumbnail" />
                                                    <h5 className="font-size-15 mt-3">{userProfile?.admin?.name || userProfile?.name || 'User'}</h5>
                                                </div>
                                                <div className="p-2 mt-4">
                                                    <form onSubmit={handleUnlock}>
                                                        <div className="mb-3">
                                                            <label className="form-label" htmlFor="userpassword">Password</label>
                                                            <input
                                                                type="password"
                                                                className="form-control"
                                                                id="userpassword"
                                                                placeholder="Enter password"
                                                                value={password}
                                                                onChange={(e) => setPassword(e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="mb-2 mt-4">
                                                            <Button
                                                                color="success"
                                                                className="w-100"
                                                                type="submit"
                                                                disabled={loading}
                                                            >
                                                                {loading ? 'Unlocking...' : 'Unlock'}
                                                            </Button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </CardBody>
                                        </Card>
                                        <div className="mt-4 text-center">
                                            <p className="mb-0">Not you ? return <Link to="/login" onClick={handleSignOut} className="fw-semibold text-primary text-decoration-underline"> Signin </Link> </p>
                                        </div>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </ParticlesAuth>
                </div>
            </div>
        </React.Fragment>
    );
};

export default BasicLockScreen;