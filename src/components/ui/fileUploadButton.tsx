import React, { useRef, useState, ChangeEvent } from 'react';
import { Button } from './button.tsx'; // Adjust the import path according to your setup

const FileUploadButton: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Reference to the hidden file input
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Function to handle file selection
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  // Function to trigger file input click
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input click
    }
  };

  return (
    <div>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept="image/*,video/*" // Adjust as needed
      />

      {/* Button to trigger file input */}
      <Button onClick={handleButtonClick} style={{fontFamily: 'Inknut Antiqua'}}>
        Upload File
      </Button>

      {/* Display selected file info */}
      {selectedFile && (
        <div>
          <p>Selected file: {selectedFile.name}</p>
          {/* Optional: Display file preview */}
          {selectedFile.type.startsWith('image/') && (
            <img src={URL.createObjectURL(selectedFile)} alt="Preview" style={{ maxWidth: '100px' }} />
          )}
          {selectedFile.type.startsWith('video/') && (
            <video controls width="300">
              <source src={URL.createObjectURL(selectedFile)} type={selectedFile.type} />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploadButton;