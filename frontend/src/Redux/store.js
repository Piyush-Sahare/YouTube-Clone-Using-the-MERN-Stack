// // //frontend/src/Redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import authReducer from './slice/authSlice.js';
import channelReducer from './slice/channelSlice.js';
import videoReducer from './slice/videoSlice.js'

// Configure persist for authReducer
const authPersistConfig = {
    key: 'auth', // Key for auth storage
    storage,
};

const channelPersistConfig = {
    key: 'channel', // Key for channel storage
    storage,
};

const videoPersistConfig = {
    key: 'video', // Key for video storage
    storage,
};

// Persisted reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedChannelReducer = persistReducer(channelPersistConfig, channelReducer);
const persistedVideoReducer = persistReducer(videoPersistConfig, videoReducer);

const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        channel: persistedChannelReducer,
        video: persistedVideoReducer
    },
});

export const persistor = persistStore(store);
export default store;
