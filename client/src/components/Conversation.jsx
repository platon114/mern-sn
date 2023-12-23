import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import UserImage from "./UserImage";
import FlexBetween from "./FlexBetween";
import { useNavigate } from "react-router-dom";

const Conversation = ({ conversation, lastMessage, onClick, isHomePage }) => {
  const [secondUserInfo, setSecondUserInfo] = useState(null);
  const loggedInUserId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);
  const navigate = useNavigate();
  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const getSecondUserInfo = async () => {
    try {
      // Находим пользователя, который не является залогиненным
      const secondUserId = conversation.members.find(memberId => memberId !== loggedInUserId);

      // Запрос к серверу для получения информации о втором пользователе
      const response = await fetch(`https://mern-snsv.onrender.com/users/${secondUserId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      // Проверяем, что запрос успешен132
      if (response.ok) {
        const userData = await response.json();
        setSecondUserInfo(userData);
      } else {
        console.error("Failed to fetch user info");
      }
    } catch (error) {
      console.error("Error fetching second user info:", error);
    }
  };

  useEffect(() => {
    getSecondUserInfo();
  }, [conversation.members, loggedInUserId, token]);

  if (!secondUserInfo) {
    return <p>Loading...</p>; // Можно добавить загрузочное состояние
  }


  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={secondUserInfo.picturePath} size="55px" />
        <Box>
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
            onClick={() => {
              if (isHomePage && typeof onClick === 'function') {
                onClick();
                navigate("/messenger");
              } else if (typeof onClick === 'function') {
                onClick();
              }
            }}
          >
            {secondUserInfo.firstName} {secondUserInfo.lastName}
          </Typography>
          <Typography fontWeight="400" color={medium}>
            {isHomePage && lastMessage && lastMessage.text}
          </Typography>
        </Box>
      </FlexBetween>
    </FlexBetween>

  );
};

export default Conversation;
