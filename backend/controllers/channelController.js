import { Channel } from "../models/channelModel.js";
import { newUser } from "../models/accountModel.js";
import { Video } from "../models/videoModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Create channel
export const createChannel = asyncHandler(async (req, res) => {
  const { name, handle } = req.body;
  const userId = req.user._id; // Extracted from middleware

  // Check if user exists and already has a channel
  const user = await newUser.findById(userId);
  if (!user) throw new ApiError(404, "User not found");
  if (user.hasChannel) throw new ApiError(400, "User already has a channel");

  // Set default avatar and banner
  const avatar =
    "https://res.cloudinary.com/dpdwl1tsu/image/upload/v1733578739/egt2sufg3qzyn1ofws9t_xvfn00.jpg";
  const banner =
    "https://res.cloudinary.com/dpdwl1tsu/image/upload/v1733578478/dlekdyn1dep7gevz9zyn.avif";

  // Create a new channel
  const channel = await Channel.create({
    name,
    handle,
    owner: userId,
    avatar,
    banner,
  });

  // Update user details
  user.hasChannel = true;
  user.channelId = channel._id;
  await user.save();

  res
    .status(201)
    .json(new ApiResponse(201, channel, "Channel created successfully"));
});

// Get channel data
export const getChannel = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const channel = await Channel.findById(id).populate("owner", "-password");
  if (!channel) throw new ApiError(404, "Channel not found");

  res
    .status(200)
    .json(new ApiResponse(200, channel, "Channel fetched successfully"));
});

// Update channel
export const updateChannel = asyncHandler(async (req, res) => {
  const { name, handle, description } = req.body;

  // Initialize variables for uploaded files
  let bannerName, avatarName;

  // Upload banner if provided
  if (req.files?.banner) {
    const bannerLocalPath = req.files.banner[0].path;
    bannerName = await uploadOnCloudinary(bannerLocalPath);
  }

  // Upload avatar if provided
  if (req.files?.avatar) {
    const avatarLocalPath = req.files.avatar[0].path;
    avatarName = await uploadOnCloudinary(avatarLocalPath);
  }

  // Prepare update data
  const updateData = {};
  if (name) updateData.name = name;
  if (handle) updateData.handle = handle;
  if (description) updateData.description = description;
  if (bannerName) updateData.banner = bannerName.url;
  if (avatarName) updateData.avatar = avatarName.url;

  const channel = await Channel.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    { new: true }
  );

  if (!channel) throw new ApiError(404, "Channel not found");

  res
    .status(200)
    .json(new ApiResponse(200, channel, "Channel updated successfully"));
});

// Subscribe to a channel
export const subscribeToChannel = asyncHandler(async (req, res) => {
  const channelId = req.params.id;
  const userId = req.user._id;

  const channel = await Channel.findById(channelId);
  if (!channel) throw new ApiError(404, "Channel not found");

  // Check for existing subscription
  if (channel.subscribers.includes(userId))
    throw new ApiError(400, "Already subscribed to this channel");

  channel.subscribers.push(userId);
  await channel.save();

  const user = await newUser.findById(userId);
  user.subscriptions.push(channelId);
  await user.save();

  res
    .status(200)
    .json(new ApiResponse(200, channel, "Subscribed successfully"));
});

// Unsubscribe from a channel
export const unsubscribeFromChannel = asyncHandler(async (req, res) => {
  const channelId = req.params.id;
  const userId = req.user._id;

  const channel = await Channel.findById(channelId);
  if (!channel) throw new ApiError(404, "Channel not found");

  // Check if user is subscribed
  if (!channel.subscribers.includes(userId))
    throw new ApiError(400, "Not subscribed to this channel");

  // Remove subscription
  channel.subscribers = channel.subscribers.filter(
    (subscriber) => subscriber.toString() !== userId.toString()
  );
  await channel.save();

  const user = await newUser.findById(userId);
  user.subscriptions = user.subscriptions.filter(
    (subscription) => subscription.toString() !== channelId.toString()
  );
  await user.save();

  res
    .status(200)
    .json(new ApiResponse(200, channel, "Unsubscribed successfully"));
});

// Delete a channel
export const deleteChannel = asyncHandler(async (req, res) => {
  const channelId = req.params.id;
  const userId = req.user._id;

  const channel = await Channel.findById(channelId).populate("videos");
  if (!channel) throw new ApiError(404, "Channel not found");

  // Authorization check
  if (channel.owner.toString() !== userId.toString())
    throw new ApiError(403, "You are not authorized to delete this channel");

  // Delete all associated videos
  const videoIds = channel.videos.map((video) => video._id);
  await Video.deleteMany({ _id: { $in: videoIds } });

  // Update all users' data
  await newUser.updateMany(
    { subscriptions: channelId },
    { $pull: { subscriptions: channelId } }
  );
 
  await newUser.updateMany(
    { likes: { $in: videoIds } },
    { $pull: { likes: { $in: videoIds } } }
  );

  // Delete the channel itself
  await channel.deleteOne();

  // Update user data
  const user = await newUser.findById(userId);
  if (user) {
    user.hasChannel = false;
    user.channelId = null;
    await user.save();
  }

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Channel and associated data deleted successfully"));
});
