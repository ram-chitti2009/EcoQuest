"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChangeEvent } from "react";
import { Card, CardHeader, CardContent } from "../../../litterLens/components/ui/Card";
import { Button } from "../../../litterLens/components/ui/Button";
import { Filter, Heart } from "lucide-react";
import { Badge } from "../../../ec-db/components/ui/Badge";
import { Header } from "../../../litterLens/components/layout/Header";
import { Input } from "../../../ec-db/components/ui/Input";
import Select from "../../../ec-db/components/ui/Select";
import { createClient } from "@/utils/supabase/client";

// Define scholarship interface
interface Scholarship {
  id: number;
  name: string;
  description: string;
  amount: string;
  deadline: string;
  provider: "Slate" | "External";
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

// Sample scholarship data
const scholarshipData: Scholarship[] = [
  {
    id: 1,
    name: "Future Leaders Scholarship",
    description:
      "Award for students demonstrating exceptional leadership potential and academic excellence.",
    amount: "$5,000",
    deadline: "September 15, 2025",
    provider: "Slate",
    eligibility: ["High School Senior", "3.5+ GPA"],
    category: "Academic",
    type: "Merit-based",
    educationLevel: "Undergraduate",
    fieldOfStudy: "Any",
    renewableStatus: "Non-renewable",
    location: "National",
    applicationDifficulty: "Medium",
    tags: ["Leadership", "Essay Required"],
  },
  {
    id: 2,
    name: "STEM Excellence Award",
    description:
      "Supporting students pursuing careers in Science, Technology, Engineering, and Mathematics.",
    amount: "$10,000",
    deadline: "October 31, 2025",
    provider: "Tech Innovation Foundation",
    eligibility: ["High School Senior", "College Student", "3.7+ GPA"],
    category: "STEM",
    type: "Merit-based",
    educationLevel: "Undergraduate",
    fieldOfStudy: "STEM",
    renewableStatus: "Renewable",
    location: "National",
    applicationDifficulty: "High",
    tags: ["Research", "Interview Required"],
  },
  {
    id: 3,
    name: "Community Service Grant",
    description:
      "For students who have demonstrated significant commitment to community service.",
    amount: "$2,500",
    deadline: "November 30, 2025",
    provider: "Community Foundation",
    eligibility: ["High School Student", "100+ volunteer hours"],
    category: "Service",
    type: "Need-based",
    educationLevel: "High School",
    fieldOfStudy: "Any",
    renewableStatus: "Non-renewable",
    location: "Local",
    applicationDifficulty: "Low",
    tags: ["Community Service", "References Required"],
  },
];

// Define filter interface
interface ScholarshipFilters {
  category: string;
  type: string;
  amount: string;
  educationLevel: string;
  fieldOfStudy: string;
  deadline: string;
}

export default function ScholarshipDbClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [curatedScholarships, setCuratedScholarships] = useState<Scholarship[]>([]);
  const [isCurating, setIsCurating] = useState(false);

  const [filters, setFilters] = useState<ScholarshipFilters>({
    category: "All",
    type: "All",
    amount: "All",
    educationLevel: "All",
    fieldOfStudy: "All",
    deadline: "All",
  });

  const [allScholarships, setAllScholarships] = useState<Scholarship[]>([]);

  const supabase = createClient();

