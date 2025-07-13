"use client";
import React from "react";

export default function LoadingScreen({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="flex flex-col items-center">
        <svg className="animate-spin h-12 w-12 text-teal-600 mb-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <span className="text-teal-600 text-xl font-semibold drop-shadow-lg">{message}</span>
      </div>
    </div>
  );
}
