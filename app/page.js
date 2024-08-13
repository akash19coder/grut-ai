"use client";
import React from "react";
import Avatar from "@mui/material/Avatar";
import { Box, Typography } from "@mui/material";
import { TextField, Button } from "@mui/material";
import { IoIosSend } from "react-icons/io";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      type: "assistant",
      text: "Hallo, I am GrutAI. I am trained on Grut's daily journals. Shoot your questions right away...",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const handleOnClick = async (e) => {
    e.preventDefault();

    setMessages([
      ...messages,
      {
        type: "user",
        text: input,
      },
    ]);

    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        type: "user",
        text: input,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    const data = await response.json();
    console.log(data);
    setMessages([
      ...messages,
      { type: "user", text: input },
      { type: "assistant", text: data.text },
    ]);
    setLoading(false);
    setInput("");
  };

  const chatBodyRef = useRef();

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between xs:p-6 md:p-24">
      <div className="xs:w-[90vw] md:w-[30vw] h-[90vh] bg-white border p-2">
        {/* chat header  */}
        <div className="h-[7vh] m-2 flex justify-start items-center gap-2 flex-row ">
          <Avatar src="grut.jpg" className=" scale-100" />
          <p variant="h6" className="font-bold text-black inter">
            GrutAI
          </p>
          <p className="w-[5px] h-[5px] bg-green-600 rounded-full"></p>
          <p className="text-xs"> Active Now </p>
        </div>

        {/* Chat body */}
        <Box
          ref={chatBodyRef}
          className="inter xs:text-md md:text-xs h-[68vh] bg-gradient-to-t from-[#FDF6FB] to-[#F1F7FC] p-2 overflow-y-scroll scroll-smooth no-scrollbar"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`m-1 p-2 ${
                message.type === "user"
                  ? " text-white flex justify-end"
                  : " text-black flex justify-start"
              }`}
            >
              {message.text !== "..." && (
                <div
                  className={`p-2 border rounded-br-md rounded-tr-md rounded-bl-md max-w-xs ${
                    message.type === "user"
                      ? "bg-[#B084CC] text-white"
                      : "bg-white text-black"
                  }`}
                >
                  {message.text === "..." && loading ? (
                    <p className="text-gray-500">...typing</p> // Display loading indicator
                  ) : (
                    <>
                      {message.type === "assistant" && (
                        <p className="font-bold pb-1 text-xs">Grut AI</p>
                      )}
                      <p>{message.text}</p>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </Box>

        <Box className="pt-2 flex gap-4 justify-center items-center">
          <TextField
            type="text"
            label="Type your message..."
            value={input}
            className="w-[70%]"
            onChange={(e) => setInput(e.target.value)}
          />
          <Button className=" scale-125 pt-10" onClick={handleOnClick}>
            <IoIosSend className=" scale-150 rotate-45" />
          </Button>
        </Box>
      </div>
    </main>
  );
}
