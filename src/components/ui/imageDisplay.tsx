import React, { useState, useEffect } from 'react';

interface ImageDisplayProps {
  file: File;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ file }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
  
    useEffect(() => {
      // Create a URL for the file object
      const url = URL.createObjectURL(file);
      setImageUrl(url);
  
      return () => {
        URL.revokeObjectURL(url);
      };
    }, [file]);
  
    return (
      <div>
        {imageUrl ? (
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '400px' }} />
        ) : (
          <p>No image to display</p>
        )}
      </div>
    );
  };
  
  export default ImageDisplay;