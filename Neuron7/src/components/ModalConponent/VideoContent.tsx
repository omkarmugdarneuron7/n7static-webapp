import React from "react";
import ReactPlayer from "react-player";

interface VideoContentProps {
    content: string;
  }
 
const VideoContent: React.FC<VideoContentProps> = ({ content }) => {
  const videoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // Example YouTube video URL
 
  return (
<div>
<ReactPlayer url={videoUrl} controls />
</div>
  );
};
 
export default VideoContent;