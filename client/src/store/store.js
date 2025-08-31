import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import postReducer from "./slices/postSlice";
import userReducer from "./slices/userSlice";
import notificationReducer from "./slices/notificationSlice";
import storyReducer from "./slices/storySlice";

const authPersistConfig = {
    key: "auth",
    storage,
    whitelist: ["user", "isAuthenticated"],
};

const postsPersistConfig = {
    key: "posts",
    storage,
    whitelist: ["posts"],
};

export const store = configureStore({
    reducer: {
        auth: persistReducer(authPersistConfig, authReducer),
        posts: persistReducer(postsPersistConfig, postReducer),
        users: userReducer,
        notifications: notificationReducer,
        stories: storyReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
            },
        }),
});

export const persistor = persistStore(store);
