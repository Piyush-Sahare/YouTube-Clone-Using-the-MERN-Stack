// //frontend/src/components/Uploadvideo.jsx
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { HiPlus } from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import { publishVideo } from '../Redux/slice/videoSlice';
import { useToast } from "../hooks/use-toast";
import { useLocation } from "react-router-dom";

function UploadVideo() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [thumbnail, setThumbnail] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [tags, setTags] = useState(""); // New state for tags
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.openModal) {
            setIsModalOpen(true);
        }
    }, [location.state]);

    const handleToggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const navigate = useNavigate();
    const { toast } = useToast();

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
        formData.append('thumbnail', thumbnail);
        formData.append('videoFile', videoFile);
        formData.append('tags', tags); // Add tags to formData

        try {
            setLoader(true);
            await dispatch(publishVideo(formData)).unwrap();
            toast({
                title: "Successfully Video Uploaded",
            });
            setLoader(false);
            navigate("/your_channel");
        } catch (error) {
            console.log("Video Upload error: ", error);
            toast({
                variant: "destructive",
                title: "Something went wrong!",
            });
            setLoader(false);
        }
    };

    return (
        loader ? (
            <div className="text-center my-44">
                <div className="p-4 text-center">
                    <div role="status">
                        <span>Your Video is Uploading...</span>
                    </div>
                </div>
            </div>
        ) : (
            <>
                <div className="text-center">
                    <button
                        onClick={handleToggleModal}
                        type="button"
                        className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 mt-4"
                    >
                        Create
                    </button>
                </div>

                {isModalOpen && (
                    <div id="crud-modal" className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
                        <div className="relative p-4 w-full max-w-xl max-h-full bg-white rounded-lg shadow">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Share Your Video
                                </h3>
                                <button
                                    type="button"
                                    onClick={handleToggleModal}
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                                >
                                    <FiX size={20} color="currentColor" />
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-4 md:p-5">
                                <div className="grid gap-4 mb-4 grid-cols-2">
                                    <div className="col-span-2">
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
                                            required
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
                                            required
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
                                    Upload Video
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </>
        )
    );
}

export default UploadVideo;
