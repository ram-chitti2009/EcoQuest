import OpenAI from "openai";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { jobDescription, jobTitle, companyName, history } = req.body;

  if (!jobDescription || !jobTitle || !companyName || !history) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });

  // Compose the system prompt
  const systemPrompt = `
You are an AI Interview Feedback Specialist. Use the job description, company, job title, and interview history to give feedback on the candidate's performance.
Do not ask questions, simply analyze the provided information and provide constructive feedback.
Answer Any Follow Up Questions.

`;


  //compose the user prompt with job info and interview history
    const  userPrompt = `Job Title: ${jobTitle}
Company: ${companyName}
Job Description:
${jobDescription}
Interview History:
${history.map((item: { q: string; a: string }, idx: number) => `Q${idx + 1}: ${item.q}\nA${idx + 1}: ${item.a}`).join("\n")}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const feedback = response.choices[0]?.message?.content?.trim() || "";

    res.status(200).json({ feedback });
    return;
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ error: "Failed to generate feedback" });
    return;
  }
}
