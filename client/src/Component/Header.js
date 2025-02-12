import {
  Box,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Avatar,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate,NavLink } from "react-router-dom";
import { useChange } from "../context/StateProvider";

const Header = () => {
  const { user, setUser,setToken } = useChange();
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    navigate("/");
  };
  return (
    <>
      <Box
        display={"flex"}
        bg={"white"}
        justifyContent={"space-between"}
        alignItems={"center"}
        w={"100vw"}
        p={"5px 10px"}
        borderWidth={"5px"}
        style={{
          position: "sticky",
          top: "0",
          zIndex: "10",
        }}
      >
        <NavLink

          style={{ fontWeight: "500", letterSpacing: "1px",fontSize:"25px",paddingLeft:"30px" }}
          to={"/"}
        >
          NexusHub
        </NavLink>

        <div>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<i className="bi bi-chevron-down"></i>}
            >
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user?.name}
                src={user?.pic}
              />
            </MenuButton>
            <MenuList>
              <MenuItem
                onClick={() => {
                  navigate("/me");
                }}
              >
                My Profile
              </MenuItem>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
    </>
  );
};

export default Header;
