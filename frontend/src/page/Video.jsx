import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchVideoById, incrementView, likeVideo, removeLikeVideo } from '../Redux/slice/videoSlice';
import { useToast } from '../hooks/use-toast';
import CustomVideoPlayer from '../components/CustomVideoPlayer';
import Comments from '../components/Comments';
import Recommendation from '../components/Recommendation';
import { IoMdThumbsUp } from "react-icons/io";
import { IoMdThumbsDown } from "react-icons/io";
import { subscribeChannel, unsubscribeChannel } from '../Redux/slice/channelSlice';

function Video() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const videoData = useSelector((state) => state.video.video);
  //console.log("data",videoData);
  const authStatus = useSelector((state) => state.auth.status);
  const userId = useSelector((state) => state.auth.user?._id);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const likesCount = videoData?.likes?.length || 0;
  const subscribers = videoData?.channelId?.subscribers?.length || 0;
  const [hasLiked, setHasLiked] = useState(false);
  

  
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
  }, [id, videoData]);

  useEffect(() => {
    const incrementViewCount = async () => {
      try {
        await dispatch(incrementView(id)).unwrap();
      } catch (error) {
        console.error('Error incrementing view count:', error);
      }
    };
    incrementViewCount();
  }, [id]);

  


  useEffect(() => {
    if (videoData &&  userId) {
      setIsSubscribed(videoData.channelId.subscribers.includes(userId));
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
        await dispatch(unsubscribeChannel(videoData.channelId._id));
        
        toast({
          title: "Unsubscribed successfully",
        });
      } else {
        // Subscribe
        await dispatch(subscribeChannel(videoData.channelId._id));
        
        toast({
          title: "Subscribed successfully",
        });
        setIsSubscribed(!isSubscribed);
      }
      
    } catch (error) {
      console.error('Error during subscription:', error);
      toast({
        variant: "destructive",
        title: "An error occurred. Please try again.",
      });
    }
  };

  useEffect(() => {
    if (videoData && userId) {
      setHasLiked(videoData.likes.includes(userId));
    }
  }, [videoData, userId]);

  const handleLike = () => {
    if (!authStatus) {
      toast({
        variant: "destructive",
        title: "Please log in to like this video",
      });
      return;
    }
  
    if (hasLiked) {
      dispatch(removeLikeVideo({ videoId: id, userId }));
      toast({
        title: "Removed From Liked Videos",
      });
    } else {
      dispatch(likeVideo({ videoId: id, userId }));
      toast({
        title: "Added To Liked Videos",
      });
    }
    setHasLiked(!hasLiked);
  };
  



  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!videoData) return <div>No video data found.</div>;

  return (
    <div className="bg-white min-h-screen flex flex-wrap">
      {/* Main Content */}
      <div className="container max-w-[900px] px-4 py-6 mt-3 ml-3">
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Video Player Section */}
          <div className="flex-1">
            <CustomVideoPlayer src={videoData.videoFile} />
            <h1 className="mt-4 text-2xl font-semibold">{videoData.title}</h1>

            {/* Video Metadata */}
            <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <Link
                  to={`/Channel/${videoData.channelId._id}`}
                  className="flex items-center gap-2 hover:text-black"
                >
                  <img
                    className="w-10 h-10 rounded-full"
                    src={videoData.channelId.avatar}
                    alt="Channel Avatar"
                  />
                    
                    <div className='flex flex-col w-20'>
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
                  {/* Like Button */}
                  <button
                    onClick={handleLike}
                    className="flex items-center  text-black p-2 rounded-full  hover:bg-gray-300"
                  >
                    <IoMdThumbsUp className={`text-2xl ${hasLiked ? 'text-blue-500' : 'text-black'}`} />
  
                    {likesCount > 0 && <span>{likesCount}</span>}
                  </button>
                  <button className="flex items-center  text-black p-2 rounded-full hover:bg-gray-300">
                    <IoMdThumbsDown className="text-2xl text-black'" />
                  </button>
                </div>
              
            </div>
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

      {/* Suggested Videos */}
      <div className="w-full xl:w-96 mt-8">
        <Recommendation
          currentVideoTags={videoData.tags}
          currentVideoId={videoData._id}
        />
      </div>
    </div>
  );
}

export default Video;
