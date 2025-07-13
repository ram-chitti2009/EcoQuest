import OpenAI from "openai";
import { getAllQuestions } from "@/lib/questionStore";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { jobDescription, jobTitle, companyName, history } = req.body;

  if (!jobDescription || !jobTitle) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });

  // Compose the system prompt
  const systemPrompt = `
You are an AI Interviewer.
Ask one interview question at a time based on the job description, job title, and company name provided.
Ask only open-ended, detailed questions focused on skills, experience, and culture fit.
Avoid yes/no or trivia-style questions.
Use the provided database questions as inspiration, but you are encouraged to generate your own unique and relevant questions as well.
Do not simply repeat or rephrase the database questions.
Adapt each next question based on the candidate's previous answers.
Do not mention jobTitle, jobDescription, or companyName directly in the questions.
Respond ONLY with the next question, no explanations, markdown, or extra text.
`;

  // Compose the user prompt with job info and DB questions
  const baseQuestions = getAllQuestions();
  const questionText = baseQuestions.map(q => q.question_text).join("\n- ");

  let userPrompt = `
Job Title: ${jobTitle}
Company: ${companyName}
Job Description:
${jobDescription}

Database Questions:
- ${questionText}
`;

  // Add interview history if present
  if (Array.isArray(history) && history.length > 0) {
    userPrompt += `\nInterview so far:\n`;
    history.forEach((item: { q: string; a: string }, idx: number) => {
      userPrompt += `Q${idx + 1}: ${item.q}\nA${idx + 1}: ${item.a}\n`;
    });
    userPrompt += `\nAsk the next relevant interview question.`;
  } else {
    userPrompt += `\nStart the interview by asking the first relevant question.`;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const nextQuestion = response.choices[0]?.message?.content?.trim() || "";

    res.status(200).json({ question: nextQuestion });
    return;
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ error: "Failed to generate question" });
    return;
  }
}
