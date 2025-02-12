import React, { useEffect } from "react";
import {
  Box,
  Container,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import Login from "../Component/authentication/Login";
import Signup from "../Component/authentication/Signup";
import { useNavigate } from "react-router-dom";


const Homepage = () => {
  

  return (
    <Container maxW="xl" centerContent>
      <Box
        display={"flex"}
        justifyContent={"center"}
        bg={"white"}
        w="100%"
        p={3}
        m="40px 0 15px 0"
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Text fontSize={"4xl"} fontFamily={"Work sans"} color={"black"}>
          NexusHub
        </Text>
      </Box>
      <Box
        bg={"white"}
        w="100%"
        p={4}
        borderRadius={"lg"}
        borderWidth={"1px"}
        color="black"
      >
        <Tabs variant={"soft-rounded"}>
          <TabList mb={"1em"}>
            <Tab width={"50%"}>Login</Tab>
            <Tab width={"50%"}>Signup</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
