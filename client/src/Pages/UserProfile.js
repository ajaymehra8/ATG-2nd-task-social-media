import React, { useCallback, useEffect, useState } from "react";
import Header from "../Component/Header";
import { Box, Stack, Text, useToast } from "@chakra-ui/react";
import { useChange } from "../context/StateProvider";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import Post from "../Component/Post";

const UserProfile = () => {
  const { user, setUser, token, myPost, setMyPost, posts } = useChange();
  const [show, setShow] = useState(false);
  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [pic, setPic] = useState();
  const [click, setClick] = useState("profile");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [showBar, setShowBar] = useState(false);
  const handleRes = () => {
    setShowBar(!showBar);
  };
  const updateMe = useCallback(async () => {
    setLoading(true);
    const form = new FormData();
    form.append("name", name);

    if (pic) {
      form.append("pic", pic);
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.patch(
      `${process.env.REACT_APP_API_URL}/api/v1/user/${user._id}`,
      form,
      config
    );
    if (data.success) {
      toast({
        title: "User updated successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setUser(data.user);
      localStorage.setItem("userInfo", JSON.stringify(data.user));
    } else {
      toast({
        title: "Error in updating user",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
    setLoading(false);
  }, [token]);

  const deleteMyPost = async (post) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios.delete(
      `${process.env.REACT_APP_API_URL}/api/v1/post/${post._id}`,
      config
    );
    toast({
      title: "Your post deleted successfully",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top",
    });
    setMyPost(myPost.filter((p) => p._id !== post._id));
  };

  const fetchmyPost = useCallback(async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/v1/post/${user._id}`,
      config
    );
    if (data.success) {
      setMyPost(data.posts);
    } else {
      toast({
        title: data.message || "Unknown error",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  }, [token]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        alignItems: "center",
        width: "100vw",
      }}
    >
      <Header />
      <Button
        onClick={handleRes}
        className="resBtn"
        display={{ base: "flex", md: "none" }}
      >
        <i className="bi bi-list"></i>
      </Button>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100vw",
          padding: "25px",
          gap: "20px",
        }}
      >
        <Box
          display={{ base: showBar ? "flex" : "none", md: "flex" }}
          flexDirection={"column"}
          p={3}
          bg={"#f8f8f8"}
          w={"20%"}
          h={"100%"}
          borderRadius={"lg"}
          overflowY={"hidden"}
          height={"80vh"}
          className="resOption"
        >
          <Stack>
            <Box
              cursor={"pointer"}
              bg={click === "profile" ? "#38B2AC" : "#E8E8E8"}
              color={click === "profile" ? "white" : "black"}
              px={3}
              py={2}
              borderRadius={"lg"}
              onClick={() => {
                setClick("profile");
              }}
            >
              <Text>My Profile</Text>
            </Box>
            <Box
              cursor={"pointer"}
              bg={click !== "profile" ? "#38B2AC" : "#E8E8E8"}
              color={click !== "profile" ? "white" : "black"}
              px={3}
              py={2}
              borderRadius={"lg"}
              onClick={() => {
                fetchmyPost();
                setClick("posts");
              }}
            >
              <Text>My Posts</Text>
            </Box>
          </Stack>
        </Box>

        {click === "profile" ? (
          <Box
            display={"flex"}
            flexDirection={"column"}
            p={3}
            bg={"#f8f8f8"}
            w={"70%"}
            minWidth={"400px"}
            h={"100%"}
            borderRadius={"lg"}
            overflowY={"hidden"}
            height={"80vh"}
          >
            <VStack spacing={"5px"} color={"black"}>
              <FormControl id="first-name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  placeholder={user?.name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  placeholder={user?.email}
                  onChange={(e) => setEmail(e.target.value)}
                  isReadOnly
                />
              </FormControl>

              <FormControl id="photo">
                <FormLabel>Upload your photo</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Enter your password"
                  onChange={(e) => setPic(e.target.files[0])}
                />
              </FormControl>

              <Button
                colorScheme="blue"
                width={"clamp(100px,10%,100px)"}
                style={{ marginTop: 15 }}
                padding={"3px"}
                onClick={updateMe}
              >
                {loading ? "Updating...." : "Update Me"}
              </Button>
            </VStack>
          </Box>
        ) : (
          <Box
            display={"flex"}
            p={3}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"start"}
            bg={"#f8f8f8"}
            w={"70%"}
            minWidth={"400px"}
            h={"100%"}
            borderRadius={"lg"}
            overflowX={"hidden"}
            overflowY={"scroll"}
            height={"80vh"}
            position={"relative"}
          >
            <Text
              fontSize={"40px"}
              style={{
                position: "fixed",
                top: "90px",
                zIndex: "1",
                textAlign: "center",
              }}
              background={"#f8f8f8"}
              w={"55%"}
            >
              My Posts
            </Text>
            <Box
              display={"flex"}
              flexDirection={"column"}
              gap={"20px"}
              alignItems={"center"}
              pb={"20px"}
              h={"100%"}
              w={"100%"}
              mt={"150px"}
            >
              {myPost.map((post) => (
                <Post post={post} deleteMyPost={() => deleteMyPost(post)} setPosts={setMyPost}/>
              ))}
            </Box>
          </Box>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
