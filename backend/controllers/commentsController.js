import { Comment } from '../models/Comment.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Get all comments for a video
export const getCommentsByVideoId = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ videoId: req.params.videoId });

  res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

// Add a comment
export const addComment = asyncHandler(async (req, res) => {
  const { comment } = req.body;

  if (!comment) {
    throw new ApiError(400, "Comment text is required");
  }

  const newComment = await Comment.create({
    text: comment,
    userName: req.user.name,
    userId: req.user._id,
    userAvatar: req.user.avatar,
    videoId: req.params.videoId,
  });

  res
    .status(201)
    .json(new ApiResponse(201, newComment, "Comment added successfully"));
});

// Delete a comment
export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // Check if the current user is the owner of the comment
  if (comment.userId.toString() !== req.user.id) {
    throw new ApiError(403, "Not authorized to delete this comment");
  }

  await comment.deleteOne();

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

// Update a comment
export const updateComment = asyncHandler(async (req, res) => {
  const { newComment } = req.body;

  if (!newComment) {
    throw new ApiError(400, "Updated comment text is required");
  }

  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.userId.toString() !== req.user.id) {
    throw new ApiError(403, "Not authorized to edit this comment");
  }

  comment.text = newComment;
  await comment.save();

  res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});
