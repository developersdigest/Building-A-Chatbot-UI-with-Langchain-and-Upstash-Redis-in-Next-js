// 1. Import necessary modules and components
import { useState, useEffect } from "react"; // Import useState and useEffect hooks from React
import { useParams } from "next/navigation"; // Import the useParams hook from Next.js
import { Button } from "@/components/ui/button"; // Import the Button component
import { SidebarNav } from "@/components/ui/sidebar-nav"; // Import the SidebarNav component
import { useRouter } from "next/navigation"; // Import the useRouter hook from Next.js

// Define the shape of each item in the sidebar
interface Item {
  href: string;
  title: string;
}

// Define the props for the Sidebar component
interface SidebarProps {
  userId: string;
}

// Define the Sidebar component
export const Sidebar = ({ userId }: SidebarProps) => {
  const params = useParams();
  const [items, setItems] = useState<Item[]>([]);
  const router = useRouter();

  // 2. Function to retrieve sidebar data from an API
  const handleRetrieveSidebar = async () => {
    const response = await fetch("/api/retrieve-history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatHistoryAction: "retrieve", userId }),
    });

    if (response.ok) {
      // 3. Parse and format chat history data
      let chatHistory = await response.json();
      chatHistory = chatHistory.reverse();
      let dbChatHistory = chatHistory.map((item: string) => {
        let parseDate = Number(item.replace(`${userId}-`, ""));
        return {
          href: `/chat-history/${item}`,
          title: new Date(parseDate).toLocaleString(),
        };
      });

      // 4. Check if a specific chat ID is provided in the URL params
      if (
        params.id &&
        dbChatHistory.filter((item: { href: string }) => item.href === `/chat-history/${params.id}`).length === 0
      ) {
        const unixTime = params.id.toString().replaceAll(`${userId}-`, "");

        // 5. Add a new chat history item to the beginning of the list
        setItems([
          {
            href: `/chat-history/${userId}-${unixTime}`,
            title: new Date(Number(unixTime)).toLocaleString(),
          },
          ...dbChatHistory,
        ]);
      } else {
        // 6. Set the sidebar items to the retrieved chat history
        setItems(dbChatHistory);
      }
    } else {
      // 7. Handle errors if the API request fails
      console.error("Error retrieving chat history");
    }
  };

  // 8. Function to handle creating a new chat and updating the URL
  const handleUpdateSidebar = async () => {
    const chatId = Date.now().toString();
    router.push(`/chat-history/${userId}-${chatId}`);
  };

  // 9. Use useEffect to call handleRetrieveSidebar when the component mounts
  useEffect(() => {
    handleRetrieveSidebar();
  }, []);

  return (
    <div className="w-64 h-full top-0 overflow-y-auto bg-gray-200 flex flex-col justify-top px-2">
      <div className="ml-auto w-full">
        {/* 10. Render a button to create a new chat */}
        <Button className="w-full my-2" onClick={handleUpdateSidebar}>
          New Chat
        </Button>
      </div>
      {/* 11. Render the sidebar navigation with the retrieved items */}
      <SidebarNav items={items} className="flex-col" />
    </div>
  );
};
