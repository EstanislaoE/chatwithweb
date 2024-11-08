import { Message } from "ai/react";
import { Pinecone } from "@pinecone-database/pinecone";
import { queryPineconeVectorStore } from "@/utils";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
//import { HarmBlockThreshold } from "@google/generative-ai";
import { streamText } from "ai";

const google = createGoogleGenerativeAI({
  // custom settings
  baseURL: "https://generativelanguage.googleapis.com/v1beta",
  apiKey: process.env.GEMINI_API_KEY,
});

const model = google("gemini-1.5-pro-latest", {
  safetySettings: [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
  ],
});

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

export async function POST(req: Request, res: Response) {
  const reqBody = await req.json();
  console.log(reqBody);
  const messages: Message[] = reqBody.messages;
  const userQuestion = messages[messages.length - 1].content;
  const reportData = reqBody.data.reportData;

  const searchQuery = `Represent this sentence for searching relevant passages: The Files suggest (NOTE: A profesional should be consulted as well): \n${reportData} \n\n ${userQuestion}`;
  const retrievals = await queryPineconeVectorStore(
    pc,
    "index-one",
    "fddata",
    searchQuery
  );

  //final prompt to the gemini API
  const finalPrompt = `Here is a template for a healthy plate based on a 2000 calorie plan. 
  The plate includes fruits, grains, vegetables, protein, dairy. Based on your knowledge answer to
  user queries. Based on you knowledge reccomend how user should have a healthy eating habit.
  
  \n\n**Summary: **\n${reportData}.
  \n**end of summary**

  \n\nUser Query:**\n${userQuestion}?
  \n**end of user query**

  \n\n**Findings based on provided knowledge**
  \n\n${retrievals}.

  \n\nProvide thorough justification for your answer.
  \n\n**Answer:***\n\n
  `;

  //stream response from gemini
  const result = await streamText({
    model: model,
    prompt: finalPrompt,
  });

  return result.toDataStreamResponse();

  // return new Response("dunno response", { status: 200 });
  // // return result.toDataStreamResponse();
}
