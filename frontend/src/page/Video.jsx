//frontend/src/page/Video.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { addToWatchHistory,} from '../Redux/slice/authSlice';
import { fetchVideoById,incrementView} from '../Redux/slice/videoSlice';

function Video() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const videoData = useSelector((state) => state.video.video);
  const dispatch = useDispatch();
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };
console.log("videodata",videoData);
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
    const IncrementViewCount = async () => {
      try {
        await dispatch(incrementView(id)).unwrap();
        console.log('View count incremented');
      } catch (error) {
        console.error('Error incrementing view count:', error);
      }
    };
    IncrementViewCount();
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

  useEffect(() => {
    if (videoData && videoData.owner) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(`/api/v1/account/userData/${videoData.owner}`);
          setUserData(response.data.data);

        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUser();
    }
  }, [videoData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!videoData) {
    return <div>No video data found.</div>;
  }

  return (
    <div className="lg:mt-8 bg-white grid grid-cols-1 px-8 pt-6 xl:grid-cols-3 xl:gap-4">
      <div className="mb-4 col-span-full xl:mb-2">
        <section className="pb-5 mt-3">
          <div className="container mx-auto">
            <div className="row">
              <div className="col-lg-9 col-xl-9">
                <section>
                  <div className="row">
                    <div className="col">
                      <div className="relative video-wrap" style={{ height: "465px" }}>
                        <video className=" w-full h-full" controls>
                          <source src={videoData.videoFile} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="mt-4">
                  <h1 className="mb-3 text-xl truncate">{videoData.title}</h1>

                  <div>
                    <div className="border-b border-b-gray-100">
                      <ul className="-mb-px flex items-center gap-5 text-sm font-sm">
                        <li>
                          {userData ? (
                            <Link className="inline-flex cursor-pointer items-center gap-3 px-1 py-3 text-black hover:text-gray-700 ">
                              <img
                                className="w-12 h-12 rounded-full"
                                src={userData.avatar}
                                alt="User"
                              />
                              {userData.name}
                            </Link>
                          ) : (
                            <div>Loading user data...</div>
                          )}
                        </li>
                        <li>
                          <Link className="inline-flex cursor-pointer items-center gap-2 px-1 py-3 text-gray-600 hover:text-black" >
                            <FaUserCircle className="h-5 w-5" />
                            Subscribe
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600"> 303k </span>
                          </Link>
                        </li>

                        <li>
                          <Link className="inline-flex cursor-pointer items-center gap-2 px-1 py-3 text-gray-600 hover:text-black">
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600"> {videoData.views} views </span>
                          </Link>
                        </li>
                        <li>
                          <Link className="inline-flex cursor-pointer items-center gap-2 px-1 py-3 text-gray-600 hover:text-black">

                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">{formatDate(videoData.createdAt)}</span>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <p className='truncate'>{videoData.description}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Video;