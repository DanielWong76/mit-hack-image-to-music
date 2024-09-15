import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUploadButton: React.FC = () => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      // Create a URL for the uploaded file
      const url = URL.createObjectURL(file);
      setFileUrl(url);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      style={{
        border: '2px dashed #cccccc',
        borderRadius: '10px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: isDragActive ? '#e9e9e9' : '#f9f9f9',
        width: '200px',
        height: '200px', // Set a height for the box
        color: 'black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <input {...getInputProps()} />
      {fileUrl ? (
        // Display the preview
        <div style={{ textAlign: 'center' }}>
          {fileUrl.endsWith('.mp4') || fileUrl.endsWith('.webm') ? (
            <video width="100%" height="100%" controls>
              <source src={fileUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={fileUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
          )}
        </div>
      ) : (
        // Default text for drag-and-drop
        <p>{isDragActive ? 'Drop the file here...' : 'Drag & drop files here, or click to select files'}</p>
      )}
    </div>
  );
};

export default FileUploadButton;