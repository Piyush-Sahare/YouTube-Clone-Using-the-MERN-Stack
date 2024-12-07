//frontend/src/Redux/channelSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state for the channel slice
const initialState = {
    channel: null,       
    loading: false,       
    error: null,          
    successMessage: null, 
};

// **Async actions**

// Create a channel
export const createChannel = createAsyncThunk(
    "channel/createChannel",
    async (channelData, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/v1/channel/create", channelData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            return response.data.channel;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to create channel");
        }
    }
);

// Fetch channel data by ID
export const getChannel = createAsyncThunk(
    "channel/data",
    async (channelId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/v1/channel/data/${channelId}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to fetch channel data");
        }
    }
);

// Update a channel
export const updateChannel = createAsyncThunk(
    "channel/updateChannel",
    async ({ channelId, formData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/api/v1/channel/update/${channelId}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to update channel");
        }
    }
);

// Delete a channel
export const deleteChannel = createAsyncThunk(
    "channel/delete",
    async (channelId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`/api/v1/channel/delete/${channelId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            return response.data.message;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to delete channel");
        }
    }
);

export const subscribeChannel = createAsyncThunk(
    "channel/subscribe",
    async (channelId, { rejectWithValue }) => {
        try {
            const response = await axios.post(`/api/v1/channel/subscribe/${channelId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            return response.data.message;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to subscribe channel");
        }
    }
);

export const unsubscribeChannel = createAsyncThunk(
    "channel/unsubscribe",
    async (channelId, { rejectWithValue }) => {
        try {
            const response = await axios.post(`/api/v1/channel/unsubscribe/${channelId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            return response.data.message;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to unsubscribe channel");
        }
    }
);

// **Slice definition**
const channelSlice = createSlice({
    name: "channel",
    initialState,
    reducers: {
        // Reset the error state
        clearError(state) {
            state.error = null;
        },
        // Reset the success message state
        clearSuccessMessage(state) {
            state.successMessage = null;
        },
    },
    extraReducers: (builder) => {
        // Handle createChannel actions
        builder
            .addCase(createChannel.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(createChannel.fulfilled, (state, action) => {
                state.loading = false;
                state.channel = action.payload;
                state.successMessage = "Channel created successfully!";
            })
            .addCase(createChannel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(getChannel.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getChannel.fulfilled, (state, action) => {
                state.loading = false;
                state.channel = action.payload;
                //console.log("Channel state updated:", state.channel); // Debugging log
            })
            .addCase(getChannel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.error("Error fetching channel:", action.payload); // Debugging log
            })

            .addCase(updateChannel.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updateChannel.fulfilled, (state, action) => {
                state.loading = false;
                state.channel = action.payload;
                state.successMessage = "Channel updated successfully!";
            })
            .addCase(updateChannel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(deleteChannel.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(deleteChannel.fulfilled, (state, action) => {
                state.loading = false;
                state.channel = null;
            })
            .addCase(deleteChannel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(subscribeChannel.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(subscribeChannel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(unsubscribeChannel.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(unsubscribeChannel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});


export const { clearError, clearSuccessMessage } = channelSlice.actions;

export default channelSlice.reducer;
