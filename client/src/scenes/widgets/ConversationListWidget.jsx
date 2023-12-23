import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Conversation from "components/Conversation";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setConversation } from "state";

const ConversationListWidget = ({ userId, isHomePage }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const [conversations, setConversations] = useState([]);
  const [lastMessages, setLastMessages] = useState({});

  useEffect(() => {
    // Fetch conversations from the server using the token and userId
    const getConversations = async () => {
      try {
        const response = await fetch(`https://mern-snsv.onrender.com/conversations/user/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setConversations(data);

          // Fetch last message for each conversation
          data.forEach((conversation) => {
            fetchLastMessage(conversation._id);
          });
        } else {
          console.error("Failed to fetch conversations");
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    getConversations();
  }, [dispatch, token, userId]);

  const fetchLastMessage = async (conversationId) => {
    try {
      const response = await fetch(`https://mern-snsv.onrender.com/messages/getMessage/${conversationId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Update lastMessages state with the last message for the conversation
        setLastMessages((prevMessages) => ({
          ...prevMessages,
          [conversationId]: data,
        }));
      } else {
        console.error("Failed to fetch last message for conversation", conversationId);
      }
    } catch (error) {
      console.error("Error fetching last message:", error);
    }
  };

  const handleConversationClick = (clickedConversation) => {
    // Dispatch the setConversation action with the clicked conversation
    dispatch(setConversation(clickedConversation));
  };

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Чаты
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {conversations.map((c) => (
          <Conversation
            key={c._id}
            conversation={c}
            lastMessage={lastMessages[c._id]}
            onClick={() => handleConversationClick(c)}
            isHomePage={isHomePage}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default ConversationListWidget;
