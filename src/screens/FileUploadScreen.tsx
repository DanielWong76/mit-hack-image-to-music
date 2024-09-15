import React, { useState, FormEvent,  } from 'react';
import FileUploadButton from '@/components/ui/fileUploadButton.tsx';
import { useMutation, useQuery, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const FileUploaderScreen: React.FC = () => {
  const navigate = useNavigate();
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);
  const sendImage = useMutation(api.messages.sendImage);

  const mostRecentImageUrl = useQuery(api.listMessages.mostRecentImageUrl);
  const fetchModal = useAction(api.myFunctions.fetchModal);
  const postToSuno = useAction(api.myFunctions.actPostToSuno);
  const getFromSuno = useAction(api.myFunctions.actGetFromSuno);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [name] = useState(() => "User " + Math.floor(Math.random() * 10000));

  async function handleSendImage(event: FormEvent) {
    event.preventDefault();
    if (!selectedImage) return; // Do nothing if no image is selected

    try {
      // Step 1: Get a short-lived upload URL
      const postUrl = await generateUploadUrl();

      // Step 2: POST the file to the URL
      const result = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': selectedImage.type },
        body: selectedImage,
      });
      const { storageId } = await result.json();

      // Step 3: Save the newly allocated storage id to the database
      await sendImage({ storageId, author: name });
      setSelectedImage(null);
      
      const fetchModalResponse = await fetchModal({ imageUrl: mostRecentImageUrl });

      // Send Modal description to Suno API
      const postToSunoResponse = await postToSuno({ songDetails: fetchModalResponse });
      console.log(postToSunoResponse);

      // Wait for 2 minutes for the music to be generated
      const waitTime = 120000
      await new Promise((resolve) => setTimeout(resolve, waitTime));

      // Get generated music from Suno API
      const getFromSunoResponse = await getFromSuno({ id: postToSunoResponse } );
      console.log(getFromSunoResponse);

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
          <FileUploadButton onImageSelect={(file) => setSelectedImage(file)} />
          <button className="button" onClick={handleSendImage} disabled={!selectedImage}>
            Generate Music
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUploaderScreen;