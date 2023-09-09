// 1. Import statement
import { Redis } from "@upstash/redis";
// 2. Creating a Redis client from environment variables
const client = Redis.fromEnv()
// 3. Defining the runtime as 'edge'
export const runtime = 'edge';
// 4. Defining the structure of the JSON request
interface RequestJson {
    timestamp: number;
    userId: string;
    chatHistoryAction: string;
}
// 5. Handling POST request
export async function POST(req: Request): Promise<Response> {
// 6. Parsing the request JSON data
    const { userId, chatHistoryAction } = await req.json() as RequestJson;
// 7. Checking the chatHistoryAction for retrieval
    if (chatHistoryAction === 'retrieve') {
// 8. Retrieving chat keys based on userId
        const chatKeys = await client.keys(`${userId}-*`);
        return new Response(JSON.stringify(chatKeys));
    }
// 9. Returning an error response if chatHistoryAction is not 'retrieve'
    return new Response('error');
}
