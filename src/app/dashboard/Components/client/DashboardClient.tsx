"use client";

import TodoList from "../Todo-card";
import { FileSearch } from "lucide-react";
import { CalendarComponent } from "../Calendar";
import { ToolsCard } from "../tools-card";



export default function DashboardClient() {
  return (
      <div className="flex h-screen bg-gray-50">
        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-8 md:pl-8 pl-20">
            {/* Hero Section */}
            <div className="flex flex-col sm:flex-row items-start justify-between mb-8 gap-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome to
                  <br />
                  Your SlateSpace
                </h1>
                <p className="text-gray-600 mb-6 max-w-md">
                  Your personalized roadmap to academic and extracurricular
                  success
                </p>
                <button className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-full flex items-center justify-center w-auto transition-all duration-200 shadow-md hover:shadow-lg">
                  <FileSearch className="w-5 h-5 mr-2" />
                  <span className="font-medium">Ask Slate</span>
                </button>
              </div>
              <div className="text-gray-400 text-sm hidden sm:block">
                <div className="w-64 md:w-72 lg:w-80 h-40 md:h-48 rounded-lg overflow-hidden shadow-lg">
                  <video
                    src="/videos/SlatePath-Animation-2x.mp4"
                    autoPlay={true}
                    playsInline
                    loop={true}
                    muted={true}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <TodoList />
              <CalendarComponent />
            </div>

            {/* Tools Section */}
            <ToolsCard />
          </div>
        </div>
      </div>
  );
}
