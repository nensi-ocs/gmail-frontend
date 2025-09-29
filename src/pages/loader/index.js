// components/LoadingOverlay.js
import React from 'react';
import { TailSpin } from 'react-loader-spinner';

const LoadingOverlay = ({ isLoading, fullPage = true, loaderType = 'TailSpin', lockScroll = true }) => {
  if (!isLoading) return null;

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  };

  const fullPageStyle = {
    position: 'fixed',
  };

  return (
    <div style={{ ...overlayStyle, ...(fullPage ? fullPageStyle : {}) }}>
      <TailSpin color="#0574B0" />
    </div>
  );
};

export default LoadingOverlay;
