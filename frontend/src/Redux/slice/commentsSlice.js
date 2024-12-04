// frontend/src/Redux/slice/commentsSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunks for fetching, adding, updating, and deleting comments
export const fetchCommentsByVideoId = createAsyncThunk(
  'comments/fetchCommentsByVideoId',
  async (videoId) => {
    const response = await axios.get(`/api/v1/comments/video/${videoId}`);
    return response.data.data;
  }
);

export const addComment = createAsyncThunk(
  'comments/addComment',
  async ({ videoId, comment }) => {
    const response = await axios.post(`/api/v1/comments/video/${videoId}`, { comment });
    return response.data.data;
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async ({ videoId, commentId }) => {
    await axios.delete(`/api/v1/comments/${commentId}`);
    return { videoId, commentId };
  }
);

export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ videoId, commentId, newComment }) => {
    const response = await axios.put(`/api/v1/comments/${commentId}`, { newComment });
    return { videoId, commentId, updatedComment: response.data.data };
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsByVideoId.fulfilled, (state, action) => {
        state.comments = action.payload;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.payload.commentId
        );
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(
          (comment) => comment._id === action.payload.commentId
        );
        if (index !== -1) {
          state.comments[index] = action.payload.updatedComment;
        }
      });
  },
});

export default commentsSlice.reducer;
