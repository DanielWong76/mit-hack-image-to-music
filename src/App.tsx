import { FormEvent, useRef, useState } from "react";
import { useMutation, useQuery, useAction } from "convex/react";
import { Button } from "@/components/ui/button"; 
import { api } from "../convex/_generated/api";
import FileUploaderScreen from "./screens/FileUploadScreen";
import Landing from "./screens/Landing";
import DownloadMusicScreen from "./screens/DownloadMusicScreen";
import { Routes, Route } from "react-router-dom";


export default function App() {
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);
  const sendImage = useMutation(api.messages.sendImage);
  const mostRecentImageUrl = useQuery(api.listMessages.mostRecentImageUrl);
  const fetchModalResponse = useAction(api.myFunctions.fetchModalResponse);
  const response = fetchModalResponse({ imageUrl: mostRecentImageUrl })

  const imageInput = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [name] = useState(() => "User " + Math.floor(Math.random() * 10000));
  async function handleSendImage(event: FormEvent) {
    event.preventDefault();

    // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();
    // Step 2: POST the file to the URL
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": selectedImage!.type },
      body: selectedImage,
    });
    const { storageId } = await result.json();
    // Step 3: Save the newly allocated storage id to the database
    await sendImage({ storageId, author: name });
    setSelectedImage(null);
    imageInput.current!.value = "";

  console.log(response);
  }
  // Now I want to get the storage Id and query the database for the URL



function App() {
  const base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAAD8GO2jAAAAAElFTkSuQmCC';

  // Convert base64 string to a Blob
  const blob = fetch(base64Image)
    .then(response => response.blob());
  const staticImageFile = new File(
    [new Uint8Array([
      // This is just example data. In practice, use a Blob or ArrayBuffer for actual image data.
      // You can generate the actual byte data from an image file.
    ])],
    'example.png',
    { type: 'image/png' }
  );
  return (
    
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/upload" element={<FileUploaderScreen />} />
    </Routes>
  );
  }
}
