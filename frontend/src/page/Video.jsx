import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

function Video() {
  const { id } = useParams();
  const [videoData, setVideoData] = useState(id);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await axios.get(`/api/v1/videos/videoData/${id}`);
        setVideoData(response.data.data);
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
        await axios.put(`/api/v1/videos/incrementView/${id}`);
        console.log('View count incremented');
      } catch (error) {
        console.error('Error incrementing view count:', error);
      }
    };
    incrementViewCount();
  }, [id]);

  useEffect(() => {
    const addToWatchHistory = async () => {
      try {
        await axios.put(`/api/v1/account/addToHistory/${id}`);
        console.log('addToWatchHistory');
      } catch (error) {
        console.error('Error addToWatchHistory:', error);
      }
    };
    addToWatchHistory();
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
                        <source src={videoData.videoFile} type="video/mp4"/>
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
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                              <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 003.256.508 3.5 3.5 0 006.972 0 32.903 32.903 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zM8.05 14.943a33.54 33.54 0 003.9 0 2 2 0 01-3.9 0z" clipRule="evenodd" />
                            </svg>
                            Subscribe
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600"> 303k </span>
                          </Link>
                        </li>
                        <li>
                          <Link className="inline-flex cursor-pointer items-center gap-2 px-1 py-3 text-gray-600 hover:text-black">
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600"> 30k </span>
                          </Link>
                        </li>
                        <li>
                          <Link className="inline-flex cursor-pointer items-center gap-2 px-1 py-3 text-gray-600 hover:text-black">
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600"> {videoData.views} views </span> 
                          </Link>
                        </li>
                        <li>
                          <Link className="inline-flex cursor-pointer items-center gap-2 px-1 py-3 text-gray-600 hover:text-black">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                            </svg>
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
