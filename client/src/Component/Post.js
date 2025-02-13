import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Text,
  Avatar,
  Image,
  Flex,
  Heading,
  IconButton,
  useToast,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
import { useChange } from "../context/StateProvider";
import axios from "axios";
import Option from "./Option";
import Comment from "./Comment";
const Post = ({ post, deleteMyPost,setPosts }) => {
  const { user, token, posts} = useChange();
  const [showOption, setShowOption] = useState(false);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [showComment, setShowComment] = useState(false);
  const [like, setLike] = useState(0);
  const [likeLoading,setLikeLoading]=useState(false);
  const [likeM, setLikeM] = useState([]);
  const toast = useToast();

  const doComment = async () => {
    setShowComment(!showComment);
  };

  const doneComment = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    if (!comment) {
      toast({
        title: "Comment is empty",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/v1/comment/${post._id}`,
      { text: comment },
      config
    );
    if (data.success) {
      toast({
        title: "Your comment added successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setComments([data.comment, ...comments]);
      setComment("");
    } else {
      toast({
        title: data.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setComment("");
      return;
    }
  };
  const giveLike = async () => {
    setLikeLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const alreadyLiked = likeM.some(
      (like) => like.user?._id === user?._id && like?.post === post?._id
    );
    if (!alreadyLiked) {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/like/${post._id}`,
        {},
        config
      );

      if (data.success) {
        toast({
          title: data.message,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });

        setLikeM((prevLikeM) => [data.like, ...prevLikeM]);
        setLike(likeM.length);
      } else {
        toast({
          title: data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
    } else {
      toast({
        title: "You already liked this post",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
    setLikeLoading(false);
  };

  const fetchLikes = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/v1/like/${post._id}`,
      config
    );

    if (data.likeLen > 0) setLike(+data.likeLen);
    else {
      setLike(0);
    }
    setLikeM(data.allLike);
  };

  const fetchComments = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/v1/comment/${post._id}`,
      config
    );
    setComments(data.comments);
  };
  useEffect(() => {
    if (showComment) {
      fetchComments();
    }
  }, [showComment]);

  useEffect(() => {
    fetchLikes();
  }, [posts]);

  return (
    <Card width={"clamp(300px,55vw,550px)"} >
      <CardHeader>
        <Flex spacing="4">
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar name={post?.user?.name} src={post?.user?.pic} />

            <Box>
              <Heading size="sm">{post?.user?.name}</Heading>
            </Box>
          </Flex>
          {user?._id === post?.user?._id && (
            <>
              <IconButton
                variant="ghost"
                colorScheme="gray"
                aria-label="See menu"
                icon={<i class="bi bi-three-dots-vertical"></i>}
                onClick={() => {
                  setShowOption(!showOption);
                }}
              />
              <Option
                handleFunction={deleteMyPost}
                showOption={showOption}
                setShowOption={setShowOption}
                post={post}
                setPosts={setPosts}
              />
            </>
          )}
        </Flex>
      </CardHeader>
      {post.text && <CardBody><Text>{post.text}</Text></CardBody>}
      {post.image && (
        <Image
          src={post.image}
          alt="post img"
          style={{ maxHeight: "300px", width: "100%" }}
        />
      )}

      <CardFooter
        justify="space-between"
        flexWrap="wrap"
        sx={{
          "& > button": {
            minW: "136px",
          },
        }}
      >
        <Button
          flex="1"
          variant="ghost"
          leftIcon={<i className="bi bi-hand-thumbs-up"></i>}
          onClick={likeLoading?undefined:giveLike}
        >
          {likeM.length} Like
        </Button>
        <Button
          flex="1"
          variant="ghost"
          leftIcon={<i className="bi bi-chat"></i>}
          onClick={doComment}
        >
          Comment
        </Button>
        {showComment && (
          <>
            <InputGroup>
              <Input
                type={"text"}
                placeholder="Add Comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <InputRightElement width={"4.5rem"}>
                <IconButton
                  h="1.75rem"
                  size={"sm"}
                  icon={<i class="bi bi-send"></i>}
                  onClick={doneComment}
                />
              </InputRightElement>
            </InputGroup>
            {comments.length > 0 && (
              <Box mt={"20px"} overflowY={"scroll"} h={"150px"} w={"100%"}>
                {comments &&
                  comments?.map((c) => {
                    return <Comment comment={c} />;
                  })}
              </Box>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default Post;
