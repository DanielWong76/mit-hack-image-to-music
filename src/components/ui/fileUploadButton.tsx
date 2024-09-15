import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import "./styles/fileUploadButton.css";

interface FileUploadButtonProps {
  onImageSelect: (file: File) => void;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({ onImageSelect }) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      onImageSelect(file); // Notify parent about the selected file
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      style={{
        border: '2px dashed #cccccc',
        borderRadius: '10px',
        padding: '20px',
        textAlign: 'center',
        fontFamily: 'monospace',
        opacity: '0.6',
        cursor: 'pointer',
        backgroundColor: isDragActive ? '#e9e9e9' : '#f9f9f9',
        width: '200px',
        height: '200px',
        color: 'black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <input {...getInputProps()} />
      {fileUrl ? (
        <img src={fileUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
      ) : (
        <p>{isDragActive ? 'Drop the file here...' : 'Drag & drop files here, or click to select files'}</p>
      )}
    </div>
  );
};

export default FileUploadButton;