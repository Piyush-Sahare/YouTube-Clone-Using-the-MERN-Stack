// frontend/src/page/Video.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchVideoById, incrementView, likeVideo, removeLikeVideo } from '../Redux/slice/videoSlice';
import { useToast } from '../hooks/use-toast';
import CustomVideoPlayer from '../components/CustomVideoPlayer';
import Comments from '../components/Comments';
import Recommendation from '../components/Recommendation';
import { IoMdThumbsUp, IoMdThumbsDown } from "react-icons/io";
import { subscribeChannel, unsubscribeChannel } from '../Redux/slice/channelSlice';

function Video() {
  const { id } = useParams();
  const [videoLoading, setVideoLoading] = useState(true); // New loading state for the video player
  const [isSubscribed, setIsSubscribed] = useState(false);
  const videoData = useSelector((state) => state.video.video);
  const authStatus = useSelector((state) => state.auth.status);
  const userId = useSelector((state) => state.auth.user?._id);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const likesCount = videoData?.likes?.length || 0;
  const subscribers = videoData?.channelId?.subscribers?.length || 0;
  const [hasLiked, setHasLiked] = useState(false);

  // Helper function to format the video creation date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Fetch video data
  useEffect(() => {
    const fetchVideoData = async () => {
      setVideoLoading(true); // Show loading state for video
      try {
        await dispatch(fetchVideoById(id)).unwrap();
        await dispatch(incrementView(id)).unwrap();
      } catch (error) {
        console.error('Error fetching video:', error);
      } finally {
        setVideoLoading(false); // Hide loading state after video fetch
      }
    };
    fetchVideoData();
  }, [id, dispatch]);

  // Check subscription status
  useEffect(() => {
    if (videoData && userId) {
      setIsSubscribed(videoData.channelId.subscribers.includes(userId));
      setHasLiked(videoData.likes.includes(userId));
    }
  }, [videoData, userId]);

  const handleSubscribe = async () => {
    if (!authStatus) {
      toast({
        variant: "destructive",
        title: "Please log in to subscribe",
      });
      return;
    }

    try {
      if (isSubscribed) {
        // Unsubscribe
        await dispatch(unsubscribeChannel(videoData.channelId._id)).unwrap();
        await dispatch(fetchVideoById(id)).unwrap();
        toast({
          title: "Unsubscribed successfully",
        });
        setIsSubscribed(false); // Update state after successful API call
      } else {
        // Subscribe
        await dispatch(subscribeChannel(videoData.channelId._id)).unwrap();
        await dispatch(fetchVideoById(id)).unwrap();
        toast({
          title: "Subscribed successfully",
        });
        setIsSubscribed(true); // Update state after successful API call
      }
    } catch (error) {
      console.error('Error during subscription:', error);
      toast({
        variant: "destructive",
        title: "An error occurred. Please try again.",
      });
    }
  };

  const handleLike = async () => {
    if (!authStatus) {
      toast({ variant: "destructive", title: "Please log in to like this video" });
      return;
    }

    if (hasLiked) {
      await dispatch(removeLikeVideo({ videoId: id, userId })).unwrap();
      toast({ title: "Removed From Liked Videos" });
    } else {
      await dispatch(likeVideo({ videoId: id, userId })).unwrap();
      toast({ title: "Added To Liked Videos" });
    }
    setHasLiked(!hasLiked);
  };

  // Show the previous UI until the video finishes loading
  return (
    <div className="bg-white min-h-screen flex flex-wrap">
      <div className="container max-w-[900px] px-4 py-6 mt-3 ml-3">
        <div className="flex flex-col xl:flex-row gap-6">
          <div className="flex-1">
            {/* Video Player */}
            {videoLoading ? (
              <div className="w-full h-[400px] flex items-center justify-center bg-gray-200">
                <p>Loading video...</p>
              </div>
            ) : (
              <CustomVideoPlayer src={videoData.videoFile} />
            )}

            <h1 className="mt-4 text-2xl font-semibold">{videoData?.title}</h1>
            <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <Link to={`/Channel/${videoData?.channelId?._id}`} className="flex items-center gap-2 hover:text-black">
                  <img
                    className="w-10 h-10 rounded-full"
                    src={videoData?.channelId?.avatar}
                    alt="Channel Avatar"
                  />
                  <div className='flex flex-col w-32'>
                    <span className="font-medium">{videoData.channelId.name}</span>
                    {subscribers > 0 && (
                      <span className="font-medium">
                        {subscribers} {subscribers === 1 ? 'Subscriber' : 'Subscribers'}
                      </span>
                    )}
                  </div>
                </Link>
                <button
                  onClick={handleSubscribe}
                  className={`text-white w-28 p-2 ml-3 rounded-full px-4 ${isSubscribed ? 'bg-gray-500' : 'bg-black'
                    }`}
                >
                  {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                </button>
              </div>
              <div className="flex items-center justify-between rounded-full w-[90px] bg-gray-200 mr-2">
                <button onClick={handleLike} className="flex items-center  text-black p-2 rounded-full hover:bg-gray-300">
                  <IoMdThumbsUp className={`text-2xl ${hasLiked ? 'text-blue-500' : 'text-black'}`} />
                  {likesCount > 0 && <span>{likesCount}</span>}
                </button>
                <button className="flex items-center  text-black p-2 rounded-full hover:bg-gray-300">
                  <IoMdThumbsDown className="text-2xl text-black" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-100 rounded shadow-sm">
          <div className="flex items-center gap-3">
            <span>{videoData?.views} views</span>
            <span>{formatDate(videoData?.createdAt)}</span>
          </div>
          <p className="text-sm text-gray-700">{videoData?.description}</p>
        </div>

        <Comments videoId={id} />
      </div>

      <div className="w-full xl:w-96 mt-8">
        {/* Recommendations stay visible */}
        <Recommendation
          currentVideoTags={videoData?.tags}
          currentVideoId={videoData?._id}
        />
      </div>
    </div>
  );
}

export default Video;
