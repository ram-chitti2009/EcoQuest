import React, { useState } from 'react';

interface SurveyData {
  interests: string;
  goals: string;
  academicLevel?: string;
  skills?: string;
}

interface SurveyDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SurveyData) => void;
}

export default function SurveyDialog({ open, onClose, onSubmit }: SurveyDialogProps) {
  const [form, setForm] = useState<SurveyData>({
    interests: '',
    goals: '',
    academicLevel: '',
    skills: '',
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl p-10 w-full max-w-lg shadow-2xl border border-teal-200 relative animate-fadeIn">
        <h2 className="text-2xl font-extrabold mb-2 text-teal-700 text-center tracking-tight">Tell us a bit about yourself</h2>
        <p className="text-gray-600 text-center mb-6">This helps us personalize your experience and recommend the best resources for you.</p>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSubmit(form);
          }}
          className="space-y-5"
        >
          <input
            className="w-full border border-teal-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-400 focus:outline-none transition text-black placeholder:text-gray-500"
            placeholder="Your interests (e.g. STEM, Arts)"
            value={form.interests}
            onChange={e => setForm(f => ({ ...f, interests: e.target.value }))}
            required
          />
          <input
            className="w-full border border-teal-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-400 focus:outline-none transition text-black placeholder:text-gray-500"
            placeholder="Your goals (e.g. College, Career)"
            value={form.goals}
            onChange={e => setForm(f => ({ ...f, goals: e.target.value }))}
            required
          />
          <select
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-200 focus:outline-none transition text-black bg-white"
            value={form.academicLevel}
            onChange={e => setForm(f => ({ ...f, academicLevel: e.target.value }))}
            required
          >
            <option value="" disabled>Select Academic Level</option>
            <option value="9">9th</option>
            <option value="10">10th</option>
            <option value="11">11th</option>
            <option value="12">12th</option>
            <option value="college">College</option>
            <option value="other">Other</option>
          </select>
          <input
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-200 focus:outline-none transition text-black placeholder:text-gray-500"
            placeholder="Skills"
            value={form.skills}
            onChange={e => setForm(f => ({ ...f, skills: e.target.value }))}
            required
          />
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow transition">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
