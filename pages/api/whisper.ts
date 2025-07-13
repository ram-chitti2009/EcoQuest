import { NextResponse } from "next/server";
import formidable from "formidable";
import OpenAI from "openai";
import * as fs from "fs/promises";
import { createReadStream } from "fs";

export const config = { api: { bodyParser: false } };

export async function POST(req: Request) {
  const form = new formidable.IncomingForm();

  const { files } = await new Promise<{ files: formidable.Files }>((resolve, reject) => {
    form.parse(req as any, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ files });
    });
  });

  const aud = files.audio as unknown as formidable.File;

  if (!aud) {
    return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
  }

  
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const fileStream = createReadStream(aud.filepath);
    if (!fileStream) {
        return NextResponse.json({ error: "Failed to read audio file" }, { status: 500 });
    }

  const response = await openai.audio.transcriptions.create({
    file: fileStream,
    model: "whisper-1",
    // language: "en" // Optional, to help accuracy
  });

  return NextResponse.json({
    transcription: response.text || "No transcription available",
  });
}
