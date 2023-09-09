"use client";

// 1. Import statement
import { useRouter } from "next/navigation";
// 2. Default function for HomePage component
export default function HomePage() {
  const router = useRouter();
  const userId = "UUID-abc123";
// 3. Handling the button click event
  const handleClick = () => {
    const timestamp = Math.round(new Date().getTime());
    router.push(`/chat-history/${userId}-${timestamp}`);
  };
// 4. Rendering the HomePage component
  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <button onClick={handleClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Click here to start your first chat
        </button>
      </div>
    </>
  );
}
