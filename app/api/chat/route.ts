// 1. Import required modules
import { Redis } from "@upstash/redis";
import { UpstashRedisChatMessageHistory } from "langchain/stores/message/upstash_redis";
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { StreamingTextResponse, LangChainStream } from 'ai';
// 2. Initialize Redis client
const client = Redis.fromEnv()
// 3. Set runtime environment
export const runtime = 'edge';
// 4. Define POST function
export async function POST(req: Request) {
  // 5. Initialize stream and handlers
  const { stream, handlers } = LangChainStream();
  // 6. Parse request JSON
  const { messages, userId, loadMessages } = await req.json();
  // 7. Load chat history if requested
  if (userId && loadMessages) {
    const populateHistoricChat = await client.lrange(userId, 0, -1);
    return new Response(JSON.stringify(populateHistoricChat));
  }
  // 8. Initialize memory buffer and chat history
  const memory = new BufferMemory({
    chatHistory: new UpstashRedisChatMessageHistory({
      sessionId: userId,
      client: Redis.fromEnv(),
    }),
  });
  // 9. Initialize chat model
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0,
    streaming: true,
  });
  // 10. Initialize conversation chain
  const chain = new ConversationChain({ llm: model, memory });
  // 11. Get the last message from the input messages
  const lastMessage = messages[messages.length - 1].content;
  // 12. Call the conversation chain with the last message and handlers
  chain.call({
    input: lastMessage, callbacks: [handlers],
  });
  // 13. Return a streaming text response
  return new StreamingTextResponse(stream);
}