import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import ChatIcon from '@mui/icons-material/Chat';
import { Box, Typography, Divider, useTheme, IconButton } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setConversation } from "state";
import { setFriends, setProfileFriends } from "state";
import { useParams } from "react-router-dom";


const UserWidget = ({ userId, picturePath, isOwnProfile, isChatButtonVisible }) => {

  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;


  const friendsConst = useSelector((state) => state.user.friends);
  let isFriendConst = friendsConst && friendsConst.find((friend) => friend._id === _id);

  const patchFriend = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${_id}/${userId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const response2 = await fetch(
        `http://localhost:3001/users/${userId}/friends`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response2.json();
      dispatch(setFriends({ friends: data }));
      let tmp = friendsConst && friendsConst.find((friend) => friend._id === userId);
      isFriendConst = tmp;

    } catch (error) {
      console.error("Error patching friend:", error);
    }
  };


  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  const handleStartChat = async () => {
    try {
      // Проверка наличия беседы между текущим пользователем и просматриваемым профилем
      const response = await fetch(
        `http://localhost:3001/conversations/between/${_id}/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      // Если беседа уже существует, перенаправить пользователя на страницу чата
      if (data) {
        dispatch(setConversation(data));
        navigate(`/messenger`);
      } else {
        // Если беседа не существует, создать новую беседу

        const convData = {
          senderId: _id,
          receiverId: userId,
        };
        const createConvResponse = await fetch(
          "http://localhost:3001/conversations/createConv",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(convData),
          }
        );
        const responseConv = await fetch(
          `http://localhost:3001/conversations/between/${_id}/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const dataCreate = await responseConv.json();

        if (!createConvResponse.ok) {
          console.error(`Error: ${createConvResponse.status}`);
          // Log additional details if needed
        }
        dispatch(setConversation(dataCreate));
        navigate(`/messenger`);

      }
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const {
    firstName,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
  } = user;

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/profile/${userId}`)}
      >
        <FlexBetween gap="1rem">
          <UserImage image={picturePath} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {firstName} {lastName}
            </Typography>
            <Typography color={medium}>{friendsConst.length} friends</Typography>
          </Box>
        </FlexBetween>
        {isOwnProfile && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              navigate('/updateProfile');
            }}
          >
            <ManageAccountsOutlined />
          </IconButton>
        )}
        {!isOwnProfile && (
          <IconButton
            onClick={() => patchFriend()}
            sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
          >
            {isFriendConst ? (
              <PersonRemoveOutlined sx={{ color: primaryDark }} />
            ) : (
              <PersonAddOutlined sx={{ color: primaryDark }} />
            )}
          </IconButton>
        )}
      </FlexBetween>
      {!isOwnProfile && isChatButtonVisible && (
        <Box gap="1rem" mb="0.5rem">
          <FlexBetween>
            <IconButton
              onClick={handleStartChat}
              fontSize="large"
              sx={{ color: main, padding: 0, borderRadius: 10, '&:hover': { background: 'none' } }}
            >
              <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
                <ChatIcon fontSize="large" sx={{ color: main }} />
                <Typography color={medium} fontWeight="500">Открыть чат</Typography>
              </Box>
            </IconButton>

          </FlexBetween>

        </Box>

      )}


      <Divider />

      {/* SECOND ROW */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{location}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{occupation}</Typography>
        </Box>
      </Box>


    </WidgetWrapper>
  );
};

export default UserWidget;
