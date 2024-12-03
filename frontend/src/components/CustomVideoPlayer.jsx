import React, { useRef, useState, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaCompress,
  FaCog,
} from "react-icons/fa";

const CustomYouTubePlayer = ({ src }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isControlsVisible, setIsControlsVisible] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const togglePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const showControls = () => {
    setIsControlsVisible(true);
  };

  return (
    <div
      className="relative bg-white w-full max-w-screen-lg mx-auto overflow-hidden"
      onMouseMove={showControls}
      onClick={showControls}
    >
      {/* Video Player */}
      <video
        ref={videoRef}
        className="w-full h-auto rounded-md"
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        autoPlay
      ></video>

      {/* Controls */}
      <div
        className={`absolute bg-white bottom-0 left-0 right-0 transition-opacity duration-300 ${
          isControlsVisible ? "opacity-100" : "opacity-0"
        } bg-black/80 p-3 flex flex-col gap-2`}
      >
        {/* Play/Pause Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={togglePlayPause}
            className="text-white hover:text-red-500"
          >
            {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
          </button>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full px-2">
            <span className="text-xs text-white">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="flex-grow h-1 bg-gray-500 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
            <span className="text-xs text-white">{formatTime(duration)}</span>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 m-2">
            <button
              onClick={toggleMute}
              className="text-white hover:text-red-500"
            >
              {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="h-1 w-20 bg-gray-500 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
          </div>

         

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="text-white hover:text-red-500"
          >
            {isFullscreen ? <FaCompress size={20} /> : <FaExpand size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomYouTubePlayer;
