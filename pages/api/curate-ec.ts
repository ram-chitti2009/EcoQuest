import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }
    const { userId } = req.body;
    // Extract access token from Authorization header
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    const accessToken = authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer ")
        ? authHeader.replace("Bearer ", "")
        : undefined;
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }
    if (!accessToken) {
        return res.status(401).json({ error: "Missing or invalid access token" });
    }
    // Create Supabase client with Authorization header
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: { headers: { Authorization: `Bearer ${accessToken}` } }
        }
    );

    //fetch user profile from Supabase
    const { data: profile, error: profileError } = await supabase
        .rpc('get_user_profile', { uid: userId });
    console.log("[curate-scholarships] Supabase profile query result:", { profile, profileError });
    if (profileError || !profile) {
        console.error("Profile not found", profileError, profile);
        return res.status(500).json({ error: "Profile not found" });
    }

    console.log("[curate-ec] Incoming userId:", userId);

    // Fetch extracurricular activities from Supabase
    const { data: activities, error: activitiesError } = await supabase
        .from("extracurricular_db")
        .select("*");

    if (activitiesError || !activities) {
        console.error("[curate-ec] Error fetching activities:", activitiesError);
        return res.status(500).json({ error: "Error fetching activities" });
    }

    const prompt = `
You are an expert college admissions advisor. Analyze the user profile and the list of extracurricular activities. Select ONLY the 5 most relevant activities for this user, based on interests, grade, skills, and impact. If you cannot find 5 perfect matches, return the closest matches, but always return 5. Respond ONLY with a valid JSON array of 5 objects, no markdown, no explanation.

User Profile: ${JSON.stringify(profile, null, 2)}
EC List: ${JSON.stringify(activities, null, 2)}
Return ONLY a valid JSON array of exactly 5 objects.
`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        });
        let result = response.choices[0].message.content?.trim();
        // Remove markdown code block if present
        if (result?.startsWith("```")) {
            result = result.replace(/^```[a-zA-Z]*\n?/, "").replace(/```$/, "");
        }
        const curatedActivities = JSON.parse(result ?? "[]");
        if (!Array.isArray(curatedActivities)) {
            throw new Error("OpenAI did not return a JSON array");
        }
        return res.status(200).json({ result: curatedActivities });
    } catch (err) {
        console.error("OpenAI API error:", err);
        return res.status(500).json({ error: "Failed to get response from OpenAI API", details: err instanceof Error ? err.message : err });
    }
}