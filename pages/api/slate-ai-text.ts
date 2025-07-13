import type { NextApiRequest, NextApiResponse } from "next";
import { ChatOpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { ChatPromptTemplate } from "@langchain/core/prompts";


const model = new ChatOpenAI({
  temperature: 0.5,        // controls creativity of responses
  modelName: "gpt-4",      // use GPT-4 model
  openAIApiKey: process.env.OPENAI_API_KEY,  //  OpenAI API key from env variables
});
const systemPrompt = `You are Slate AI, an expert assistant for high school students applying to college. You help with every aspect of the college application process: essays, resumes, activities, recommendations, timelines, school selection, admissions strategy, and more. Give clear, actionable, and supportive advice for any college application question.`;

const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", systemPrompt],
  ["human", "{input}"],
]);

const chain = new ConversationChain({
  llm: model,
  prompt: promptTemplate,
  verbose: true,          // logs conversation for debugging
});


//Slate AI handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const { input, isFirstMessage } = req.body;

  // If this is the first message, send the greeting (do NOT include essay or prompt)
  if (isFirstMessage) {
    return res.status(200).json({ text: "Hi! I'm Slate AI, I'm here to answer any questions about college, essays, admissions, essay reviews, etc." });
  }

  if (!input) {
    return res.status(400).json({ error: 'Missing "input" in request body' });
  }

  try {
    // Pass user Input to langchain conversation chain
    const response = await chain.call({ input });
    res.status(200).json({ text: response.response });
  } catch (error) {
    console.error("LangChain API Error", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

