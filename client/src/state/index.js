import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: "light",
    user: null,
    token: null,
    posts: [],
    messages: [],
    searchText: "",
    conversation: null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
        },
        setFriends: (state, action) => {
            if (state.user) {
                state.user.friends = action.payload.friends;
            } else {
                console.error("user friends non-existent :(");
            }
        },
        setCanBeFriends: (state, action) => {
            if (state.user) {
                state.user.canBeFriends = action.payload.canBeFriends;
            } else {
                console.error("user friends non-existent :(");
            }
        },
        setProfileFriends: (state, action) => {
            if (state.user) {
              // Обновляем список друзей только для текущего пользователя
              state.user.friends = action.payload.profileFriends;
            } else {
              console.error("Profile friends update failed: User not found or not matching");
            }
          },
        setPosts: (state, action) => {
            state.posts = action.payload.posts;
        },
        setPost: (state, action) => {
            const updatedPosts = state.posts.map((post) => {
                if (post._id === action.payload.post._id) return action.payload.post;
                return post;
            });
            state.posts = updatedPosts;
        },
        setSearchText: (state, action) => {
            state.searchText = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },

        setMessage: (state, action) => {
            const updatedMessages = state.messages.map((message) => {
                if (message._id === action.payload.message._id) return action.payload.message;
                return message;
            });
            state.messages = updatedMessages;
        },
        setConversation: (state, action) => {
            state.conversation = action.payload;
        },
    },
});

export const {
    setMode,
    setLogin,
    setLogout,
    setFriends,
    setPosts,
    setPost,
    setSearchText,
    setMessages,
    setMessage,
    setConversation,
    setProfileFriends,
    setCanBeFriends,
} = authSlice.actions;
export default authSlice.reducer;