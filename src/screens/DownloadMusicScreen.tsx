import React, {useRef} from "react";
import AudioPlayer from "@/components/ui/audioPlayer";
import ImageDisplay from "@/components/ui/imageDisplay";

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
        </div>
    )
}

export default DownloadMusicScreen;