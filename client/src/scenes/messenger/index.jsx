import React, { useState, useEffect, useRef } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "scenes/navbar";
import ChatBoxWidget from "scenes/widgets/ChatBoxWidget";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import ConvesationListWidget from "scenes/widgets/ConversationListWidget";
import { setSearchText } from "state";
import { io } from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";
const Messenger = () => {
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const { _id, picturePath } = useSelector((state) => state.user);
    const searchText = useSelector((state) => state.searchText);
    const token = useSelector((state) => state.token);
    const dispatch = useDispatch();
    const socket = useRef();

    useEffect(() => {
        socket.current = io("ws://localhost:8900");
    }, []);

    useEffect(() => {
        socket.current.emit("addUser", _id);
        socket.current.on("getUsers", (users) => {
            console.log(users);
        });
    }, [_id]);


    return (
        <Box>
            <Navbar onSearch={(text) => dispatch(setSearchText(text))} />
            <Box
                width="100%"
                padding="2rem 6%"
                display={isNonMobileScreens ? "flex" : "block"}
                gap="0.5rem"
                justifyContent="space-between"
            >
                <Box flexBasis="26%">
                    {/* Передаем переменную conversation и функцию для ее обновления в ConvesationListWidget */}
                    <ConvesationListWidget userId={_id} />
                </Box>
                <Box flexBasis="72%">
                    {/* Передаем переменную conversation в ChatBoxWidget */}
                    <ChatBoxWidget/>
                </Box>
            </Box>
        </Box>
    );
};

export default Messenger;
