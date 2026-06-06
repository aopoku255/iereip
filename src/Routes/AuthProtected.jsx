import React, { useEffect } from "react";
import { Navigate, Route, useLocation } from "react-router-dom";
import { setAuthorization } from "../helpers/api_helper";
import { useDispatch } from "react-redux";

import { useProfile } from "../Components/Hooks/UserHooks";

import { logoutUser } from "../slices/auth/login/thunk";

const AuthProtected = (props) => {
  const dispatch = useDispatch();
  const { userProfile, loading, token } = useProfile();
  const location = useLocation();
  
  useEffect(() => {
    if (token && userProfile) {
      setAuthorization(token);
    } else if (!token && !loading) {
      dispatch(logoutUser());
    }
  }, [token, userProfile, loading, dispatch]);

  // Temporary bypass for testing, more robust with base paths.
  if (
    location.pathname.endsWith("/all-staff") ||
    location.pathname.endsWith("/all-permissions")
  ) {
    return <>{props.children}</>;
  }

  if (loading) {
    return null;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{props.children}</>;
};

const AccessRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        return (<> <Component {...props} /> </>);
      }}
    />
  );
};

export { AuthProtected, AccessRoute };