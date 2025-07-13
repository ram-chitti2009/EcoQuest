import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId } = req.body;
  console.log("[curate-scholarships] Incoming userId:", userId);

  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  const accessToken = authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer ")
    ? authHeader.replace("Bearer ", "")
    : undefined;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { headers: { Authorization: `Bearer ${accessToken}` } }
    }
  );

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .rpc('get_user_profile', { uid: userId });
  console.log("[curate-scholarships] Supabase profile query result:", { profile, profileError });
  if (profileError || !profile) {
    // alert("Profile not found"); // Removed: alert is not valid in Node.js/server
    console.error("Profile not found", profileError, profile);
    return res.status(500).json({ error: "Profile not found" });
  }

  // Get Scholarship List
  // Use contains for text[] columns
  const { data: scholarships, error: scholarshipsError } = await supabase
    .from("scholarship_db")
    .select("*")
  console.log("[curate-scholarships] Scholarships query result:", { scholarships, scholarshipsError });

  if (scholarshipsError) {
    console.error("Failed to fetch scholarships", scholarshipsError);
    return res.status(500).json({ error: "Failed to fetch scholarships" });
  }

  if (!scholarships || scholarships.length === 0) {
    console.warn("No scholarships found for user profile", profile);
    return res.status(200).json({ result: [] });
  }

  const prompt = `
You are an expert college admissions and scholarship advisor. Carefully analyze the following user profile and the list of scholarships. Your goal is to select ONLY the 5 most relevant scholarships for this user, based on eligibility, academic level, field of study, interests, and any other matching criteria. Prioritize scholarships that the user is most likely to qualify for and benefit from. If you cannot find 5 perfect matches, return the closest matches, and if there are no good matches, return relevant 5 scholarships from the list. Never return an empty array.

User Profile:
- Grade: ${profile.grade}
- Academic Level: ${profile.academic_level}
- Field of Study: ${profile.field_of_study}
- Interests: ${profile.interests}
- Goals: ${profile.goals}

Scholarship List:
${JSON.stringify(scholarships, null, 2)}

Return ONLY a valid JSON array of exactly 5 objects, each matching this interface, with no explanation, no markdown, and no extra text:

interface Scholarship {
  id: number;
  name: string;
  description: string;
  amount: string;
  deadline: string;
  provider: string;
  eligibility: string[];
  category: string;
  type: string;
  educationLevel: string;
  fieldOfStudy: string;
  renewableStatus: string;
  location: string;
  applicationDifficulty: string;
  tags: string[];
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });
    const result = response.choices[0].message.content;
    console.log("[curate-scholarships] Raw OpenAI result:", result);
    let curatedScholarships = [];
    try {
      const cleanResult = result?.trim().replace(/^```(?:json)?\s*|```$/g, "").trim();
      curatedScholarships = JSON.parse(cleanResult ?? "[]");
      if (!Array.isArray(curatedScholarships)) {
        throw new Error("OpenAI did not return a JSON array");
      }
    } catch (e) {
      console.error("Failed to parse OpenAI response as JSON array", e, result);
      return res.status(500).json({ error: "OpenAI did not return a valid JSON array.", details: result });
    }
    return res.status(200).json({ result: curatedScholarships });
  } catch (err) {
    console.error("OpenAI API error:", err);
    return res.status(500).json({ error: "Failed to get response from OpenAI API", details: err instanceof Error ? err.message : err });
  }
}



