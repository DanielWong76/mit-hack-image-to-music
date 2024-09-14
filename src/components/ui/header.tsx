import React from 'react';
import logo from '@/assets/composition_logo.png'; // Adjust the path according to your folder structure

const Header: React.FC = () => {
    return (
        <header style={{marginLeft: '20px', marginTop: '20px'}}>
            <img src={logo} alt="Logo" style={{ height: '50px' }} /> {/* Adjust size as needed */}
        </header>
    );
};

export default Header;