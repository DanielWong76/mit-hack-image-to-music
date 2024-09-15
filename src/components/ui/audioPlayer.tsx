import React, { useRef } from 'react';
import Play from '@/assets/Play.png';
import Pause from '@/assets/pause.png';

interface AudioPlayerProps {
  audioUrl: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
  
    const handlePlay = () => {
      if (audioRef.current) {
        audioRef.current.play();
      }
    };
  
    const handlePause = () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  
    return (
      <div>
        <audio ref={audioRef}>
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
        </audio>
        <div>
          <button onClick={handlePlay}>
            <img src={Play} alt="Play" style={{opacity: 'isHovered' ? 0.7 : 1,
          transition: 'opacity 0.3s ease'}}/>
          </button>
          <button onClick={handlePause}>
            <img src={Pause} alt="Pause" style={{opacity: 'isHovered' ? 0.7 : 1,
          transition: 'opacity 0.3s ease'}}/>
          </button>
        </div>
      </div>
    );
  };
  
  export default AudioPlayer;