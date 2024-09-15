import React, {useState} from 'react';
import FileUploadButton from '@/components/ui/fileUploadButton.tsx';
import { Button } from '@/components/ui/button';
import './Landing.css';

const FileUploaderScreen: React.FC = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const containerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px', 
        marginTop: '20px',
        fontFamily: 'Inknut Antiqua',
    };

    const headingStyle: React.CSSProperties = {
        marginBottom: '20px', // Space between heading and button
        fontFamily: 'Inknut Antiqua',
        color: "white",
    };
    
    return (
        <div className="upload">
            <div style={{textAlign: 'center'}}>
                <h1 style={headingStyle}>Generate Music for your Images and Videos</h1>
                
                <div style={containerStyle}>
                    <FileUploadButton/>
                    <button className="button">Generate Music</button>
                </div>
            </div>
        </div>
    );
};

export default FileUploaderScreen;