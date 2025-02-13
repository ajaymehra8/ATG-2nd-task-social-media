import React from "react";
import {
  Card,
  Heading,
  Stack,
  Button,
  CardBody,
  CardFooter,
  Image,
  Flex,
  Avatar,
  Text,
  Box,
} from "@chakra-ui/react";

const Comment = ({ comment }) => {
  return (
    <Card
      direction={"row"}
      overflow="hidden"
      variant="outline"
      p={2}
      mb={"10px"}
    >
      {comment && (
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          alignItems={"center"}
          justifyContent="center"
          width={"50px!important"}
        >
          <Avatar name={comment?.user?.name} src={comment?.user?.pic} mb={0} />

          <Text size="lg" mt={"-10px"}>
            {comment?.user?.name.split(" ")[0]}
          </Text>
        </Box>
      )}

      <CardBody>
        <Text>
          {comment?.text?.charAt(0).toUpperCase() +
            comment?.text?.slice(1).toLowerCase()}
        </Text>
      </CardBody>
    </Card>
  );
};

export default Comment;
