//frontend/src/components/Allvideo.jsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { TrashIcon } from '@heroicons/react/24/solid';

// user all videos

function AllVideo() {
  const userdata = useSelector((state) => state.auth.user);
  const [videos, setVideos] = useState([]);
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoader(true)
        const response = await axios.get(`/api/v1/videos/allUserVideo/${userdata._id}`);
        setVideos(response.data.data);
        setLoader(false)
      } catch (error) {
        console.error('Error fetching videos:', error);
        setLoader(false)
      }
    };

    fetchVideos();
  }, [userdata._id]);

  const handleDelete = async (videoId) => {
    if (confirm('Are you sure you want to delete this video?')) {
      // console.log(videoId);
      try {
        setLoader(true)
        await axios.delete(`/api/v1/videos/delete/${videoId}`);
        setVideos(videos.filter(video => video._id !== videoId));
        setLoader(false)
        alert(" Video deleted Successfully ! ")
      } catch (error) {
        console.error('Error deleting video:', error);
      }
    }
  };

  return (
    loader ?
      <div className="text-center  my-44 ">
        <div className="p-4 text-center">
          <div role="status">

            <span className="">Loading...</span>
          </div>
        </div>
      </div>
      :
      <div className="lg:mt-8 bg-white grid grid-cols-1 px-8 pt-6 xl:grid-cols-3 xl:gap-4">
        <div className="mb-4 col-span-full xl:mb-2">
          <section>
            <div className="container">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {videos.map((video) => (
                  <div key={video._id}>
                    <div className="relative">
                      <Link to={`/watch/${video._id}`}>
                        <img src={video.thumbnail} alt={video.title} className="w-80 h-40" />
                      </Link>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <div>
                        <h3 className="text-lg font-bold truncate">
                          <Link to={`/watch/${video._id}`}>{video.title}</Link>
                        </h3>
                      </div>
                      <div className="mt-2">
                        <ul className="flex items-center space-x-2">
                          <button
                            type="button"
                            className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center mt-5 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                            onClick={() => handleDelete(video._id)}
                          >
                            <TrashIcon className="w-6 h-6" />
                          </button>
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
  );
}

export default AllVideo;
