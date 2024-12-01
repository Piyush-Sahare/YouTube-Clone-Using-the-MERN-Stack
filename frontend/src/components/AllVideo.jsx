// //frontend/src/components/Allvideo.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllUserVideos, deleteVideo,resetUserVideos } from '../Redux/slice/videoSlice';
import { Link } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/24/solid';
import { useToast } from "../hooks/use-toast"
function AllVideo() {
  const dispatch = useDispatch();
  const userdata = useSelector((state) => state.auth.user);
  const videos = useSelector((state) => state.video.userVideos);
  // console.log('userData:', userdata);
  // console.log('Videos from Selector:', videos);
  const loading = useSelector((state) => state.videos?.loading || false);
  const { toast } = useToast()

  useEffect(() => {
    if (userdata?._id) {
      console.log('Fetching videos for user:', userdata._id);
      dispatch(fetchAllUserVideos(userdata._id))
        .unwrap()
        .catch((error) => console.error('Error fetching user videos:', error));
    }

    return () => {
        dispatch(resetUserVideos());
      };
  }, [userdata?._id, dispatch]);
  //console.log("videos:",videos);
  const handleDelete = (videoId) => {
    if (confirm('Are you sure you want to delete this video?')) {
      dispatch(deleteVideo(videoId))
        .unwrap()
        .then(() => {
            toast({
                title: "Video Deleted Successfully",
              });
        })
        .catch((error) => console.error('Error deleting video:', error));
    }
  };

  if (loading) {
    return (
      <div className="text-center my-44">
        <div className="p-4 text-center">
          <div role="status">
            <span>Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
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
                    <h3 className="text-lg font-bold truncate">
                      <Link to={`/watch/${video._id}`}>{video.title}</Link>
                    </h3>
                    <button
                      type="button"
                      className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center mt-5 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                      onClick={() => handleDelete(video._id)}
                    >
                      <TrashIcon className="w-6 h-6" />
                    </button>
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