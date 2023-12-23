import React, { useState, useEffect, useRef } from "react";
import { InputBase } from "@mui/material";
import { Box, Typography, Divider, useTheme, IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import WidgetWrapper from "components/WidgetWrapper";
import { SendOutlined } from "@mui/icons-material";
import { io } from "socket.io-client";
import { setMessages } from "state";
import MessagesListWidget from "scenes/widgets/MessagesListWidget";
import Conversation from "components/Conversation";
import { useNavigate } from "react-router-dom";
const ChatBoxWidget = () => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const { _id } = useSelector((state) => state.user);
    const socket = useRef();
    const navigate = useNavigate();
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [message, setMessage] = useState("");
    const conversation = useSelector((state) => state.conversation);
    const [arrivalMessages, setArrivalMessages] = useState([]);
    const receiverIdd = conversation.members.find((member) => member !== _id);
    useEffect(() => {
        socket.current = io("ws://localhost:8900");

        socket.current.on("getMessage", (data) => {
            console.log("Received message:", data);
            if (socket.current.connected) {
                setArrivalMessage({
                    sender: data.senderId,
                    text: data.text,
                    createdAt: Date.now(),
                });
            }
        });


        socket.current.emit("addUser", _id);

        socket.current.on("getUsers", (users) => {
            console.log(users);
        });
    }, [_id, arrivalMessage]);

    useEffect(() => {
        const fetchData = async () => {
            if (arrivalMessage && conversation?.members.includes(arrivalMessage.sender)) {
                try {
                    const response = await fetch(
                        `https://mern-snsv.onrender.com/messages/getMessages/${conversation._id}`,
                        {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (!response.ok) {
                        console.error(`Error: ${response.status}`);
                        // Log additional details if needed
                    }

                    const messages = await response.json();

                    // Используйте функцию обновления состояния
                    dispatch(setMessages(messages));
                } catch (error) {
                    console.error("An error occurred while fetching messages:", error);
                }
            }
        };

        fetchData();
    }, [arrivalMessage, conversation]);




    const handleMessage = async () => {
        try {
            const messageData = {
                conversationId: conversation._id,
                sender: _id,
                text: message,
            };

            const receiverId = conversation.members.find((member) => member !== _id);

            socket.current.emit("sendMessage", {
                senderId: _id,
                receiverId,
                text: message,
            });

            const response = await fetch(
                `https://mern-snsv.onrender.com/messages/createMessage`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(messageData),
                }
            );

            if (!response.ok) {
                console.error(`Error: ${response.status}`);
                // Log additional details if needed
            }

            const response2 = await fetch(
                `https://mern-snsv.onrender.com/messages/getMessages/${conversation._id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const messages = await response2.json();
            dispatch(setMessages(messages));

            setMessage("");
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;

    if (!conversation) {
        return <div>Выберите беседу для отображения сообщений.</div>;
    }

    return (
        <WidgetWrapper>
            <div>
                <IconButton
                    onClick={() => navigate(`/profile/${receiverIdd}`)}
                    sx={{ "&:hover": { backgroundColor: "transparent" } }}
                >
                    <Conversation conversation={conversation} />
                </IconButton>

                <Divider sx={{ my: '8px' }} />
            </div>
            <div>
                <MessagesListWidget userId={_id} />
            </div>

            <Box
                backgroundColor={neutralLight}
                borderRadius="9px"
                gap="1rem"
                padding="1rem"
                display="flex"
                alignItems="center"  // Выравнивание по центру
            >
                <InputBase
                    placeholder="Введите сообщение..."
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                    fullWidth
                    multiline
                />
                <IconButton disabled={!message} onClick={handleMessage}>
                    <SendOutlined />
                </IconButton>
            </Box>
        </WidgetWrapper>
    );
};

export default ChatBoxWidget;
