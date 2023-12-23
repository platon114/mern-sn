import React, { useEffect, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import { setSearchText } from "state";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const { userId: profileUserId } = useParams();
    const token = useSelector((state) => state.token);
    const currentUser = useSelector((state) => state.user);
    const { _id, picturePath } = useSelector((state) => state.user);
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const searchText = useSelector((state) => state.searchText);
    const dispatch = useDispatch();

    const getUser = async () => {
        const response = await fetch(`http://localhost:3001/users/${profileUserId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUser(data);
    };

    useEffect(() => {
        getUser();
    }, []);

    if (!user) return null;

    const isOwnProfile = currentUser && currentUser._id === profileUserId;

    return (
        <Box>
            <Navbar onSearch={(text) => dispatch(setSearchText(text))} />
            <Box
                width="100%"
                padding="2rem 6%"
                display={isNonMobileScreens ? "flex" : "block"}
                gap="2rem"
                justifyContent="center"
            >
                <Box flexBasis={isNonMobileScreens ? "26%" : undefined} sx={{ paddingTop: isNonMobileScreens ? "2rem" : 0 }}>
                    <UserWidget userId={profileUserId} picturePath={user.picturePath} isOwnProfile={isOwnProfile} isChatButtonVisible={true} />
                    <Box m="2rem 0" />
                    <FriendListWidget userId={profileUserId} isOwnProfile={isOwnProfile} />
                </Box>
                <Box
                    flexBasis={isNonMobileScreens ? "42%" : undefined}
                    mt={isNonMobileScreens ? undefined : "2rem"}
                >
                    {isOwnProfile && <MyPostWidget picturePath={user.picturePath} />}
                    
                    <PostsWidget userId={profileUserId} searchText={searchText} isProfile />
                </Box>
            </Box>
        </Box>
    );
};

export default ProfilePage;
