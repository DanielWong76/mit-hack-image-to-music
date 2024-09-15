import React from "react";
import './Landing.css'; // Import the CSS file
import { useNavigate } from "react-router-dom";

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/upload");
  };

  return (
    <div className="title-container">
      <button className="button" onClick={handleButtonClick}>begin</button>
    </div>
  );
};

export default Landing;
