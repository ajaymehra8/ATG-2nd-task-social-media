import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Link,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { loginApi } from "../../Api/authentication";
import { useChange } from "../../context/StateProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { user, setUser, setToken } = useChange();
  const [url, setUrl] = useState();
  const [verifyToken,setVerifyToken]=useState();
  const [forgotPassword, setForgotPassword] = useState(false);

  const submitUpdPass = async () => {
    try{
    const { data } = await axios.patch(
      `${process.env.REACT_APP_API_URL}/api/v1/user/reset-password/${verifyToken}`,
      { password, passwordConfirm: confirmPassword,email }
    );
    console.log(data);
    if (data.success) {
      toast({
        title: data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setForgotPassword(false);

    } else {
      toast({
        title: data.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
    setVerifyToken("");
  }catch(err){
    toast({
      title: err.response.data.message,
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "top",
    });
  }
  };

  const forgotPass = async () => {
    const { data } = await axios.patch(
      `${process.env.REACT_APP_API_URL}/api/v1/user/forgot-password`,
      { email }
    );
    if (data.success) {
      toast({
        title: data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setUrl(data.url);
      setForgotPassword(true);
    } else {
      toast({
        title: data.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };
  const submintHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please fill all the fields.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    const data = await loginApi({ email, password });
    if (data.success) {
      toast({
        title: "Logged in successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setToken(data.token);
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
  };
  return (
    <>
      {!forgotPassword ? (
        <VStack spacing={"5px"} color={"black"}>
          <FormControl id="first-name" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              placeholder="Enter your Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={show ? "text" : "password"}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement width={"4.5rem"}>
                <Button
                  h="1.75rem"
                  size={"sm"}
                  onClick={() => {
                    setShow(!show);
                  }}
                >
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Button
            colorScheme="blue"
            width={"100%"}
            style={{ marginTop: 15 }}
            onClick={submintHandler}
          >
            Log in
          </Button>
          <Link onClick={forgotPass}>Forgot password?</Link>
        </VStack>
      ) : (
        <>
          <VStack spacing={"5px"} color={"black"}>
          <FormControl id="password" isRequired>
              <FormLabel>Enter verify token from your email</FormLabel>
              <Input
                type="password"
                placeholder="Enter token"
                onChange={(e) => setVerifyToken(e.target.value)}
              />
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>

              <InputGroup>
                <Input
                  type={show ? "text" : "password"}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement width={"4.5rem"}>
                  <Button
                    h="1.75rem"
                    size={"sm"}
                    onClick={() => {
                      setShow(!show);
                    }}
                  >
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel>ConfirmPassword</FormLabel>
              <Input
                type={show ? "text" : "password"}
                placeholder="Enter your password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormControl>
            <Button
              colorScheme="blue"
              width={"100%"}
              style={{ marginTop: 15 }}
              onClick={submitUpdPass}
            >
              Update Password
            </Button>
          </VStack>
        </>
      )}
    </>
  );
};

export default Login;
