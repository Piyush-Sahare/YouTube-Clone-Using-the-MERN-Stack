// backend/controllers/commentsController.js
import Comment from '../models/Comment.js';

// Get all comments for a video
export const getCommentsByVideoId = async (req, res) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId });
    res.status(200).json({ data: comments });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments' });
  }
};

// Add a comment
export const addComment = async (req, res) => {
  //console.log(req);
  const { comment } = req.body;
  try {
    const newComment = new Comment({
      text: comment,
      userName: req.user.name,  
      userId :req.user._id,
      userAvatar: req.user.avatar,
      videoId: req.params.videoId,
    });
    await newComment.save();
    res.status(201).json({ data: newComment });
  } catch (error) {
    console.error('Error adding comment:', error); 
    res.status(500).json({ message: 'Error adding comment' });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    //console.log("user",req.user);
    //console.log("comment",comment);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if the current user is the owner of the comment
    if (comment.userId.toString() !== req.user.id) {
      //console.log(req.user)
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    console.log("error2:",error);
    res.status(500).json({ message: 'Error deleting comment' });
  }
};

// Update a comment
export const updateComment = async (req, res) => {
  try {
    const { newComment } = req.body;
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this comment' });
    }

    comment.text = newComment;
    await comment.save();

    res.status(200).json({ data: comment });
  } catch (error) {
    console.log("error2:",error);
    res.status(500).json({ message: 'Error updating comment' });
  }
};
