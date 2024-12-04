// //frontend/src/page/Video.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { addToWatchHistory } from '../Redux/slice/authSlice';
import { fetchVideoById, incrementView } from '../Redux/slice/videoSlice';
import { useToast } from '../hooks/use-toast';
import CustomVideoPlayer from '../components/CustomVideoPlayer';
import Comments from '../components/Comments';

function Video() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const videoData = useSelector((state) => state.video.video);
  const dispatch = useDispatch();
  const toast = useToast();
   //console.log(videoData);
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        dispatch(fetchVideoById(id));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVideoData();
  }, [id]);

  useEffect(() => {
    const incrementViewCount = async () => {
      try {
        await dispatch(incrementView(id)).unwrap();
        console.log('View count incremented');
      } catch (error) {
        console.error('Error incrementing view count:', error);
      }
    };
    incrementViewCount();
  }, [id]);

  useEffect(() => {
    const AddToWatchHistory = async () => {
      try {
        dispatch(addToWatchHistory(id));
        console.log('addToWatchHistory');
      } catch (error) {
        console.error('Error addToWatchHistory:', error);
      }
    };
    AddToWatchHistory();
  }, [id]);


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!videoData) return <div>No video data found.</div>;

  return (
    <div className="bg-white min-h-screen">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 mt-3">
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Video Player Section */}
          <div className="flex-1">
            <CustomVideoPlayer  src={videoData.videoFile} />
            <h1 className="mt-4 text-2xl font-semibold">{videoData.title}</h1>

            {/* Video Metadata */}
            <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-3">
                
                  <Link
                    to={`/channel/${videoData.channelId}`}
                    className="flex items-center gap-2 hover:text-black"
                  >
                    <img
                      className="w-10 h-10 rounded-full"

                      src={videoData.channelId.avatar}
                      alt="Channel Avatar"
                    />
                    <span className="font-medium">{videoData.channelId.name}</span>
                  </Link>
                
              </div>

            </div>
          </div>

          {/* Suggested Videos */}
          <div className="w-full xl:w-96">
            <h2 className="mb-4 text-lg font-semibold">Up Next</h2>
            <ul className="space-y-4">
              {/* Example suggested videos */}
              {videoData.relatedVideos?.map((relatedVideo) => (
                <li key={relatedVideo.id} className="flex gap-4">
                  <img
                    className="w-32 h-20 object-cover rounded"
                    src={relatedVideo.thumbnail}
                    alt={relatedVideo.title}
                  />
                  <div className="flex flex-col">
                    <Link to={`/video/${relatedVideo.id}`} className="font-semibold hover:text-red-500">
                      {relatedVideo.title}
                    </Link>
                    <span className="text-sm text-gray-500">
                      {relatedVideo.channelName} • {relatedVideo.views} views
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Video Description */}
        <div className="mt-6 p-4 bg-gray-100 rounded shadow-sm">
          <div className="flex items-center gap-3">
            <span>{videoData.views} views</span>
            <span>{formatDate(videoData.createdAt)}</span>
          </div>
          <p className="text-sm text-gray-700">{videoData.description}</p>
        </div>
        <Comments videoId={id} />
      </div>
    </div>
  );
}

export default Video;
