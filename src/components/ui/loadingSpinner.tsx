import React from 'react';
import './styles/loadingSpinner.css'; // Import your CSS for styling

function LoadingSpinner() {
  return (
    <div className="spinner-overlay">
      <div className="spinner"></div>
    </div>
  );
}

export default LoadingSpinner;