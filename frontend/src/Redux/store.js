//frontend/src/Redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import authReducer from './slice/authSlice.js';
import channelReducer from './slice/channelSlice.js';
import videoReducer from './slice/videoSlice.js';
import commentsReducer from './slice/commentsSlice.js'


// Configure persist for authReducer
const authPersistConfig = {
    key: 'auth', 
    storage,
};

const channelPersistConfig = {
    key: 'channel', 
    storage,
};

const videoPersistConfig = {
    key: 'video', 
    storage,
};

const commentsPersistConfig = {
    key: 'comments', 
    storage,
};

// Persisted reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedChannelReducer = persistReducer(channelPersistConfig, channelReducer);
const persistedVideoReducer = persistReducer(videoPersistConfig, videoReducer);
const persistedcommentsReducer = persistReducer(commentsPersistConfig, commentsReducer);

const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        channel: persistedChannelReducer,
        video: persistedVideoReducer,
        comments: persistedcommentsReducer
    },
});

export const persistor = persistStore(store);
export default store;
