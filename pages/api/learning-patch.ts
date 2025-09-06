import type { NextApiRequest, NextApiResponse } from "next";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

export default async function handler(req:NextApiRequest, res: NextApiResponse){

    const query = req.query.q || "eco sustainability";
    const maxResults = req.query.maxResults || 10;

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      query as string
    )}&type=video&videoDuration=short&maxResults=${maxResults}&key=${GOOGLE_API_KEY}`;

    try{
        const response = await fetch(url);
        const data = await response.json();
        const videoLinks = data.items.map((item:any) => `https://www.youtube.com/shorts/${item.id.videoId}`);

        res.status(200).json(videoLinks);
    } catch (error) {
        console.error("Error fetching YouTube data:", error);
        res.status(500).json({ error: "Failed to fetch YouTube data" });
    }

}