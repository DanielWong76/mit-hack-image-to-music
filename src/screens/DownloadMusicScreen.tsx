import React, {useRef} from "react";
import AudioPlayer from "@/components/ui/audioPlayer";
import ImageDisplay from "@/components/ui/imageDisplay";
import DownloadButton from "@/components/ui/downloadButton";

interface DownloadMusicProps {
    musicUrl: string;
    mediaInput: File;
}

const DownloadMusicScreen : React.FC<DownloadMusicProps> = ({musicUrl, mediaInput}) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    return (
        <div>
            <AudioPlayer audioUrl={musicUrl}/>
            <ImageDisplay file={mediaInput}/>
            <DownloadButton fileName="yes.mp3" fileUrl={musicUrl}/>
        </div>
    )
}

export default DownloadMusicScreen;