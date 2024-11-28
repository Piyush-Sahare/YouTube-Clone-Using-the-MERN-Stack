//frontend/src/page/History.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function History() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('/api/v1/account/history');
        setHistory(response.data.data); // Assuming response.data contains the history array
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []); 
  return (
    <div className="lg:mt-8 bg-white grid grid-cols-1 px-8 pt-6 xl:grid-cols-3 xl:gap-4">
      <div className="mb-4 col-span-full xl:mb-2">
        <div className=' text-3xl font-black text-gray-900'>Watch history</div>
        <br />
        {isLoading ? (
          <div className="text-center my-72">
            <div className="p-4 text-center">
              <div role="status">
            
                <span className="">Loading...</span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            { history.length > 0  ? (
              <section>
              <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {history.map((video) => (
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
