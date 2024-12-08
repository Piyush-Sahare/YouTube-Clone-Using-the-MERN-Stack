// frontend/src/components/CustomVideoPlayer.jsx
import React, { useRef, useState, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaCompress,
} from "react-icons/fa";

// Custom video player component
const CustomYouTubePlayer = ({ src }) => {
  // Refs and state variables
  const videoRef = useRef(null);  // Reference to the video element
  const [isPlaying, setIsPlaying] = useState(true);  
  const [isMuted, setIsMuted] = useState(false); 
  const [volume, setVolume] = useState(1);  
  const [currentTime, setCurrentTime] = useState(0);  
  const [duration, setDuration] = useState(0);  
  const [isFullscreen, setIsFullscreen] = useState(false);  
  const [playbackRate, setPlaybackRate] = useState(1);  
  const [isControlsVisible, setIsControlsVisible] = useState(true);  

  // Sync playback rate with the video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]); // Runs when playbackRate is changed

  // Toggle play/pause functionality
  const togglePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();  // Pause video
    } else {
      videoRef.current.play();  // Play video
    }
    setIsPlaying(!isPlaying);  // Toggle playing state
  };

  // Toggle mute/unmute functionality
  const toggleMute = () => {
    videoRef.current.muted = !isMuted;  // Mute or unmute the video
    setIsMuted(!isMuted);  // Toggle mute state
  };

  // Handle volume change through the slider
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);  
    videoRef.current.volume = newVolume;  
    setVolume(newVolume); 
    setIsMuted(newVolume === 0);  
  };

  // Handle time update to update currentTime state
  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);  
  };

  // Set the video's duration when metadata is loaded
  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);  
  };

  // Seek video when user interacts with the progress bar
  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);  
    videoRef.current.currentTime = newTime;  
    setCurrentTime(newTime);  
  };

  // Toggle fullscreen mode
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

  // Format time 
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;  
  };

  // Show the controls when mouse moves or clicks
  const showControls = () => {
    setIsControlsVisible(true);  
  };

  return (
    <div
      className="relative w-full max-w-screen-lg mx-auto overflow-hidden"
      onMouseMove={showControls}  
      onClick={showControls}  
    >
      {/* Video Player */}
      <video
        ref={videoRef}
        className="w-full h-auto rounded-xl"
        src={src}  // Video source passed as prop
        onTimeUpdate={handleTimeUpdate}  // Handle time updates during playback
        onLoadedMetadata={handleLoadedMetadata}  // Set video duration on metadata load
        autoPlay  // Automatically play the video on load
      ></video>

      {/* Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 rounded-xl transition-opacity duration-300 ${isControlsVisible ? "opacity-100" : "opacity-0"
          } bg-black/80 p-3 flex flex-col gap-2`}
      >
        {/* Play/Pause Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={togglePlayPause}  // Toggle play/pause on click
            className="text-white hover:text-red-500"
          >
            {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}  {/* Display Play or Pause icon */}
          </button>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full px-2">
            <span className="text-xs text-white">
              {formatTime(currentTime)}  {/* Display current time */}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 0}  
              value={currentTime}  
              onChange={handleSeek}  
              className="flex-grow h-1 bg-gray-500 rounded-lg appearance-none cursor-pointer accent-red-500"
              style={{
                background: `linear-gradient(to right, red ${(currentTime / duration) * 100}%, #e5e5e5 ${(currentTime / duration) * 100}%)`,  // Style progress bar based on current time
              }}
            />
            <span className="text-xs text-white">{formatTime(duration)}</span>  {/* Display video duration */}
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 m-2">
            <button
              onClick={toggleMute}  // Toggle mute/unmute on click
              className="text-white hover:text-red-500"
            >
              {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}  {/* Display mute or volume icon */}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}  
              onChange={handleVolumeChange}  
              className="h-1 w-20 bg-gray-500 rounded-lg appearance-none cursor-pointer accent-red-500"
              style={{
                background: `linear-gradient(to right, red ${volume * 100}%, #e5e5e5 ${volume * 100}%)`  // Style volume slider
              }}
            />
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}  // Toggle fullscreen mode on click
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
