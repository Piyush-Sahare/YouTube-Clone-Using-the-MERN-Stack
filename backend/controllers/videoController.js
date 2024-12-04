//backend/controllers/videoController.js
import { Video } from "../models/videoModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {Tag} from "../models/tagsModel.js";

//video upload
const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description, tags } = req.body;
  const thumbnailFile = req.files?.thumbnail?.[0];
  const videoFile = req.files?.videoFile?.[0];

  // Validate required fields
  if (!title || !description || !thumbnailFile || !videoFile) {
    throw new ApiError(400, "All fields are required, including thumbnail and video files");
  }

  // Upload files to Cloudinary
  const thumbnailFilePath = await uploadOnCloudinary(thumbnailFile.path);
  const videoFilePath = await uploadOnCloudinary(videoFile.path);

  if (!thumbnailFilePath || !videoFilePath) {
    throw new ApiError(400, "File upload problem");
  }

  // Process tags
  const tagArray = tags ? tags.split(',').map(tag => tag.trim().toLowerCase()) : [];

  // Save tags to the Tags collection
  for (const tagName of tagArray) {
    const existingTag = await Tag.findOne({ name: tagName });
    if (!existingTag) {
      await Tag.create({ name: tagName }); // Create new tag if it doesn't exist
    }
  }

  // Create video document
  const video = await Video.create({
    title,
    description,
    thumbnail: thumbnailFilePath.url,
    videoFile: videoFilePath.url,
    owner: req.user._id,
    channelId: req.user.channelId,
    views: 0, // Initialize views to 0
    tags: tagArray // Save tags in the Video document
  });

  // Respond with success
  return res.status(201).json(new ApiResponse(201, video, "Video published successfully"));
});


//all video find

const getAllVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find().populate('channelId').populate('owner', '-password'); // Fetch all videos from the Video collection
  if (videos.length === 0) {
    // Return 200 status with empty array if no videos are found
    return res.status(200).json(new ApiResponse(200, [], "No videos found"));
  }
  return res.status(200).json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

//all User video find-

const getAllUserVideos = asyncHandler(async (req, res) => {
  const { owner } = req.params; // Extract the owner ID from the request parameters

  if (!owner) {
    throw new ApiError(400, "Owner ID is required");
  }

  const userVideos = await Video.find({ owner }).populate('channelId').populate('owner', '-password'); // Fetch all videos that match the owner's ID

  // if (!userVideos.length) {
  //   return res.status(404).json(new ApiResponse(404, null, "No videos found for this user"));
  // }
  if (userVideos.length === 0) {
    // Return 200 status with empty array if no videos are found for the user
    return res.status(200).json(new ApiResponse(200, [], "No videos found for this user"));
  }

  return res.status(200).json(new ApiResponse(200, userVideos, "User videos fetched successfully"));
});

//delete video by id

const deleteVideoById = asyncHandler(async (req, res) => {
  const { id } = req.params; // Extract the video ID from the request parameters
  const userId = req.user._id; // Get the ID of the logged-in user

  const video = await Video.findById(id);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // Check if the logged-in user is the owner of the video
  if (video.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this video");
  }

  await Video.findByIdAndDelete(id); // Delete the video from the database

  return res.status(200).json(new ApiResponse(200, null, "Video deleted successfully"));
});

//video data by id

const VideoDataById = asyncHandler(async (req, res) => {
  const { id } = req.params; // Extract the video ID from the request parameters

  const video = await Video.findById(id).populate('channelId').populate('owner', '-password'); // Find the video by ID

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

//   await video.incrementViews();
  return res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"));
});

//views increment

const viewsIncrement = asyncHandler(async(req , res)=>{

    const { id } = req.params; // Extract the video ID from the request parameters

    const video = await Video.findById(id); // Find the video by ID
  
    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    await video.incrementViews();

    return res.status(200).json(new ApiResponse(200, video, "Video Views Updated"));

})

export {
  publishAVideo,
  getAllVideos,
  getAllUserVideos,
  deleteVideoById,
  VideoDataById,
  viewsIncrement
};
