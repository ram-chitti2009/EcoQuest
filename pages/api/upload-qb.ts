/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextApiRequest, NextApiResponse } from "next";
import Papa from 'papaparse';
import XLSX from 'xlsx';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import * as formidable from 'formidable';
import { promises as fs } from 'fs';
import { addQuestion } from '@/lib/questionStore';

export const config = { api: { bodyParser: false } };

//function to parse CSV Content
async function parseCSV(content: string) {
  const parsed = Papa.parse<any>(content, { header: true, skipEmptyLines: true });
  if (parsed.errors.length) throw new Error('CSV parse failed');
  return parsed.data;
}

//function to parse xlsx
async function parseExcel(buffer: Buffer) {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetNames = workbook.SheetNames;
  const data: any[] = [];
  sheetNames.forEach((sheetName: string | number) => {
    const worksheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(worksheet);
    data.push(...json);
  });
  return data;
}

//function to parse pdf
async function parsePDF(buffer: Buffer) {
    const data = await pdfParse(buffer);
    return data.text.split(/\n\s*\n/).filter(Boolean).map(q => ({ question: q.trim() }));
}


async function parseDOCX(buffer: Buffer) {
  const res = await mammoth.extractRawText({ buffer });
  return res.value.split(/\n\s*\n/).filter(Boolean).map((q) => ({ question: q }));
}


function normalize(row: any) {
  const text = row.question || row.question_text || row.q || row.text;
  if (!text || !text.trim()) return null;

  const tags = typeof row.tags === 'string'
    ? row.tags.split(',').map((t: string) => t.trim())
    : Array.isArray(row.tags)
      ? row.tags
      : [];

  return {
    question_text: text.trim(),
    category: row.category || 'General',
    difficulty: row.difficulty || 'Medium',
    tags,
    source: 'user',
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }
  try {
    const form = new formidable.IncomingForm();
    const { fields, files } = await new Promise<{ fields: formidable.Fields, files: formidable.Files }>((resolve, reject) => {
      form.parse(req as any, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });
    const fileKey = Object.keys(files)[0];
    const uploaded = files[fileKey];
    const file = Array.isArray(uploaded) ? uploaded[0] : uploaded as unknown as formidable.File;
    console.log('Uploaded file:', file);
    if (!file || !file.filepath) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }
    const buffer = await fs.readFile(file.filepath);
    let raw: any[] = [];
    try {
      if (file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel') {
        const content = buffer.toString('utf-8');
        raw = await parseCSV(content);
      } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        raw = await parseExcel(buffer);
      } else if (file.mimetype === 'application/pdf') {
        raw = await parsePDF(buffer);
      } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        raw = await parseDOCX(buffer);
      } else {
        res.status(400).json({ error: 'Unsupported file type' });
        return;
      }
      console.log("raw parsed data" , raw)
    } catch (error) {
      res.status(500).json({ error: 'Failed to parse file' });
      return;
    }
    const normalized = raw.map(normalize).filter(Boolean);
    if (normalized.length === 0) {
      res.status(400).json({ error: 'No valid questions found' });
      return;
    }
    addQuestion(normalized as any);
    res.status(200).json({ message: 'Questions uploaded successfully', count: normalized.length });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Unexpected server error' });
  }
}
