import React from 'react';
import header from '@/assets/header.png'; // Adjust the path according to your folder structure

const Header: React.FC = () => {
    return (
        <header style={{marginLeft: '20px', marginTop: '20px'}}>
            <img src={header} alt="header" style={{ height: '50px' }} /> {/* Adjust size as needed */}
        </header>
    );
};

export default Header;