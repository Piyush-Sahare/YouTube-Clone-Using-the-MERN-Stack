// frontend/src/page/Home.jsx
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllVideos } from "../Redux/slice/videoSlice";
import { useOutletContext } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
function Home() {
  const dispatch = useDispatch();
  const { videos } = useSelector((state) => state.video);
  const { searchTerm } = useOutletContext();

  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const tagsContainerRef = useRef(null);

  useEffect(() => {
    dispatch(fetchAllVideos());

    const fetchTags = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/tags/getTags");
        const data = await response.json();
        setTags(data);
        setTimeout(updateScrollButtons, 50);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, [dispatch]);

  const updateScrollButtons = () => {
    if (tagsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tagsContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  useEffect(() => {
    const container = tagsContainerRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
    }
    updateScrollButtons();
    return () => {
      if (container) {
        container.removeEventListener("scroll", updateScrollButtons);
      }
    };
  }, [tags]);

  const scrollTags = (direction) => {
    const container = tagsContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleTagClick = (tagName) => {
    setSelectedTag((prevTag) => (prevTag === tagName ? null : tagName));
  };

  const formatDate = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMilliseconds = now - date;
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInYears > 0) return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
    if (diffInMonths > 0) return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
    if (diffInDays > 0) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    if (diffInHours > 0) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    if (diffInMinutes > 0) return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    return `${diffInSeconds} second${diffInSeconds > 1 ? "s" : ""} ago`;
  };

  const filteredVideos = videos.filter(
    (video) =>
      (video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (selectedTag ? video.tags.includes(selectedTag) : true)
  );

  return filteredVideos.length === 0 ? (
    <div className="text-center my-72">
      <span>No videos found.</span>
    </div>
  ) : (
    <div className="w-full ml-0 lg:mt-8 bg-white">
      {/* Render tags */}
      <div className="relative flex items-center px-4 py-2  bg-white">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <button
            onClick={() => scrollTags("left")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white text-black   rounded-full p-4 z-10"
          >
            <IoIosArrowBack />
          </button>
        )}

        {/* Tags Container */}
        <div
          className="tags-container overflow-x-auto whitespace-nowrap scrollbar-hide px-4   bg-white flex gap-2"
          ref={tagsContainerRef}
        >
          {tags.map((tag) => (
            <button
              key={tag._id}
              className={`tag-button py-1 px-2 rounded-lg border ${
                selectedTag === tag.name
                  ? "bg-black text-white"
                  : "bg-gray-200 text-sm text-black font-semibold hover:bg-gray-300"
              }`}
              onClick={() => handleTagClick(tag.name)}
            >
              {tag.name}
            </button>
          ))}
        </div>

        {/* Right Scroll Button */}
        {canScrollRight && (
          <button
            onClick={() => scrollTags("right")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white text-black  rounded-full p-4 z-10"
          >
            <IoIosArrowForward />
          </button>
        )}
      </div>

      {/* Render videos */}
      <div className="grid grid-cols-1 px-4 pt-3 xl:grid-cols-3 xl:gap-4">
        {filteredVideos.map((video) => (
          <div key={video._id} className="bg-white rounded-lg max-w-[380px]">
            <div className="relative">
              <Link to={`/watch/${video._id}`}>
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover rounded-md"
                />
              </Link>
            </div>
            <div className="p-4 flex">
              <img
                src={video.channelId.avatar}
                alt={video.channelId.name}
                className="w-10 h-10 rounded-full mr-4"
              />
              <div className="flex-1">
                <h3 className="text-md font-semibold text-gray-800">
                  <Link to={`/watch/${video._id}`} className="hover:underline">
                    {video.title}
                  </Link>
                </h3>
                <h4 className="text-sm text-gray-500">{video.channelId.name}</h4>
                <div className="mt-2 text-sm text-gray-500 flex items-center">
                  <span>{video.views} views</span>
                  <span className="ml-2">{formatDate(video.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;

