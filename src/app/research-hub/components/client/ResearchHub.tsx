import { ChevronRight, Upload } from "lucide-react";
import { Card } from "../ui/Card";

export default function ResearchHubPage() {
  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Research Hub</h1>
        <button className="text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium mt-2">
          View All <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
      {/*Recommended Research Opportunities Section*/}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Recommended Research Opportunities
            </h2>
            <button className="text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium mt-2">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </button>
            <p className="text-sm text-gray-600 max-w-2xl">
              Curated Research programs and openings tailored to your interests,
              academic strengths, and future goals. Join ongoing projects or
              apply to Opportunities relevant to your profile
            </p>
          </div>
        </div>

        {/*Research Opportunity Cards*/}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-blue-50 border-blue-100">
            <div className="p-6 h-32">{/* Placeholder for Research Opportunity */}</div>
          </Card>
          <Card className="bg-blue-50 border-blue-100">
            <div className="p-6 h-32">{/* Placeholder for Research Opportunity */}</div>
          </Card>
          <Card className="bg-blue-50 border-blue-100">
            <div className="p-6 h-32">{/* Placeholder for Research Opportunity */}</div>
          </Card>
        </div>

        {/* Upload your research and student research showcase section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Upload your research section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Upload Your Research
            </h2>
            <Card className="bg-blue-50 border-blue-100">
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600">Upload pdf or link here</p>
              </div>
            </Card>
          </div>
          {/* Student Research Showcase section */}
          <div>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Student Research Showcase</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Explore impactful research projects published by fellow students across disciplines. Discover inspiration,
              connect with peers, or feature your own work here.
            </p>
            {/* Research Showcase Cards */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Card className="bg-gray-100 border-gray-200">
                <div className="p-4 h-20">{/* Placeholder for student research item */}</div>
              </Card>
              <Card className="bg-gray-100 border-gray-200">
                <div className="p-4 h-20">{/* Placeholder for student research item */}</div>
              </Card>
              <Card className="bg-gray-100 border-gray-200">
                <div className="p-4 h-20">{/* Placeholder for student research item */}</div>
              </Card>
              <Card className="bg-gray-100 border-gray-200">
                <div className="p-4 h-20">{/* Placeholder for student research item */}</div>
              </Card>
              <Card className="bg-gray-100 border-gray-200">
                <div className="p-4 h-20">{/* Placeholder for student research item */}</div>
              </Card>
              <Card className="bg-gray-100 border-gray-200">
                <div className="p-4 h-20">{/* Placeholder for student research item */}</div>
              </Card>
            </div>
            <button className="text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
        {/* external upload links */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">External Upload Links</h2>
          </div>
          <div className="flex gap-6 mb-4">
            {/* Academia.edu */}
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            {/* Harvard */}
            <div className="w-16 h-16 bg-red-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors">
              <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                <span className="text-red-700 font-bold text-xs">H</span>
              </div>
            </div>
            {/* ResearchGate */}
            <div className="w-16 h-16 bg-teal-500 rounded-full flex flex-col items-center justify-center cursor-pointer hover:bg-teal-400 transition-colors">
              <span className="text-white font-bold text-lg leading-none">R</span>
              <span className="text-white text-xs leading-none">G</span>
            </div>
          </div>
          <button className="text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
