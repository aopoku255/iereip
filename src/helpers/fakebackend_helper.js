import { APIClient } from "./api_helper";

import * as url from "./url_helper";

const api = new APIClient();

export const getLoggedInUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const isUserAuthenticated = () => getLoggedInUser() !== null;

export const postFakeRegister = (data) => api.create(url.POST_FAKE_REGISTER, data);
export const postFakeLogin = (data) => api.create(url.POST_FAKE_LOGIN, data);
export const postFakeForgetPwd = (data) => api.create(url.POST_FAKE_PASSWORD_FORGET, data);
export const postFakeProfile = (data) => api.update(`${url.POST_EDIT_PROFILE}/${data.idx}`, data);

export const postJwtRegister = (path, data) =>
  api.create(path, data).catch((err) => {
    let message = "An unexpected error occurred";

    if (err?.response?.status) {
      switch (err.response.status) {
        case 404:
          message = "Sorry! the page you are looking for could not be found";
          break;
        case 401:
          message = "Invalid credentials";
          break;
        case 500:
          message = "Sorry! something went wrong, please contact our support team";
          break;
        default:
          break;
      }
    }

    throw message;
  });

export const postJwtLogin = (data) => api.create(url.POST_FAKE_JWT_LOGIN, data);
export const postJwtForgetPwd = (data) => api.create(url.POST_FAKE_JWT_PASSWORD_FORGET, data);
export const postJwtProfile = (data) => api.create(url.POST_EDIT_JWT_PROFILE, data);
export const postSocialLogin = (data) => api.create(url.SOCIAL_LOGIN, data);

export const getAllProjectData = () => api.get(url.GET_ALLPROJECT_DATA);
export const getMonthProjectData = () => api.get(url.GET_MONTHPROJECT_DATA);
export const gethalfYearProjectData = () => api.get(url.GET_HALFYEARPROJECT_DATA);
export const getYearProjectData = () => api.get(url.GET_YEARPROJECT_DATA);

export const getAllProjectStatusData = () => api.get(url.GET_ALLPROJECTSTATUS_DATA);
export const getWeekProjectStatusData = () => api.get(url.GET_WEEKPROJECTSTATUS_DATA);
export const getMonthProjectStatusData = () => api.get(url.GET_MONTHPROJECTSTATUS_DATA);
export const getQuarterProjectStatusData = () => api.get(url.GET_QUARTERPROJECTSTATUS_DATA);
