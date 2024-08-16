"use client";
import React from "react";
import { Avatar, Box, Button } from "@mui/material";
import { IoIosSend } from "react-icons/io";
import { useState, useRef, useEffect } from "react";
import { ShimmerText } from "react-shimmer-effects";
import Typewriter from "typewriter-effect";
import StarsCanvas from "./component/Stars";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      type: "assistant",
      text: "Hey Grut, How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(null);

  const handleOnClick = async (e) => {
    e.preventDefault();

    setMessages([
      ...messages,
      {
        type: "user",
        text: input,
      },
      {
        type: "shimmer",
        text: "generating....",
      },
    ]);

    setLoading(true);
    console.log("messages", messages);
    console.log(messages[messages.length]);
    setLoadingMessageIndex(messages.length);

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
    setLoadingMessageIndex(null);
    setInput("");
  };

  const chatBodyRef = useRef();

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  });

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between xs:p-6 md:p-6">
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
            className="xs:text-md md:text-[14px] h-[68vh] bg-gradient-to-t from-[#FDF6FB] to-[#F1F7FC] p-2 overflow-y-scroll scroll-smooth no-scrollbar"
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
                <div
                  className={`p-2 border rounded-br-md rounded-tr-md rounded-bl-md max-w-xs ${
                    message.type === "user"
                      ? "bg-[#B084CC] text-white"
                      : "bg-white text-black"
                  }`}
                >
                  {loading &&
                  message.type === "shimmer" &&
                  index === loadingMessageIndex ? (
                    <ShimmerText
                      line={1}
                      gap={10}
                      className="bg-red-500 w-[200px]"
                    />
                  ) : (
                    <>
                      {message.type === "assistant" && (
                        <p className="radiance font-bold pb-1 text-xs">
                          Grut AI
                        </p>
                      )}
                      {message.type === "assistant" ? (
                        <Typewriter
                          options={{
                            strings: message.text,
                            autoStart: true,
                            delay: 5,
                          }}
                        />
                      ) : (
                        <p>{message.text}</p>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </Box>

          <Box className="p-2 bg-[#e2e9e5] text-[14px] flex gap-4 justify-center items-center">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              className=" flex-1 bg-transparent outline-none"
              onChange={(e) => setInput(e.target.value)}
            />
            <Button className=" scale-125 pt-10" onClick={handleOnClick}>
              <IoIosSend className=" scale-150 rotate-45" />
            </Button>
          </Box>
        </div>
      </main>
      <StarsCanvas />
    </>
  );
}
