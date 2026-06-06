import React, { useState, useEffect } from 'react';
import { Button, Toast, ToastHeader, ToastBody } from 'reactstrap';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = window.navigator.standalone === true;
    const isAppInstalled = isStandalone || isInWebAppiOS;

    if (isAppInstalled) {
      setShowInstallButton(false);
      return;
    }

    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      // Hide the install button when app is installed
      setShowInstallButton(false);
      setDeferredPrompt(null);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if app can be installed (for browsers that don't support beforeinstallprompt)
    if (!deferredPrompt && 'serviceWorker' in navigator && !isAppInstalled) {
      setShowInstallButton(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback for browsers that don't support beforeinstallprompt
      alert('To install this app, please use your browser\'s "Add to Home Screen" option from the menu.');
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    // Reset the deferred prompt
    setDeferredPrompt(null);
    setShowInstallButton(false);

    if (outcome === 'accepted') {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  if (!showInstallButton) {
    return null;
  }

  return (
    <>
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1050,
        }}
      >
        <Button
          color="primary"
          onClick={handleInstallClick}
          style={{
            borderRadius: '50px',
            padding: '10px 20px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          }}
        >
          <i className="mdi mdi-download-outline me-2"></i>
          Install App
        </Button>
      </div>

      {/* Success Toast */}
      <div
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          zIndex: 1050,
        }}
      >
        <Toast isOpen={showToast} fade timeout={300}>
          <ToastHeader>
            <i className="mdi mdi-check-circle text-success me-2"></i>
            App Installed
          </ToastHeader>
          <ToastBody>
            The app has been successfully installed on your device!
          </ToastBody>
        </Toast>
      </div>
    </>
  );
};

export default PWAInstallPrompt;