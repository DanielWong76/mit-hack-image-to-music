import React from 'react';
import FileUploadButton from '@/components/ui/fileUploadButton.tsx';
import { Button } from '@/components/ui/button';
import graphic from '@/assets/landing_graphic.png';

const FileUploaderScreen: React.FC = () => {
    const containerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px', 
        marginTop: '20px',
        fontFamily: 'Inknut Antiqua'
    };

    const headingStyle: React.CSSProperties = {
        marginBottom: '20px', // Space between heading and button
        fontFamily: 'Inknut Antiqua'
    };
    
    return (
        <div>
            <div style={{textAlign: 'center'}}>
                <h1 style={headingStyle}>Generate Music for your Images and Videos</h1>
                
                <div style={containerStyle}>
                    <FileUploadButton/>
                    <Button type='submit'>Generate Music</Button>
                </div>
            </div>
        </div>
    );
};

export default FileUploaderScreen;