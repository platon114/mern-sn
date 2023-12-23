import React from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import CanBeFriendsListWidget from "scenes/widgets/CanBeFriendsListWidget";
import { setSearchText } from "state"; // Импортируем setSearchText
import ConvesationListWidget from "scenes/widgets/ConversationListWidget";

const HomePage = () => {
    const isHomePage = true;
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const { _id, picturePath } = useSelector((state) => state.user);
    const searchText = useSelector((state) => state.searchText);
    const dispatch = useDispatch(); // Используем useDispatch

    return (
        <Box>
            {/* Передаем onSearch в компонент Navbar */}
            <Navbar onSearch={(text) => dispatch(setSearchText(text))} />
            <Box
                width="100%"
                padding="2rem 6%"
                display={isNonMobileScreens ? "flex" : "block"}
                justifyContent="space-between"
            >
                <Box flexBasis={isNonMobileScreens ? "26%" : undefined} marginBottom={isNonMobileScreens ? undefined : "2rem"}>
                    <UserWidget userId={_id} picturePath={picturePath} isOwnProfile={true} />
                    {!isNonMobileScreens && (
                        <Box flexBasis="26%" marginTop="2rem">
                            <FriendListWidget userId={_id} isOwnProfile={true} />
                        </Box>

                    )}
                    <Box marginTop="2rem">
                        <ConvesationListWidget userId={_id} isHomePage={isHomePage} />
                    </Box>
                </Box>
                <Box
                    flexBasis={isNonMobileScreens ? "42%" : undefined}
                    marginTop={isNonMobileScreens ? undefined : "2rem"}
                >
                    <MyPostWidget picturePath={picturePath} isOwnProfile={false} />
                    <PostsWidget userId={_id} searchText={searchText} />
                </Box>
                {isNonMobileScreens && (
                    <Box flexBasis="26%" >
                        <FriendListWidget userId={_id} isOwnProfile={true} />
                        <Box flexBasis="26%" marginTop={isNonMobileScreens ? "2rem" : undefined}>
                            <CanBeFriendsListWidget userId={_id} isOwnProfile={true} />
                        </Box>
                    </Box>

                )}
                {!isNonMobileScreens && (
                    <Box flexBasis="26%" marginTop="2rem">
                        <CanBeFriendsListWidget userId={_id} isOwnProfile={true} />
                    </Box>

                )}
            </Box>
        </Box>
    );
};

export default HomePage;