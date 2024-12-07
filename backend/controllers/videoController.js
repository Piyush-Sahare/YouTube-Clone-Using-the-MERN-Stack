import { Video } from "../models/videoModel.js";
import { Channel } from "../models/channelModel.js";
import { newUser } from "../models/accountModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Tag } from "../models/tagsModel.js";
import mongoose from "mongoose";

// Upload a new video
export const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description, tags } = req.body;
  const thumbnailFile = req.files?.thumbnail?.[0];
  const videoFile = req.files?.videoFile?.[0];

  if (!title || !description || !thumbnailFile || !videoFile) {
    throw new ApiError(400, "All fields are required, including thumbnail and video files");
  }

  // Upload to Cloudinary
  const [thumbnailFilePath, videoFilePath] = await Promise.all([
    uploadOnCloudinary(thumbnailFile.path),
    uploadOnCloudinary(videoFile.path),
  ]);

  if (!thumbnailFilePath || !videoFilePath) {
    throw new ApiError(400, "File upload failed");
  }

  // Handle tags
  const tagArray = tags ? tags.split(",").map((tag) => tag.trim().toLowerCase()) : [];
  for (const tagName of tagArray) {
    const existingTag = await Tag.findOne({ name: tagName });
    if (!existingTag) await Tag.create({ name: tagName });
  }

  // Create video
  const video = await Video.create({
    title,
    description,
    thumbnail: thumbnailFilePath.url,
    videoFile: videoFilePath.url,
    owner: req.user._id,
    channelId: req.user.channelId,
    views: 0,
    tags: tagArray,
  });

  // Update the channel's video list
  const channel = await Channel.findById(req.user.channelId);
  if (!channel) throw new ApiError(404, "Channel not found");

  channel.videos.push(video._id);
  await channel.save();

  res.status(201).json(new ApiResponse(201, video, "Video published successfully"));
});

// Get all videos
export const getAllVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find()
    .populate("channelId")
    .populate("owner", "-password");
  return res.status(200).json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

// Get all videos by a user
export const getAllUserVideos = asyncHandler(async (req, res) => {
  const { owner } = req.params;
  if (!owner) throw new ApiError(400, "Owner ID is required");

  const userVideos = await Video.find({ owner })
    .populate("channelId")
    .populate("owner", "-password");
     //console.log(userVideos);
  return res.status(200).json(new ApiResponse(200, userVideos, "User videos fetched successfully"));
});

// Delete a video by ID
export const deleteVideoById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const video = await Video.findById(id);
  if (!video) throw new ApiError(404, "Video not found");

  if (video.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this video");
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Remove video from Channel's videos array
    await Channel.updateOne({ _id: video.channelId }, { $pull: { videos: video._id } }, { session });

    // Remove video ID from likes array of all users who liked this video
    await newUser.updateMany(
      { likes: video._id }, 
      { $pull: { likes: video._id } }, 
      { session }
    );

    // Delete the video
    await Video.findByIdAndDelete(id, { session });

    await session.commitTransaction();
    res.status(200).json(new ApiResponse(200, null, "Video deleted successfully"));
  } catch (error) {
    await session.abortTransaction();
    throw new ApiError(500, "Error deleting video");
  } finally {
    session.endSession();
  }
});


// Get video data by ID
export const VideoDataById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const video = await Video.findById(id)
    .populate("owner", "-password")
    .populate("channelId");

  if (!video) throw new ApiError(404, "Video not found");

  return res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"));
});

// Increment video views
export const viewsIncrement = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const video = await Video.findById(id);
  if (!video) throw new ApiError(404, "Video not found");

  video.views += 1;
  await video.save();

  return res.status(200).json(new ApiResponse(200, video, "Video views updated"));
});

// Like a video
export const likeVideo = asyncHandler(async (req, res) => {
  const { videoId, userId } = req.body;

  const [video, user] = await Promise.all([
    Video.findById(videoId),
    newUser.findById(userId),
  ]);

  if (!video || !user) throw new ApiError(404, "Video or User not found");

  if (!video.likes.includes(userId)) {
    video.likes.push(userId);
    await video.save();
  }

  if (!user.likes.includes(videoId)) {
    user.likes.push(videoId);
    await user.save();
  }

  res.status(200).json(new ApiResponse(200, null, "Video liked successfully"));
});

// Unlike a video
export const removeLikeVideo = asyncHandler(async (req, res) => {
  const { videoId, userId } = req.body;

  const [video, user] = await Promise.all([
    Video.findById(videoId),
    newUser.findById(userId),
  ]);

  if (!video || !user) throw new ApiError(404, "Video or User not found");

  video.likes = video.likes.filter((id) => id.toString() !== userId);
  user.likes = user.likes.filter((id) => id.toString() !== videoId);

  await Promise.all([video.save(), user.save()]);

  res.status(200).json(new ApiResponse(200, null, "Video unliked successfully"));
});

// Update video details
export const updateVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, tags } = req.body;

  const video = await Video.findById(id);
  if (!video) throw new ApiError(404, "Video not found");

  if (title) video.title = title;
  if (description) video.description = description;

  if (req.files?.thumbnail?.[0]) {
    const thumbnailPath = await uploadOnCloudinary(req.files.thumbnail[0].path);
    video.thumbnail = thumbnailPath.url;
  }

  if (req.files?.videoFile?.[0]) {
    const videoFilePath = await uploadOnCloudinary(req.files.videoFile[0].path);
    video.videoFile = videoFilePath.url;
  }

  if (tags) {
    video.tags = tags.split(",").map((tag) => tag.trim().toLowerCase());
  }

  await video.save();
  res.status(200).json(new ApiResponse(200, video, "Video updated successfully"));
});
