import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCanBeFriends } from "state";

const CanBeFriendsList = ({ userId, isOwnProfile }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const canBeFriends = useSelector((state) => state.user.canBeFriends);
  const getRandomFriends = async () => {
    const response = await fetch(
        `https://mern-snsv.onrender.com/users/${userId}/random/5`, // Получаем 5 случайных пользователей
        {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    const data = await response.json();
    dispatch(setCanBeFriends({ canBeFriends: data }));
};

useEffect(() => {
    getRandomFriends();
}, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Возможные друзья
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {canBeFriends && canBeFriends.map((friend) => (
          <Friend
            key={friend._id}
            friendId={friend._id}
            name={`${friend.firstName} ${friend.lastName}`}
            subtitle={friend.occupation}
            userPicturePath={friend.picturePath}
            isOwnProfile={isOwnProfile}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default CanBeFriendsList;