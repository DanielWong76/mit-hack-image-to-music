import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Header from "./components/ui/header";
import FileUploaderScreen from "./screens/FileUploadScreen";
import Landing from "./screens/Landing";
import DownloadMusicScreen from "./screens/DownloadMusicScreen";
import { Routes, Route } from "react-router-dom";

function App() {
  const [newIdea, setNewIdea] = useState("");
  const [includeRandom, setIncludeRandom] = useState(true);

  const ideas = useQuery(api.myFunctions.listIdeas);
  const saveIdea = useMutation(api.myFunctions.saveIdea);
  const generateIdea = useAction(api.myFunctions.fetchRandomIdea);
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

export default App;
