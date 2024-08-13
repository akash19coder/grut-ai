"use client";
import React from "react";
import { ChatBody, ChatInput, ChatHeader } from "./ui/index";
import { useState } from "react";

const ChatInterface = () => {
  return (
    <div className="w-[30vw] h-[80vh] bg-slate-300 border rounded-md p-4">
      <ChatHeader />
      <ChatBody />
      <ChatInput />
    </div>
  );
};

export default ChatInterface;
