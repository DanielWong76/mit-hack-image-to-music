import React from "react";
import AudioPlayer from "@/components/ui/audioPlayer";
import ImageDisplay from "@/components/ui/imageDisplay";
import DownloadButton from "@/components/ui/downloadButton";
import { useLocation } from 'react-router-dom';
import "./DownloadMusicScreen.css";

const DownloadMusicScreen: React.FC = () => {
  const location = useLocation();
  const { musicUrl, mediaInput } = location.state as { musicUrl: string; mediaInput: File };
  console.log(musicUrl);

  return (
    <div className="container-2">
      <div className="button-container">
        <div className="top-center">
          <AudioPlayer audioUrl={musicUrl} />
        </div>
        <ImageDisplay file={mediaInput} />
        <div className="lower-center">
          <DownloadButton fileName="yes.mp3" fileUrl={musicUrl} />
        </div>
      </div>
    </div>
  );
};

export default DownloadMusicScreen;
