// 1. Importing necessary React hooks and components
import { useEffect, useRef, useLayoutEffect, FormEvent } from "react";
import { useParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useChat } from "ai/react"; // Custom chat-related hook
interface ChatAreaProps {
  chatId: string;
  setChatId: (chatId: string) => void;
}
export const ChatArea = ({ chatId, setChatId }: ChatAreaProps) => {
  // 2. Getting route parameters
  const params = useParams();
  // 3. Using custom chat hook
  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat();
  // 4. Function to load chat messages
  const handleLoadChat = async () => {
    if (params.id && typeof params.id === "string") {
      setChatId(params.id);
      fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          test: "testing",
          userId: params.id,
          loadMessages: true,
        }),
      }).then((resp) => {
        resp.json().then((data: any[]) => {
          if (data.length === 0) {
            return;
          }
          if (data.length > 0) {
            // 5. Filtering and mapping chat data
            data = data.filter((item) => item.data.content);
            data = data.map((item, i) => {
              return {
                content: item.data.content,
                role: item.type === "human" ? "user" : "ai",
              };
            });
          }
          setMessages(data);
        });
      });
    }
  };
  // 6. Function to handle all submits
  const handleAllSubmits = (e: any) => {
    if (e.key === "Enter") {
      handleSubmit(e as FormEvent<HTMLFormElement>, {
        options: {
          body: {
            userId: chatId,
          },
        },
      });
    }
  };
  // 7. Creating a ref for the message container
  const containerRef = useRef<HTMLDivElement | null>(null);
  // 8. Using useLayoutEffect to scroll to the bottom of the container
  useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight || 0;
    }
  }, [messages]);
  // 9. Using useEffect to load chat messages when the component mounts
  useEffect(() => {
    handleLoadChat();
  }, []);
  // 10. Rendering the ChatArea component
  return (
    <div className="h-screen w-full m-5 flex flex-col justify-between ">
      <div ref={containerRef} className="h-full flex flex-col overflow-y-auto overflow-x-hidden">
        {messages.length > 0
          ? messages.map((m) => (
              <div key={m.id} className={`${m.role === "user" ? "flex justify-end" : "flex justify-start"} my-1`}>
                <div
                  className={`max-w-3/4 px-4 py-2 rounded-lg ${
                    m.role === "user" ? "bg-blue-600 text-white" : "bg-gray-200"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))
          : null}
      </div>
      <form onSubmit={handleAllSubmits} className="">
        <Textarea
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
          onKeyDown={handleAllSubmits}
          className="w-full my-2"
        />
        <Button className="w-full mb-2">Send</Button>
      </form>
    </div>
  );
};
