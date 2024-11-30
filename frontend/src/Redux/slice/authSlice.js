// frontend/src/Redux/slice/authslice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    user: null,
    loading: false,
    error: null,
    accessToken: null,
    status: false,
    hasChannel: false,
    watchHistory: []  // New field to store the user's watch history
};

// Register User
export const register = createAsyncThunk('/api/v1/account/signup', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post('/api/v1/account/signup', userData);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

// Login User
export const login = createAsyncThunk('/api/v1/account/login', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post('/api/v1/account/login', userData);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

// Logout User
export const logout = createAsyncThunk('/api/v1/account/logout', async (_, { rejectWithValue }) => {
    try {
        await axios.post('/api/v1/account/logout');
        return true;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

// Fetch user data by ID
export const getUserData = createAsyncThunk('/api/v1/account/getUserData', async (userId, { rejectWithValue }) => {
    try {
        const response = await axios.get(`/api/v1/account/userData/${userId}`);
        return response.data.data;  // Assuming response contains the user data
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

// Delete User Account
export const deleteAccount = createAsyncThunk(
    '/api/v1/account/deleteAccount',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`/api/v1/account/delete/${userId}`);
            return response.data.message; // Return the success message from backend
        } catch (error) {
            return rejectWithValue(error.response.data.message); // Return error message
        }
    }
);

// Update User Account
export const updateAccount = createAsyncThunk(
    '/api/v1/account/updateAccount',
    async ({ userId, formData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/api/v1/account/update/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Necessary for file uploads
                },
            });
            return response.data.data; // Return the updated user data
        } catch (error) {
            return rejectWithValue(error.response.data.message); // Return error message
        }
    }
);

// Get User Watch History
export const getWatchHistory = createAsyncThunk(
    '/api/v1/account/getWatchHistory',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/v1/account/history`);
            return response.data.data; // Return watch history from the backend
        } catch (error) {
            return rejectWithValue(error.response.data.message); // Return error message
        }
    }
);

// Add Video to Watch History
export const addToWatchHistory = createAsyncThunk(
    '/api/v1/account/addToWatchHistory',
    async (videoId, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/api/v1/account/addToHistory/${videoId}`);
            return response.data.message; // Return success message from backend
        } catch (error) {
            return rejectWithValue(error.response.data.message); // Return error message
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Handle register actions
        builder
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.hasChannel = action.payload.hasChannel;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle login actions
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.status = true;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.hasChannel = action.payload.hasChannel;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.status = false;
                state.error = action.payload;
            })

            // Handle logout actions
            .addCase(logout.fulfilled, (state) => {
                return {
                    ...state,
                    status: false,
                    user: null,  // Clear user data on logout
                    accessToken: null,
                };
            })
            .addCase(logout.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Handle getUserData actions
            .addCase(getUserData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserData.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(getUserData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteAccount actions
            .addCase(deleteAccount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAccount.fulfilled, (state) => {
                state.loading = false;
                state.user = null; // Clear user data after account deletion
                state.accessToken = null;
                state.status = false;
            })
            .addCase(deleteAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Set error state
            })

            // Handle updateAccount actions
            .addCase(updateAccount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAccount.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload; // Update the user data
            })
            .addCase(updateAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Set error state
            })

            // Handle getWatchHistory actions
            .addCase(getWatchHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getWatchHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.watchHistory = action.payload; // Save watch history data
            })
            .addCase(getWatchHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Set error state
            })

            // Handle addToWatchHistory actions
            .addCase(addToWatchHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToWatchHistory.fulfilled, (state, action) => {
                state.loading = false;
                // Add new video to watch history
                state.watchHistory.push(action.payload); 
            })
            .addCase(addToWatchHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Set error state
            });
    },
});

export default authSlice.reducer;
