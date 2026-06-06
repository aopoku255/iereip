import axios from "axios";
import { api } from "../config";

// default
axios.defaults.baseURL = api.API_URL;
// content type
axios.defaults.headers.post["Content-Type"] = "application/json";

const getTokenFromUser = (user) => {
  if (!user || typeof user !== "object") return null;

  const nestedData = user?.data && typeof user.data === "object" ? user.data : {};

  return (
    user?.access_token ||
    user?.accessToken ||
    user?.token ||
    nestedData?.access_token ||
    nestedData?.accessToken ||
    nestedData?.token
  ) || null;
};

const normalizeAuthUser = (user) => {
  if (!user || typeof user !== "object") return null;

  const nestedData = user?.data && typeof user.data === "object" ? user.data : {};

  return {
    ...user,
    ...nestedData,
    access_token: getTokenFromUser(user) || null,
  };
};

const getStoredAuthUser = () => {
  try {
    return normalizeAuthUser(JSON.parse(sessionStorage.getItem("authUser") || "null"));
  } catch (error) {
    return null;
  }
};

const getCurrentAuthToken = () => getTokenFromUser(getStoredAuthUser());

const storedAuthUser = getStoredAuthUser();
const token = getTokenFromUser(storedAuthUser);
if (token) axios.defaults.headers.common["Authorization"] = "Bearer " + token;

axios.interceptors.request.use((config) => {
  const tokenFromStorage = getCurrentAuthToken();
  const authorization = config.headers?.Authorization || tokenFromStorage;

  if (authorization) {
    config.headers = {
      ...(config.headers || {}),
      Authorization: authorization.startsWith("Bearer ") ? authorization : `Bearer ${authorization}`,
    };
  }

  return config;
}, (error) => Promise.reject(error));

// intercepting to capture errors
axios.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      logoutOnInvalidSession();
      return Promise.reject({
        message: "Your session has expired. Please login again.",
        status: 401,
        data: error?.response?.data || null,
      });
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    const status = error?.response?.status || error?.status;
    const responseData = error?.response?.data;
    let message = responseData?.message || error?.message || "An error occurred";

    switch (status) {
      case 500:
        message = "Internal Server Error";
        break;
      case 401:
        message = responseData?.message || "Invalid credentials";
        break;
      case 404:
        message = "Sorry! the data you are looking for could not be found";
        break;
      default:
        break;
    }
    return Promise.reject({ message, status, data: responseData });
  }
);
/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token) => {
  const currentToken = token || getCurrentAuthToken();
  if (currentToken) {
    axios.defaults.headers.common["Authorization"] = currentToken.startsWith("Bearer ")
      ? currentToken
      : `Bearer ${currentToken}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

/**
 * Clears the default authorization
 */
const clearAuthorization = () => {
  delete axios.defaults.headers.common["Authorization"];
};

const logoutOnInvalidSession = () => {
  try {
    sessionStorage.removeItem("authUser");
  } catch (error) {
    // ignore storage errors
  }

  clearAuthorization();

  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
};

class APIClient {
  /**
   * Fetches data from given url
   */

  //  get = (url, params) => {
  //   return axios.get(url, params);
  // };
  get = (url, params) => {
    const normalizedParams = Object.entries(params || {}).reduce((acc, [key, value]) => {
      if (value === undefined || value === null || value === "") return acc;

      if (key === "user_id" || key === "limit" || key === "offset") {
        const numericValue = Number(value);
        if (Number.isFinite(numericValue)) {
          acc[key] = numericValue;
        }
        return acc;
      }

      acc[key] = value;
      return acc;
    }, {});

    const queryString = new URLSearchParams(normalizedParams).toString();
    return axios.get(`${url}${queryString ? `?${queryString}` : ""}`);
  };
  /**
   * post given data to url
   */
  create = (url, data, config = {}) => {
    const finalConfig = { ...config };
    if (data instanceof FormData) {
      finalConfig.headers = {
        ...(finalConfig.headers || {}),
        "Content-Type": undefined,
      };
    }
    return axios.post(url, data, finalConfig);
  };
  /**
   * Updates data
   */
  update = (url, data) => {
    return axios.patch(url, data);
  };

  put = (url, data) => {
    return axios.put(url, data);
  };
  /**
   * Delete
   */
  delete = (url, config) => {
    return axios.delete(url, { ...config });
  };
}
const getLoggedinUser = () => getStoredAuthUser();

export { APIClient, setAuthorization, clearAuthorization, getLoggedinUser, logoutOnInvalidSession, normalizeAuthUser };