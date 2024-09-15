import React, { useState, useRef, useEffect, FormEvent } from 'react';
import FileUploadButton from '@/components/ui/fileUploadButton.tsx';
import { useMutation, useQuery, useAction, useConvex } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const FileUploaderScreen: React.FC = () => {
  const navigate = useNavigate();
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);
  const sendImage = useMutation(api.messages.sendImage);
  const fetchModal = useAction(api.myFunctions.fetchModal);
  const postToSuno = useAction(api.myFunctions.actPostToSuno);
  const getFromSuno = useAction(api.myFunctions.actGetFromSuno);
  const convex = useConvex();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const [name] = useState(() => "User " + Math.floor(Math.random() * 10000));
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    return () => {
      // Stop the webcam stream when the component unmounts
      if (webcamStream) {
        webcamStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [webcamStream]);

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

      // Send Modal description to Suno API
      const postToSunoResponse = await postToSuno({ songDetails: fetchModalResponse });
      console.log(postToSunoResponse);

      // Wait for 3 minutes for the music to be generated
      const waitTime = 180000;
      await new Promise((resolve) => setTimeout(resolve, waitTime));

      // Get generated music from Suno API
      const getFromSunoResponse = await getFromSuno({ id: postToSunoResponse });
      console.log(getFromSunoResponse);

    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setWebcamStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const captureImageFromWebcam = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'webcam-image.jpg', { type: 'image/jpeg' });
            setSelectedFile(file);
          }
        }, 'image/jpeg');
      }
    }
  };

  return (
    <div className="upload">
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ marginBottom: '20px', fontFamily: 'Inknut Antiqua', color: 'white' }}>
          Generate Music for your Images and Videos
        </h1>

        {/* Webcam video feed */}
        <div style={{ marginBottom: '20px' }}>
          <video ref={videoRef} autoPlay style={{ width: '100%', maxWidth: '600px' }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <button className="button" onClick={startWebcam}>
            Start Webcam
          </button>
          <button className="button" onClick={captureImageFromWebcam}>
            Capture Image
          </button>
        </div>

        {/* File upload and submit */}
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