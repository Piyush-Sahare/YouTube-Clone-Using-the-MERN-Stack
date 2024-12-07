import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateVideo, fetchVideoById } from '../Redux/slice/videoSlice'; 
import { useToast } from '../hooks/use-toast';
import { HiPlus } from 'react-icons/hi';

function UpdateVideo() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading, error } = useSelector((state) => state.video);
  const video = useSelector((state) => state.video.video);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    // Fetch the video details on component mount
    dispatch(fetchVideoById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (video) {
      setTitle(video.title);
      setDescription(video.description);
      setTags(video.tags?.join(", ") || "");
    }
  }, [video]);

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleVideoFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);

    if (thumbnail) formData.append('thumbnail', thumbnail);
    if (videoFile) formData.append('videoFile', videoFile);

    try {
      setLoader(true);
      await dispatch(updateVideo({ id, formData })).unwrap();
      toast({
        title: "Video Updated Successfully",
      });
      dispatch(fetchVideoById(id))
      setLoader(false);
      navigate("/your_channel");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: error.message,
      });
      console.log(error.message);
      setLoader(false);

    }
  };

  if (loading) {
    return (
      <div className="text-center my-44">
        <div className="p-4 text-center">
          <div role="status">
            <span>Your Video is Updating...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-left">
      <form onSubmit={handleSubmit} className="p-4 md:p-5 w-[800px]">
        <div className="grid gap-4 mb-4 grid-cols-2 ">
          <div className="col-span-2  ">
            <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="Enter video title"
              required
            />
          </div>
          <div className="col-span-2">
            <label htmlFor="thumbnail" className="block mb-2 text-sm font-medium text-gray-900">Thumbnail</label>
            <input
              type="file"
              name="thumbnail"
              id="thumbnail"
              onChange={handleThumbnailChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            />
          </div>
          <div className="col-span-2">
            <label htmlFor="videoFile" className="block mb-2 text-sm font-medium text-gray-900">Video</label>
            <input
              type="file"
              name="videoFile"
              id="videoFile"
              onChange={handleVideoFileChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            />
          </div>
          <div className="col-span-2">
            <label htmlFor="tags" className="block mb-2 text-sm font-medium text-gray-900">Tags</label>
            <input
              type="text"
              name="tags"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="Comma-separated tags, e.g., tech, music"
              required
            />
          </div>
          <div className="col-span-2">
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">Description</label>
            <textarea
              id="description"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter video description"
              required
            ></textarea>
          </div>
        </div>
        <button
          type="submit"
          className="text-white inline-flex items-center bg-gray-700 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          <HiPlus size={20} color="currentColor" className="mr-2" />
          Update Video
        </button>
      </form>
    </div>
  );
}

export default UpdateVideo;
