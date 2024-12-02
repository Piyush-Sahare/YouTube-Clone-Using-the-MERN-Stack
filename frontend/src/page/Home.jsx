// //frontend/src/page/Home.jsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllVideos } from '../Redux/slice/videoSlice';

function Home() {
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const { videos } = useSelector((state) => state.video);
  console.log("videos", videos);
  // Initialize state to store channel data for each video
  const [videoChannels, setVideoChannels] = useState({});

  // Fetch videos initially
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        dispatch(fetchAllVideos());
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };
    fetchVideos();
  }, [dispatch]);

  // Fetch the channel for each video once the videos are loaded
  useEffect(() => {
    if (videos.length > 0) {
      const fetchChannels = async () => {
        // Iterate over each video and fetch the corresponding channel
        for (const video of videos) {
          try {
            const response = await axios.get(`/api/v1/channel/data/${video.channelId}`);
            // Store channel data in videoChannels state using video ID as the key
            setVideoChannels((prevChannels) => ({
              ...prevChannels,
              [video._id]: response.data.data,
            }));
          } catch (error) {
            console.error('Error fetching channel data:', error);
          }
        }
      };
      fetchChannels();
    }
  }, [videos]);
  function formatDate(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMilliseconds = now - date;
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInYears > 0) {
      return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
    }
    if (diffInMonths > 0) {
      return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    }
    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    if (diffInMinutes > 0) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }
    return `${diffInSeconds} second${diffInSeconds > 1 ? 's' : ''} ago`;
  }

  return loader ? (
    <div className="text-center my-72">
      <div className="p-4 text-center">
        <div role="status">
          <span className="">Loading...</span>
        </div>
      </div>
    </div>
  ) : (
    <>
      <div className="w-full ml-0 lg:mt-8 bg-white grid grid-cols-1 px-8 pt-6 xl:grid-cols-3 xl:gap-4">
        <div className=" mb-4 col-span-full xl:mb-2">
          <section>
            <div className="container mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <div key={video._id} className="bg-white rounded-lg  max-w-[380px]">
                    <div className="relative">
                      <Link to={`/watch/${video._id}`}>
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          //className="w-full h-48 object-cover rounded-t-lg"
                          className="w-full h-48 object-cover rounded-md"
                        />
                      </Link>
                    </div>
                    <div className="p-4 flex">
                      {videoChannels[video._id] && (
                        <img
                          src={videoChannels[video._id].avatar}
                          alt={videoChannels[video._id].name}
                          className="w-10 h-10 rounded-full mr-4"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-md font-semibold text-gray-800 max-w-full overflow-hidden">
                          <Link to={`/watch/${video._id}`} className="hover:underline">
                            {video.title}
                          </Link>
                        </h3>
                        {videoChannels[video._id] && (
                          <h4 className="text-sm text-gray-500">{videoChannels[video._id].name}</h4>
                        )}
                        <div className="mt-2 text-sm text-gray-500 flex  items-center">
                          <span>{video.views} views</span>
                          <span className='ml-2'>{formatDate(video.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Home;