  // Fetch user on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      console.log(data.user); // log the new user, not the old state
    });
  }, [supabase.auth]);


  // Subscribe to realtime changes in scholarship_db
  useEffect(() => {
    const fetchAllScholarships = async () => {
      try {
        const { data, error } = await supabase.from("scholarship_db").select("*");
        if (error) {
          console.error("Failed to fetch scholarships:", error);
        } else if (Array.isArray(data)) {
          setCuratedScholarships([]); 
          setAllScholarships(data);
        }
      } catch (err) {
        console.error("Error fetching scholarships:", err);
      }
    };
    fetchAllScholarships();
    const channel = supabase.channel('scholarship_db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scholarship_db' }, payload => {
        fetchAllScholarships();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const toggleFavorite = (scholarshipId: number) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(scholarshipId)) {
        return prevFavorites.filter((id) => id !== scholarshipId);
      } else {
        return [...prevFavorites, scholarshipId];
      }
    });
  };

  // Helper function to match amount ranges
  const matchAmountRange = (amount: string, filterValue: string): boolean => {
    const numericAmount = parseInt(amount.replace(/[^0-9]/g, ""));

    switch (filterValue) {
      case "Under $1,000":
        return numericAmount < 1000;
      case "$1,000 - $5,000":
        return numericAmount >= 1000 && numericAmount <= 5000;
      case "$5,001 - $10,000":
        return numericAmount > 5000 && numericAmount <= 10000;
      case "Over $10,000":
        return numericAmount > 10000;
      default:
        return true;
    }
  };

  // Helper function to match deadline ranges
  const matchDeadlineRange = (
    deadline: string,
    filterValue: string
  ): boolean => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const oneMonth = new Date();
    oneMonth.setMonth(oneMonth.getMonth() + 1);
    const threeMonths = new Date();
    threeMonths.setMonth(threeMonths.getMonth() + 3);

    switch (filterValue) {
      case "Next Month":
        return deadlineDate <= oneMonth && deadlineDate >= today;
      case "Next 3 Months":
        return deadlineDate <= threeMonths && deadlineDate >= today;
      case "Future":
        return deadlineDate > threeMonths;
      default:
        return true;
    }
  };

  // Helper to reuse filtering logic for both default and curated
  const filteredScholarshipsFn = useCallback(
    (data: Scholarship[]) => {
      // Show all if all filters are default and search is empty
      const allFiltersDefault =
        filters.category === "All" &&
        filters.type === "All" &&
        filters.amount === "All" &&
        filters.educationLevel === "All" &&
        filters.fieldOfStudy === "All" &&
        filters.deadline === "All";
      if (allFiltersDefault && searchTerm.trim() === "") {
        let allData = data;
        if (showFavoritesOnly) {
          allData = allData.filter((scholarship) => favorites.includes(scholarship.id));
        }
        return allData;
      }
      let filteredData = data.filter((scholarship) => {
        const matchesSearch =
          scholarship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          scholarship.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          scholarship.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory =
          filters.category === "All" || scholarship.category === filters.category;
        const matchesType =
          filters.type === "All" || scholarship.type === filters.type;
        const matchesAmount =
          filters.amount === "All" || matchAmountRange(scholarship.amount, filters.amount);
        const matchesEducationLevel =
          filters.educationLevel === "All" || scholarship.educationLevel === filters.educationLevel;
        const matchesFieldOfStudy =
          filters.fieldOfStudy === "All" ||
          scholarship.fieldOfStudy === filters.fieldOfStudy ||
          scholarship.fieldOfStudy === "Any";
        const matchesDeadline =
          filters.deadline === "All" || matchDeadlineRange(scholarship.deadline, filters.deadline);

        return (
          matchesSearch &&
          matchesCategory &&
          matchesType &&
          matchesAmount &&
          matchesEducationLevel &&
          matchesFieldOfStudy &&
          matchesDeadline
        );
      });
      if (showFavoritesOnly) {
        filteredData = filteredData.filter((scholarship) => favorites.includes(scholarship.id));
      }
      return filteredData;
    },
    [searchTerm, filters, showFavoritesOnly, favorites]
  );

  // Use the helper for both lists
  const filteredScholarships = useMemo(() => filteredScholarshipsFn(scholarshipData), [filteredScholarshipsFn]);
  const filteredCuratedScholarships = useMemo(() => filteredScholarshipsFn(curatedScholarships), [filteredScholarshipsFn, curatedScholarships]);

  // Determine which scholarships to show
  let scholarshipsToShow: Scholarship[] = [];
  if (curatedScholarships.length > 0) {
    scholarshipsToShow = filteredCuratedScholarships;
  } else {
    scholarshipsToShow = filteredScholarshipsFn(allScholarships);
  }

  // Filter options
  const categories = [
    "All",
    "Academic",
    "Arts",
    "Athletics",
    "STEM",
    "Service",
    "Leadership",
    "Diversity",
    "First Generation",
  ];

  const types = ["All", "Merit-based", "Need-based", "Both"];

  const amountRanges = [
    "All",
    "Under $1,000",
    "$1,000 - $5,000",
    "$5,001 - $10,000",
    "Over $10,000",
  ];

  const educationLevels = [
    "All",
    "High School",
    "Undergraduate",
    "Graduate",
    "Doctorate",
  ];

  const fieldsOfStudy = [
    "All",
    "Any",
    "STEM",
    "Humanities",
    "Business",
    "Arts",
    "Education",
    "Health Sciences",
  ];

  const deadlineOptions = ["All", "Next Month", "Next 3 Months", "Future"];
  
  //find the token of the current session of the user
  const curateOpportunities = async () => {
    if (!user) {
      alert("Please log in to use this feature.");
      return;
    }
    setIsCurating(true);
    try {
      // Get the current session to retrieve the access token
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      if (!accessToken) {
        alert("Could not retrieve session token. Please log in again.");
        setIsCurating(false);
        return;
      }
      const response = await fetch("/api/curate-scholarships", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ userId: user.id }),
      });
      if (!response.ok) throw new Error("Failed to curate opportunities");
      const results = await response.json();
      // TODO: handle/display curated results
      console.log("Curated opportunities:", results);
      if (Array.isArray(results.result)) {
        setCuratedScholarships(results.result || []);
        alert("Personalization successful! Scholarships have been curated for you.");
      } else {
        console.error("Unexpected response format:", results);
        alert("Error curating opportunities. Please try again later.");
      }
    } catch {
      alert("Error curating opportunities.");
    } finally {
      setIsCurating(false);
    }
  };

  return (
    <div className="bg-white min-h-screen w-full">
      <div className="max-w-[1400px] w-full mx-auto px-4 py-6 flex flex-col space-y-6">
        <Header
          title="Scholarship Database"
          subtitle="Find scholarships to fund your education."
        />

        {/* Ask Slate to Find */}
        <div className="flex flex-col items-start mb-2">
          <button
            className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-full flex items-center justify-center w-auto transition-all duration-200 shadow-md hover:shadow-lg mb-1 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={curateOpportunities}
            disabled={isCurating}
          >
            {isCurating ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                <span className="font-medium">Curating...</span>
              </>
            ) : (
              <span className="font-medium">Ask Slate to Find</span>
            )}
          </button>
          <p className="text-gray-500 text-sm mt-1">
            Slate curates opportunity based on your profile.
          </p>
        </div>

        {/* Clear Curated Results Button */}
        {curatedScholarships.length > 0 && (
          <div className="mb-2">
            <Button
              variant="outline"
              onClick={() => setCuratedScholarships([])}
              className="text-sm px-4 py-2 border border-gray-300"
            >
              Clear Curated Results
            </Button>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-grow">
            <Input
              placeholder="Search scholarships..."
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              className="w-full pl-4 pr-4 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 text-gray-900 text-base font-medium shadow-sm bg-white"
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4"
            >
              <Filter size={18} />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>

            <Button
              variant="secondary"
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className="px-4"
            >
              <Heart
                size={18}
                className={`mr-2 ${
                  showFavoritesOnly ? "fill-red-500 text-red-500" : ""
                }`}
              />
              {showFavoritesOnly ? "Show All" : "Show Favorites"}
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <Select
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setFilters({ ...filters, category: e.target.value })
                  }
                  className="w-full bg-white text-gray-900 border-gray-300 h-10"
                >
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                      className="text-gray-900"
                    >
                      {category}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <Select
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setFilters({ ...filters, type: e.target.value })
                  }
                  className="w-full bg-white text-gray-900 border-gray-300 h-10"
                >
                  {types.map((type) => (
                    <option key={type} value={type} className="text-gray-900">
                      {type}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Award Amount
                </label>
                <Select
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setFilters({ ...filters, amount: e.target.value })
                  }
                  className="w-full bg-white text-gray-900 border-gray-300 h-10"
                >
                  {amountRanges.map((amount) => (
                    <option
                      key={amount}
                      value={amount}
                      className="text-gray-900"
                    >
                      {amount}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Education Level
                </label>
                <Select
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setFilters({ ...filters, educationLevel: e.target.value })
                  }
                  className="w-full bg-white text-gray-900 border-gray-300 h-10"
                >
                  {educationLevels.map((level) => (
                    <option key={level} value={level} className="text-gray-900">
                      {level}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field of Study
                </label>
                <Select
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setFilters({ ...filters, fieldOfStudy: e.target.value })
                  }
                  className="w-full bg-white text-gray-900 border-gray-300 h-10"
                >
                  {fieldsOfStudy.map((field) => (
                    <option key={field} value={field} className="text-gray-900">
                      {field}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline
                </label>
                <Select
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setFilters({ ...filters, deadline: e.target.value })
                  }
                  className="w-full bg-white text-gray-900 border-gray-300 h-10"
                >
                  {deadlineOptions.map((deadline) => (
                    <option
                      key={deadline}
                      value={deadline}
                      className="text-gray-900"
                    >
                      {deadline}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholarships.length === 0 && showFavoritesOnly ? (
            <p className="col-span-full text-center text-gray-500 my-8">
              No favorite scholarships match your search.
            </p>
          ) : filteredScholarships.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 my-8">
              No scholarships match your search.
            </p>
          ) : (
            scholarshipsToShow.map((scholarship) => (
              <Card
                key={scholarship.id}
                className="group hover:shadow-xl hover:scale-[1.03] transition-all duration-200 ease-in-out overflow-hidden border-2 border-gray-100 bg-white"
              >
                <div
                  className={`w-full h-24 flex items-center px-4 relative bg-gray-200 text-gray-900`}
                >
                  <div className="absolute top-2 right-3">
                    <Image
                      src="/Transparent_Logo_White.png"
                      alt="SlatePath Logo"
                      width={48}
                      height={48}
                      className="opacity-95"
                    />
                  </div>
                  <h3 className="text-xl font-bold pr-14">
                    {scholarship.name}
                  </h3>
                </div>
                <CardHeader className="flex flex-row justify-end items-start space-y-0 bg-white pt-2 pb-0 px-4">
                  <Button
                    variant="ghost"
                    onClick={() => toggleFavorite(scholarship.id)}
                    className="p-1 h-auto"
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        favorites.includes(scholarship.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </Button>
                </CardHeader>
                <CardContent className="pt-0 bg-white">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {scholarship.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 border-none"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {scholarship.description}
                  </p>
                  <div className="flex justify-between items-center text-sm border-t pt-3 mt-auto">
                    <span className="flex items-center gap-1 font-medium">
                      <span
                        className={`h-3 w-3 rounded-full ${
                          scholarship.type === "Merit-based"
                            ? "bg-blue-500"
                            : scholarship.type === "Need-based"
                            ? "bg-green-500"
                            : "bg-purple-500"
                        }`}
                      ></span>
                      {scholarship.type}
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded text-gray-700 font-medium">
                      {scholarship.amount}
                    </span>
                  </div>

                  {/* Hidden content that appears on hover */}
                  <div className="max-h-0 overflow-hidden transition-all duration-300 group-hover:max-h-72 group-hover:mt-4">
                    <div className="border-t pt-3 space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Provider:</span>
                          <span className="font-medium ml-1 text-black">
                            {scholarship.provider}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Education:</span>
                          <span className="font-medium ml-1 text-black">
                            {scholarship.educationLevel}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Deadline:</span>
                          <span className="font-medium ml-1 text-black">
                            {scholarship.deadline}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Renewable:</span>
                          <span className="font-medium ml-1 text-black">
                            {scholarship.renewableStatus}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500">Eligibility:</span>
                          <span className="font-medium ml-1 text-black">
                            {scholarship.eligibility.join(", ")}
                          </span>
                        </div>
                      </div>

                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2">
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
