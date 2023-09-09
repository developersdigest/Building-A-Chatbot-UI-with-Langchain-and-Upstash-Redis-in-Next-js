// 1. Import statements
import { Sidebar } from "@/components/Sidebar";
import { ChatArea } from "@/components/ChatArea";
import { useState } from "react";

// 2. Default function for Chat component
export default function Chat() {
  const [chatId, setChatId] = useState("");
  const userId = "UUID-abc123";

  // 3. Rendering the Chat component
  return (
    <div className="w-full h-screen flex justify-between items-center">
      <Sidebar userId={userId} />
      <ChatArea chatId={chatId} setChatId={setChatId} />
    </div>
  );
}
