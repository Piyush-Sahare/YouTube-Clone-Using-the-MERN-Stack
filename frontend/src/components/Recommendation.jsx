import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Recommendation({ currentVideoTags, currentVideoId }) {
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const allVideos = useSelector((state) => state.video.videos);

  useEffect(() => {
    if (allVideos && currentVideoTags) {
      // Filter videos with at least one common tag and exclude the current video
      const filteredVideos = allVideos.filter(
        (video) =>
          video._id !== currentVideoId &&
          video.tags.some((tag) => currentVideoTags.includes(tag))
      );
      setRecommendedVideos(filteredVideos);
    }
  }, [allVideos, currentVideoTags, currentVideoId]);

  if (!recommendedVideos.length) {
    return <p>No recommendations available.</p>;
  }

  return (
    <div className="space-y-4 mt-8">
      <h2 className="mb-4 text-lg font-semibold">Up Next</h2>
      {recommendedVideos.map((video) => (
        <Link to={`/watch/${video._id}`} key={video._id} className="flex gap-4">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-32 h-20 rounded-md object-cover"
          />
          <div>
            <h3 className="text-sm font-semibold line-clamp-2">{video.title}</h3>
            <p className="text-xs text-gray-500">
              {video.channelId.name} · {video.views} views
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Recommendation;
