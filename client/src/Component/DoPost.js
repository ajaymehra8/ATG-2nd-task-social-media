import React, { useState } from "react";
import {
  Avatar,
  Box,
  Input,
  Modal,
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  useDisclosure,
  Textarea,
  Text,
  useToast,
  IconButton,
  Image,
  Spinner,
} from "@chakra-ui/react";
import { useChange } from "../context/StateProvider";
import { doPostApi } from "../Api/post";

const DoPost = () => {
  const { user, token, setPosts, posts } = useChange();
  const [text, setText] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [image, setImage] = useState();
  const [imageUrl,setImageUrl]=useState();
  const [loading,setLoading]=useState(false);

  const toast = useToast();
  //   FUNCTION FOR DOING POST
  const handlePost = async (post) => {
    setLoading(true);
    const data = await doPostApi({ text,image }, user, token);
    if (data.success) {
      toast({
        title: "Your post posted successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      setPosts((prevPosts) => [data.post, ...prevPosts]);
    } else {
      toast({
        title: data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
    setLoading(false);
    setText();
    setImage();
    setImageUrl();
    onClose();
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <Box
        display={"flex"}
        justifyContent={"flex-start"}
        bg={"white"}
        width={"clamp(300px,55vw,550px)"}
        p={3}
        m="10px 0 25px 0"
        borderRadius={"lg"}
        borderWidth={"1px"}
        gap={3}
      >
        <Avatar
          size={"sm"}
          cursor={"pointer"}
          name={user.name}
          src={user.pic}
        />
        <Input
          placeholder="Start Doing post"
          borderRadius={"100px"}
          className="post-input"
          isReadOnly
          onClick={onOpen}
        />

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Box display={"flex"} justifyContent={"flex-start"} gap={2}>
                <Avatar
                  size={"sm"}
                  cursor={"pointer"}
                  name={user.name}
                  src={user.pic}
                />
                <Text>{user.name}</Text>
              </Box>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Textarea
                placeholder="What do you want to talk about"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                }}
              />
              {image && (
                <Image
                  src={imageUrl}
                  alt="post img"
                  width="400px"
                  height="300px"
                  marginTop={'30px'}
                />
              )}

              <FormControl id="photo-upload">
                
                <Input
                  id="photo"
                  name="photo"
                  type="file"
                  accept="image/*"
                  top={"20px"}
                  pl={"20px"}
                  
                  onChange={handleImageChange}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handlePost}>
                {loading?"Posting...":"Post"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </div>
  );
};

export default DoPost;
