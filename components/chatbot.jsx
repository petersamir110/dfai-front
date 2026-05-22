"use client";
import { useState } from "react";
import Chat from "./chat";
import { AiOutlineRobot } from "react-icons/ai";

export default function ChatBot() {
  const [chatBotIsOpend, setChatBotIsOpen] = useState(false);
  return (
    <div className="">
      {chatBotIsOpend === false && (
        <button
          className="fixed bottom-6 right-6 z-50 hover:text-blue-400 transition-colors cursor-pointer"
          onClick={() => {
            setChatBotIsOpen(!chatBotIsOpend);
          }}
        >
          <AiOutlineRobot size={48} />
        </button>
      )}
      {chatBotIsOpend === true && (
        <div className="h-full w-96  ">
          <Chat
            chatBotIsOpend={chatBotIsOpend}
            setChatBotIsOpen={setChatBotIsOpen}
          />
        </div>
      )}
    </div>
  );
}
