import React, { useState, FormEvent,  } from 'react';
import FileUploadButton from '@/components/ui/fileUploadButton.tsx';
import { useMutation, useQuery, useAction, useConvex } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const FileUploaderScreen: React.FC = () => {
  const navigate = useNavigate();
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);
  const sendImage = useMutation(api.messages.sendImage);
  const fetchModal = useAction(api.myFunctions.fetchModalResponse);
  const convex = useConvex()

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [name] = useState(() => "User " + Math.floor(Math.random() * 10000));

  async function handleSendImage(event: FormEvent) {
    event.preventDefault();
    console.log("Sending image");
    if (!selectedFile) return; // Do nothing if no image is selected

    try {
      // Step 1: Get a short-lived upload URL
      const postUrl = await generateUploadUrl();

      // Step 2: POST the file to the URL
      const result = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': selectedFile.type },
        body: selectedFile,
      });
      const { storageId } = await result.json();
      console.log("storageId " + storageId);

      // Step 3: Save the newly allocated storage id to the database
      await sendImage({ storageId, author: name });
      setSelectedFile(null);
      
      // Fetch response based on the uploaded image
      const mostRecentImageUrl = await convex.query(api.listMessages.mostRecentImageUrl);

      if (mostRecentImageUrl == null) {
        throw new Error("Invalid Image URL");
      }

      console.log(mostRecentImageUrl);
      const fetchModalResponse = await fetchModal({ imageUrl: mostRecentImageUrl });
      console.log(fetchModalResponse);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }

  return (
    <div className="upload">
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ marginBottom: '20px', fontFamily: 'Inknut Antiqua', color: 'white' }}>
          Generate Music for your Images and Videos
        </h1>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px', fontFamily: 'Inknut Antiqua' }}>
          <FileUploadButton onImageSelect={(file) => setSelectedFile(file)} />
          <button className="button" onClick={handleSendImage} disabled={!selectedFile}>
            Generate Music
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUploaderScreen;