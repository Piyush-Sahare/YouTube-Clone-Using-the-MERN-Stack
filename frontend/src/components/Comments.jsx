// frontend/src/components/Comments.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCommentsByVideoId, deleteComment, updateComment, addComment } from '../Redux/slice/commentsSlice';
import { FaUserCircle } from 'react-icons/fa';
import { useToast } from '../hooks/use-toast';

// Comment Component: Represents a single comment with options to edit or delete
const Comment = ({ comment, videoId }) => {
  const [isEditing, setIsEditing] = useState(false);  
  const [newComment, setNewComment] = useState(comment.text);  
  const [menuVisible, setMenuVisible] = useState(false);  
  const { toast } = useToast() 
  const dispatch = useDispatch();

  // Current logged-in user from Redux state
  const currentUser = useSelector((state) => state.auth.user);

  // Handle comment edit
  const handleEdit = () => {
    dispatch(updateComment({ videoId, commentId: comment._id, newComment }))
      .then(() => {
        setIsEditing(false);  // Turn off editing mode after successful update
      })
      .catch((error) => {
        console.error('Error updating comment:', error);
      });
  };

  // Handle comment deletion
  const handleDelete = () => {
    dispatch(deleteComment({ videoId, commentId: comment._id }))
      .catch((error) => {
        console.error('Error deleting comment:', error);
      });
  };

  // Toggle visibility of the options menu
  const toggleMenu = () => {
    setMenuVisible((prev) => !prev);  // Toggle between showing and hiding the menu
  };

  return (
    <div className="flex items-start gap-4 border-b p-4">
      <div>
        {/* Display the user's avatar or default icon if avatar is not available */}
        <img className="w-10 h-10 rounded-full" src={comment.userAvatar || FaUserCircle} alt="User Avatar" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <span className="font-semibold">{comment.userName}</span>
          {/* Show edit and delete options if the current user is the author of the comment */}
          {currentUser && currentUser._id === comment.userId && (
            <div className="relative">
              <button onClick={toggleMenu} className="text-gray-500">...</button>
              {menuVisible && (
                <div className="absolute right-0 bg-white border rounded shadow p-2">
                  {/* If not editing, show options to edit or delete */}
                  {!isEditing ? (
                    <>
                      <button onClick={() => setIsEditing(true)} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Edit</button>
                      <button onClick={handleDelete} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Delete</button>
                    </>
                  ) : (
                    // If editing, show the "Save" button to save changes
                    <button onClick={handleEdit} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Save</button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        {/* If in editing mode, show input field to modify comment */}
        {isEditing ? (
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}  // Update the comment text as user types
            className="border rounded w-full"
          />
        ) : (
          // Display the comment text when not editing
          <p>{comment.text}</p>
        )}
      </div>
    </div>
  );
};

// Comments Component: Handles fetching and rendering all comments for a specific video
const Comments = ({ videoId }) => {
  const dispatch = useDispatch();

  // Redux state that holds all comments for the current video
  const comments = useSelector((state) => state.comments.comments);

  const [commentText, setCommentText] = useState('');  // State to store the new comment being typed

  // Fetch comments when the component mounts or videoId changes
  useEffect(() => {
    dispatch(fetchCommentsByVideoId(videoId));
  }, [videoId, dispatch]);

  // Handle new comment submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Only dispatch if there is text in the comment box
    if (commentText) {
      dispatch(addComment({ videoId, comment: commentText }))
        .then(() => {
          setCommentText(''); // Clear input after successful submission
        })
        .catch((error) => {
          console.error('Error adding comment:', error);
        });
    }
  };
  

  return (
    <div>
      {/* Header for the comments section */}
      <h3 className="text-lg font-semibold mb-4">Comments</h3>
      {/* Form to add a new comment */}
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}  // Update the state with the current input value
          placeholder="Add a comment..."
          className="border rounded w-full p-2"
        />
        <div className="mt-2 text-right">
          <button type="submit" className="bg-black text-white p-2 px-5 rounded-full">Submit</button>
        </div>
      </form>
      {/* Map over the comments array and render each Comment component */}
      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment} videoId={videoId} />
      ))}
    </div>
  );
};

export default Comments;
