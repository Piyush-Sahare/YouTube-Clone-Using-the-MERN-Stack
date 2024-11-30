// //frontend/src/page/History.jsx
import React, { useEffect ,useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getWatchHistory } from '../Redux/slice/authSlice'; // Import the getWatchHistory action
import { Link } from 'react-router-dom';

function History() {
  const dispatch = useDispatch();
  const { watchHistory, loading, error } = useSelector(state => state.auth); // Get watchHistory from Redux state
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    dispatch(getWatchHistory());
    setIsLoading(false);
  }, [dispatch]);

  return (
    <div className="lg:mt-8 bg-white grid grid-cols-1 px-8 pt-6 xl:grid-cols-3 xl:gap-4">
      <div className="mb-4 col-span-full xl:mb-2">
        <div className='text-3xl font-black text-gray-900'>Watch History</div>
        <br />
        {isLoading ? (
          <div className="text-center my-72">
            <div className="p-4 text-center">
              <div role="status">
                <span className="">Loading...</span>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600">Error fetching history: {error}</div>
        ) : (
          <div>
            {watchHistory.length > 0 ? (
              <section>
                <div className="container">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {watchHistory.map((video) => (
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
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ) : (
              <div>No history available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
