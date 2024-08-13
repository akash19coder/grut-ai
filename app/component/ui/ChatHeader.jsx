import React from "react";

const ChatHeader = () => {
  return (
    <div className="h-[5vh] m-2 flex justify-center items-center gap-2 flex-row ">
      <Avatar />
      <Typography variant="h6" className=" text-black">
        grut.ai
      </Typography>
    </div>
  );
};

export default ChatHeader;
