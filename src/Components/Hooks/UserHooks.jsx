import { useEffect, useState } from "react";
import { getLoggedinUser } from "../../helpers/api_helper";

const useProfile = () => {
  const userProfileSession = getLoggedinUser();
  const token =
    userProfileSession?.token ||
    userProfileSession?.access_token ||
    userProfileSession?.data?.access_token;
  
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(
    userProfileSession ? userProfileSession : null
  );

  useEffect(() => {
    const userProfileSession = getLoggedinUser();
    const token =
      userProfileSession?.token ||
      userProfileSession?.access_token ||
      userProfileSession?.data?.access_token;
    
    setUserProfile(userProfileSession ? userProfileSession : null);
    setLoading(false);
  }, []);

  return { userProfile, loading, token };
};

export { useProfile };