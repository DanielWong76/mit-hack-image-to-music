import { FormEvent, useRef, useState } from "react";
import { useMutation, useQuery, useAction } from "convex/react";
import { Button } from "@/components/ui/button"; 
import { api } from "../convex/_generated/api";
import FileUploaderScreen from "./screens/FileUploadScreen";
import Landing from "./screens/Landing";
import DownloadMusicScreen from "./screens/DownloadMusicScreen";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/upload" element={<FileUploaderScreen />} />
    </Routes>
  );
}

export default App;