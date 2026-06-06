//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import {
  postFakeLogin,
  postJwtLogin,
} from "../../../helpers/fakebackend_helper";
import { setAuthorization, clearAuthorization, normalizeAuthUser } from "../../../helpers/api_helper";

import { loginSuccess, logoutUserSuccess, apiError, reset_login_flag, loginLoading } from './reducer';

export const loginUser = (user, history) => async (dispatch) => {

  try {
    dispatch(loginLoading());
    let response;
    if (import.meta.env.VITE_DEFAULTAUTH === "firebase") {
      let fireBaseBackend = getFirebaseBackend();
      response = fireBaseBackend.loginUser(
        user.email,
        user.password
      );
    } else if (import.meta.env.VITE_DEFAULTAUTH === "jwt") {
      response = postJwtLogin({
        email: user.email,
        password: user.password
      });

    } else if (import.meta.env.VITE_API_URL) {
      response = postFakeLogin({
        email: user.email,
        password: user.password,
      });
    }
    
    var data = await response;

    if (data) {
      const authUser = normalizeAuthUser({
        ...data,
        access_token: data?.data?.access_token || data?.access_token || data?.token,
        admin: data?.admin || data?.data?.admin,
        permissions: data?.data?.permissions || data?.permissions || [],
      });
      sessionStorage.setItem("authUser", JSON.stringify(authUser));
      if (authUser.access_token) {
        setAuthorization(authUser.access_token);
      }

      if (import.meta.env.VITE_DEFAULTAUTH === "fake") {
        var finallogin = JSON.stringify(data);
        finallogin = JSON.parse(finallogin);
        data = finallogin.data;
        if (finallogin.status === "success") {
          dispatch(loginSuccess(data));
          history('/dashboard');
        } else {
          dispatch(apiError(finallogin));
        }
      } else {
        dispatch(loginSuccess(data));
        history('/dashboard');
      }
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    sessionStorage.removeItem("authUser");
    clearAuthorization();
    let fireBaseBackend = getFirebaseBackend();
    if (import.meta.env.VITE_DEFAULTAUTH === "firebase") {
      const response = fireBaseBackend.logout;
      dispatch(logoutUserSuccess(response));
    } else {
      dispatch(logoutUserSuccess(true));
    }

  } catch (error) {
    dispatch(apiError(error));
  }
};

export const socialLogin = (type, history) => async (dispatch) => {
  try {
    let response;

    if (import.meta.env.VITE_DEFAULTAUTH === "firebase") {
      const fireBaseBackend = getFirebaseBackend();
      response = fireBaseBackend.socialLoginUser(type);
    }
    //  else {
      //   response = postSocialLogin(data);
      // }
      
      const socialdata = await response;
    if (socialdata) {
      sessionStorage.setItem("authUser", JSON.stringify(response));
      dispatch(loginSuccess(response));
      history('/dashboard')
    }

  } catch (error) {
    dispatch(apiError(error));
  }
};


export const resetLoginFlag = () => async (dispatch) =>{
  try {
    const response = dispatch(reset_login_flag());
    return response;
  } catch (error) {
    dispatch(apiError(error));
  }
};