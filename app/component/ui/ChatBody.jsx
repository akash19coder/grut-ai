"use client";
import React, { useEffect } from "react";
import { useRef } from "react";
import { Box, Typography } from "@mui/material";

const ChatBody = ({ message }) => {
  return (
    <Box
      ref={chatBodyRef}
      className="h-[60vh] bg-slate-200 p-2 overflow-y-scroll scroll-smooth"
    >
      {message.map((message, index) => {
        return (
          <Box
            key={index}
            className={`m-4 flex flex-row border rounded-md ${
              message.role == "assistant"
                ? "justify-start bg-blue-400 "
                : "items-end bg-blue-200 "
            }`}
          >
            <Box className="inline">
              <Typography key={index}>{message.content}</Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default ChatBody;
