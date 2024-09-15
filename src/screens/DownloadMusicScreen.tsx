import React, { useRef } from "react";
import AudioPlayer from "@/components/ui/audioPlayer";
import ImageDisplay from "@/components/ui/imageDisplay";
import DownloadButton from "@/components/ui/downloadButton";
import "./DownloadMusicScreen.css";

interface DownloadMusicProps {
  musicUrl: string;
  mediaInput: File;
}

const DownloadMusicScreen: React.FC<DownloadMusicProps> = ({
  musicUrl,
  mediaInput,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  return (
    <div className="container">
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
