import React from 'react';
import FileUploadButton from '@/components/ui/fileUploadButton.tsx'; // Adjust the import path as needed

const FileUploaderScreen: React.FC = () => {
    const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Full viewport height
    };

    const headingStyle: React.CSSProperties = {
        marginBottom: '20px', // Space between heading and button
        fontFamily: 'Inknut Antiqua'
    };
    
    return (
        <div>
            <div style={containerStyle}>
                <h1 style={headingStyle}>Generate Music for your Images and Videos</h1>
                <FileUploadButton/>
            </div>
        </div>
    );
};

export default FileUploaderScreen;