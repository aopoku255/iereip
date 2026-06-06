//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import { postFakeProfile, postJwtProfile } from "../../../helpers/fakebackend_helper";
import { APIClient } from "../../../helpers/api_helper";

// action
import { profileSuccess, profileError, resetProfileFlagChange, adminProfileSuccess, adminProfileError } from "./reducer";

const fireBaseBackend = getFirebaseBackend();

export const editProfile = (user) => async (dispatch) => {
    try {
        let response;

        if (import.meta.env.VITE_DEFAULTAUTH === "firebase") {
            response = fireBaseBackend.editProfileAPI(
                user.username,
                user.idx
            );

        } else if (import.meta.env.VITE_DEFAULTAUTH === "jwt") {

            response = postJwtProfile(
                {
                    username: user.username,
                    idx: user.idx,
                }
            );

        } else if (import.meta.env.VITE_DEFAULTAUTH === "fake") {
            response = postFakeProfile(user);
        }

        const data = await response;

        if (data) {
            dispatch(profileSuccess(data));
        }

    } catch (error) {
        dispatch(profileError(error));
    }
};

export const resetProfileFlag = () => {
    try {
        const response = resetProfileFlagChange();
        return response;
    } catch (error) {
        return error;
    }
};

// Thunk to fetch logged-in admin profile from /auth/me endpoint
export const fetchAdminProfile = () => async (dispatch) => {
    try {
        const api = new APIClient();
        const response = await api.get("/auth/me");
        
        if (response && response.data) {
            dispatch(adminProfileSuccess(response.data));
        } else {
            dispatch(adminProfileError("Failed to fetch admin profile"));
        }
    } catch (error) {
        dispatch(adminProfileError(error.message || "Error fetching admin profile"));
    }
};