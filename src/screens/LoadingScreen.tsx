import React from "react";
import './Landing.css';
import LoadingSpinner from "@/components/ui/loadingSpinner";


const LoadingScreen: React.FC = () => {
    return (
        <div className="container">
            <LoadingSpinner/>
        </div>
    );
}

export default LoadingScreen;