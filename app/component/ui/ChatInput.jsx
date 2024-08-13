import React from "react";
import { Box, TextField, Button } from "@mui/material";
import { IoIosSend } from "react-icons/io";
import { useRef, useEffect } from "react";

const ChatInput = ({ message, setMessage }) => {
  const chatRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/chat", {
        headers: {
          Accept: "application/json",
          method: "GET",
        },
      });
      console.log(response);
      const result = await response.json();
      console.log(result);
    };

    fetchData();
  }, []);

  const handleOnClick = async (e) => {
    setMessage([
      ...message,
      {
        role: "user",
        content: chatRef.current.value,
      },
      {
        role: "assistant",
        content: "I am ben10",
      },
    ]);
  };

  return (
    <Box className="pt-2 flex gap-4 justify-center items-center">
      <TextField
        id="standard-basic"
        type="text"
        label="Type your message..."
        variant="standard"
        className="w-[70%]"
        inputRef={chatRef}
      />
      <Button className=" scale-125 pt-10" onClick={handleOnClick}>
        <IoIosSend className=" scale-150 rotate-45" />
      </Button>
    </Box>
  );
};

export default ChatInput;
