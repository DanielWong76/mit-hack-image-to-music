import FileUploaderScreen from "./screens/FileUploadScreen";
import Landing from "./screens/Landing";
import DownloadMusicScreen from "./screens/DownloadMusicScreen";
import { Routes, Route } from "react-router-dom";
import LoadingScreen from "./screens/LoadingScreen";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/upload" element={<FileUploaderScreen />} />
      <Route path="/download" element={<DownloadMusicScreen />} />
    </Routes>
  );
}

export default App;