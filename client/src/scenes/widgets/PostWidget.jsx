import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import UserImage from "components/UserImage";
import { useNavigate } from "react-router-dom";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [areCommentUsersLoaded, setAreCommentUsersLoaded] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user?._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const [commentText, setCommentText] = useState("");
  const [commentUsers, setCommentUsers] = useState({});
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const loadCommentUsers = async () => {
    const users = {};
    const userIdsToLoad = comments
      .filter((comment) => !commentUsers[comment.userId])
      .map((comment) => comment.userId);

    if (userIdsToLoad.length > 0) {
      const responses = await Promise.all(
        userIdsToLoad.map(async (userId) => {
          const response = await fetch(`http://localhost:3001/users/${userId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          });
          const userData = await response.json();
          users[userId] = userData;
        })
      );

      setCommentUsers((prevUsers) => ({
        ...prevUsers,
        ...users,
      }));
    }
    setAreCommentUsersLoaded(true);
  };

  useEffect(() => {
    if (isComments) {
      loadCommentUsers();
    }
  }, [isComments, comments, token]);

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const handleCommentSubmit = async () => {
    await loadCommentUsers();

    const response = await fetch(`http://localhost:3001/posts/${postId}/addComment`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId, text: commentText }),
    });

    const updatedPost = await response.json();

    dispatch(setPost({ post: updatedPost }));

    setCommentText("");
  };

  const formatCommentDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric" };
    const formattedDate = new Intl.DateTimeFormat("ru-RU", options).format(new Date(dateString));
    return formattedDate;
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
        isOwnPost={loggedInUserId === postUserId}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>
      </FlexBetween>
      {areCommentUsersLoaded && isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Box sx={{ display: "flex", alignItems: "center" }} onClick={() => navigate(`/profile/${comment.userId}`)}>
                <UserImage image={commentUsers[comment.userId]?.picturePath} size="30px" />
                <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                  {commentUsers[comment.userId]?.firstName}{" "}
                  {commentUsers[comment.userId]?.lastName}:{" "}
                  <strong>{comment.text}</strong>
                  <br />
                  <span style={{ color: palette.text.secondary }}>
                    {formatCommentDate(comment.createdAt)}
                  </span>
                </Typography>
              </Box>
            </Box>
          ))}
          <TextField
            label="Комментарий"
            variant="outlined"
            fullWidth
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={handleCommentSubmit}
            sx={{ marginTop: '1rem' }}
          >
            Отправить комментарий
          </Button>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
