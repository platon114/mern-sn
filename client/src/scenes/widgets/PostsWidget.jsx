import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false, searchText }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchPosts = async () => {
    setIsLoading(true);
    let url = `http://localhost:3001/posts?page=${pageNumber}`;
    if (isProfile) {
      url = `http://localhost:3001/posts/${userId}/posts?page=${pageNumber}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    dispatch(setPosts(data));

    getFilteredPosts(data);

    setIsLoading(false);
  };

  const getFilteredPosts = (data) => {
    // Сортируем посты по дате создания в порядке убывания
    const sortedPosts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Фильтрация по description, firstName и lastName
    if (searchText) {
      const filteredPosts = sortedPosts.filter(
        (post) =>
          post.description.includes(searchText) ||
          post.firstName.includes(searchText) ||
          post.lastName.includes(searchText)
      );
      dispatch(setPosts({ posts: filteredPosts }));
    } else {
      dispatch(setPosts({ posts: sortedPosts }));
    }
  };


  const handleScroll = () => {
    const isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight;

    if (isBottom && !isLoading) {
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    }
  };

  useEffect(() => {
    fetchPosts();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pageNumber, userId, isProfile, searchText]);


  const renderedPosts = posts || [];

  return (
    <>
      {renderedPosts.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;
