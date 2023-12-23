import { Box, Typography, useTheme } from "@mui/material";
import Message from "components/message/Message";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "state";
import { io } from "socket.io-client";

import "./messagesListStyles.css";

const MessagesListWidget = ({ userId }) => {
    const dispatch = useDispatch();
    const { palette } = useTheme();
    const token = useSelector((state) => state.token);
    const socket = useRef();
    const chatBoxRef = useRef(null);
    const [firstUser, setFirstUser] = useState(null);
    const [secondUser, setSecondUser] = useState(null);
    const messages = useSelector((state) => state.messages);
    const conversation = useSelector((state) => state.conversation);
    useEffect(() => {
        // После обновления компонента прокрутите вниз, чтобы отобразить последние сообщения
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [conversation, messages]);

    useEffect(() => {
        // Fetch conversations from the server using the token and userId
        const getMessages = async () => {
            try {
                const response = await fetch(`https://mern-snsv.onrender.com/messages/getMessages/${conversation._id}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    dispatch(setMessages(data));

                } else {
                    // Handle errors
                    console.error("Failed to fetch conversations");
                }
            } catch (error) {
                console.error("Error fetching conversations:", error);
            }
        };

        getMessages();
    }, [token, userId, conversation]);



    const getUser = async (senderId) => {
        try {
            const response = await fetch(`https://mern-snsv.onrender.com/users/${senderId}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                console.error(`Failed to fetch user data for user ID: ${senderId}`);
                return null;
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            return null;
        }
    };

    useEffect(() => {
        const firstUserId = conversation.members[0];
        const secondUserId = conversation.members[1];

        const fetchUsers = async () => {
            const firstUser = await getUser(firstUserId);
            const secondUser = await getUser(secondUserId);

            setFirstUser(firstUser);
            setSecondUser(secondUser);
        };

        fetchUsers();
    }, [token, conversation.members]);

    useEffect(() => {
        setMessages(messages);
    }, [messages]);




    return (
        <div className="chatBoxTop" style={{ maxHeight: '650px', overflowY: 'auto' }} ref={chatBoxRef}>
            {Array.isArray(messages) && messages.map((m) => (
                <Message
                    key={m._id}
                    message={m}
                    own={m.sender === userId}
                    firstPicture={firstUser ? firstUser.picturePath : null}
                    secondPicture={secondUser ? secondUser.picturePath : null}
                />
            ))}
        </div>
    );

};

export default MessagesListWidget;
