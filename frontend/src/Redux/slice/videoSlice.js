// frontend/src/Redux/slice/videoSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  videos: [],
  userVideos: [],
  video: null,
  loading: false,
  error: null,
  status: false,
};

// Fetch all videos
export const fetchAllVideos = createAsyncThunk('/api/v1/videos/allVideo', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/v1/videos/allVideo');
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

// Fetch all videos by a specific user
export const fetchAllUserVideos = createAsyncThunk('/api/v1/videos/allUserVideo', async (ownerId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/api/v1/videos/allUserVideo/${ownerId}`);
    //console.log("setup",response.data.data);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

// Fetch video details by ID
export const fetchVideoById = createAsyncThunk('/api/v1/videos/videoData', async (videoId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/api/v1/videos/videoData/${videoId}`);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

// Publish a new video
export const publishVideo = createAsyncThunk(
  '/api/v1/videos/publish',
  async (videoData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/v1/videos/publish', videoData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Necessary for file uploads
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Delete a video by ID
export const deleteVideo = createAsyncThunk('/api/v1/videos/delete', async (videoId, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`/api/v1/videos/delete/${videoId}`);
    return videoId; // Returning video ID for removal from the state
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

// Increment views of a video
export const incrementView = createAsyncThunk('/api/v1/videos/incrementView', async (videoId, { rejectWithValue }) => {
  try {
    const response = await axios.put(`/api/v1/videos/incrementView/${videoId}`);
    return response.data.data; // Return updated video data after view increment
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

const videoSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetchAllVideos actions
    builder
      .addCase(fetchAllVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload;
        //console.log("state",state.videos);
      })
      .addCase(fetchAllVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle fetchAllUserVideos actions
      .addCase(fetchAllUserVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUserVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.userVideos = action.payload
        //console.log('Redux State User Videos:', state.userVideos);
      })
      .addCase(fetchAllUserVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle fetchVideoById actions
      .addCase(fetchVideoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideoById.fulfilled, (state, action) => {
        state.loading = false;
        state.video = action.payload;
      })
      .addCase(fetchVideoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle publishVideo actions
      .addCase(publishVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(publishVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.videos.push(action.payload); // Add new video to state
      })
      .addCase(publishVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle deleteVideo actions
      .addCase(deleteVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = state.videos.filter((video) => video._id !== action.payload);
        state.userVideos = state.userVideos.filter((video) => video._id !== action.payload);
        //console.log(action.payload);
      })
      .addCase(deleteVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle incrementView actions
      .addCase(incrementView.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(incrementView.fulfilled, (state, action) => {
        state.loading = false;
        const updatedVideo = action.payload;
        const index = state.videos.findIndex((video) => video._id === updatedVideo._id);
        if (index !== -1) {
          state.videos[index] = updatedVideo; // Update video in state with new view count
        }
      })
      .addCase(incrementView.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default videoSlice.reducer;
