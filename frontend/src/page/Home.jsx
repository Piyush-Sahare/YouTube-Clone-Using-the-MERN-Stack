//frontend/src/page/Home.jsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {useSelector,useDispatch } from 'react-redux';
import { fetchAllVideos } from '../Redux/slice/videoSlice';
function Home() {
  const [loader, setLoader] = useState(false)
  const dispatch = useDispatch();
  const { videos} = useSelector((state) => state.video);
  //console.log("videos",videos);
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        dispatch(fetchAllVideos());
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, [videos]);
  

  return (
    loader ?  
    <div className="text-center  my-72 ">
    <div className="p-4 text-center">
    <div role="status">
  
        <span className="">Loading...</span>
    </div>
    </div>
    </div>
    :
    <>
      <div className="lg:mt-8 bg-white grid grid-cols-1 px-8 pt-6 xl:grid-cols-3 xl:gap-4">
        <div className="mb-4 col-span-full xl:mb-2">
          <section>
            <div className="container">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {videos.map((video) => (
                  <div key={video._id}>
                    <div className="relative">
                      <Link to={`/watch/${video._id}`}>
                        <img src={video.thumbnail} alt={video.title} 
                        className="w-80 h-40" 
                        />
                      </Link>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <div>
                        <h3 className="text-lg font-bold truncate">
                          <Link to={`/watch/${video._id}`}>{video.title}</Link>
                        </h3>
                      </div>
                      <div className="mt-2">                     
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

