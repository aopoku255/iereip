import { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logoutUser } from '../../slices/auth/login/thunk';

const useLockScreen = (timeout = 15 * 60 * 1000) => { // 15 minutes default
  const [isLocked, setIsLocked] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const timeoutRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userProfile } = useSelector(state => state.Login);

  // Reset activity timer
  const resetActivity = useCallback(() => {
    setLastActivity(Date.now());
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (userProfile && !isLocked) {
      timeoutRef.current = setTimeout(() => {
        setIsLocked(true);
        // Store current path before locking
        sessionStorage.setItem('lockScreenReturnPath', location.pathname + location.search);
        navigate('/auth-lockscreen-basic');
      }, timeout);
    }
  }, [timeout, userProfile, isLocked, navigate, location]);

  // Unlock screen
  const unlockScreen = useCallback(() => {
    setIsLocked(false);
    resetActivity();
    // Navigate back to stored path or dashboard
    const returnPath = sessionStorage.getItem('lockScreenReturnPath') || '/dashboard';
    sessionStorage.removeItem('lockScreenReturnPath');
    navigate(returnPath);
  }, [resetActivity, navigate]);

  // Lock screen manually
  const lockScreen = useCallback(() => {
    setIsLocked(true);
    // Store current path before locking
    sessionStorage.setItem('lockScreenReturnPath', location.pathname + location.search);
    navigate('/auth-lockscreen-basic');
  }, [navigate, location]);

  // Activity event handlers
  const handleActivity = useCallback(() => {
    if (!isLocked) {
      resetActivity();
    }
  }, [isLocked, resetActivity]);

  useEffect(() => {
    if (!userProfile) {
      setIsLocked(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    // Set up activity listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Start initial timeout
    resetActivity();

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [userProfile, handleActivity, resetActivity]);

  // Handle page visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, reset timer when it becomes visible
        setLastActivity(Date.now());
      } else {
        // Page is visible again, reset activity
        resetActivity();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [resetActivity]);

  return {
    isLocked,
    lockScreen,
    unlockScreen,
    resetActivity
  };
};

export default useLockScreen;