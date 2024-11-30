// backend/controllers/channelController.js
import { Channel } from "../models/channelModel.js";
import { newUser } from "../models/accountModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js"; // Middleware to handle asynchronous errors
import { ApiResponse } from "../utils/ApiResponse.js"; // Utility for consistent API responses
import { ApiError } from "../utils/ApiError.js";

// create channel 
export const createChannel = async (req, res) => {
  const { name, handle } = req.body;
  const userId = req.user._id; // Extracted from middleware, assuming user is authenticated

  try {
    // Check if user already has a channel
    const user = await newUser.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.hasChannel)
      return res.status(400).json({ error: "User already has a channel" });

    // Create a new channel
    const channel = new Channel({
      name,
      handle,
      owner: userId,
    });

    const savedChannel = await channel.save();

    // Update user with channel details
    user.hasChannel = true;
    user.channelId = savedChannel._id;
    await user.save();

    res.status(200).json({ message: "Channel created successfully", channel: savedChannel });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while creating channel" });
  }
};


// get chanel Data 
export const getChannel = async (req, res) => {
  const { id } = req.params;

  try {
    const channel = await Channel.findById(id).populate("owner", "-password ");
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    res.status(200).json({ message: "Channel fetched successfully", data: channel });
  } catch (err) {
    console.error("Error fetching channel:", err.message);
    res.status(500).json({ error: "Server error while fetching channel data" });
  }
};
// update channel 
export const updateChannel = asyncHandler(async (req, res) => {
  const { name, handle, description } = req.body;

  // Upload banner to Cloudinary if provided
  let bannerName;
  if (req.file) {
      const bannerLocalPath = req.file.path;
      bannerName = await uploadOnCloudinary(bannerLocalPath);
  }

  // Prepare the data to update
  const updateData = {};
  if (name) updateData.name = name;
  if (handle) updateData.handle = handle;
  if (description) updateData.description = description;
  if (bannerName) {
      updateData.banner = bannerName.url; // Set the new avatar URL if uploaded
  }

  // Update the user document in the database
  const user = await Channel.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true } // Return the updated document
  );

  return res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"));
});



// delete channel
export const deleteChannel = async (req, res) => {
  const channelId = req.params.id; // Channel ID from the request parameter

  try {
    // Find and delete the channel
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // Check if the requesting user owns the channel
    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "You are not authorized to delete this channel" });
    }

    // Delete the channel
    await channel.deleteOne();

    // Update the user's hasChannel and channelID
    const user = await newUser.findById(req.user._id);
    if (user) {
      user.hasChannel = false;
      user.channelId = null;
      await user.save();
    }

    res.status(200).json({ message: "Channel deleted successfully" });
  } catch (err) {
    console.error("Error deleting channel:", err.message);
    res.status(500).json({ error: "Server error while deleting channel" });
  }
}; 