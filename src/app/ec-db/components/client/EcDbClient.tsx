"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import LoadingScreen from "../../../components/loading";
import { Filter, Heart } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card, CardContent, CardHeader } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Select } from "../ui/Select";
import { Header } from "../layout/Header";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

export interface Activity {
    id: number;
    name: string;
    description: string;
    impact: string;
    hours: string;
    category: string[];
    skillsGained: string[];
    grades: string[];
}

export default function EcDbClient() {
    const [searchTerm, setSearchTerm] = useState("");
    const [favorites, setFavorites] = useState<number[]>([]);
    const [filters, setFilters] = useState({
        category: "All",
        impact: "All",
        hours: "All",
    });
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [allActivities, setAllActivities] = useState<Activity[]>([]);
    const [curatedActivities, setCuratedActivities] = useState<Activity[]>([]);
    const [isCurating, setIsCurating] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [showCurated, setShowCurated] = useState(false);
    const [loading, setLoading] = useState(true);

    const supabase = createClient();

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user);
        });
    }, [supabase.auth]);

    useEffect(() => {
        const fetchAllActivities = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase.from("extracurricular_db").select("*");
                console.log("Fetched ECs:", data, error);
                if (error) {
                    console.error("Failed to fetch activities:", error);
                } else if (Array.isArray(data)) {
                    setAllActivities(data);
                }
            } catch (err) {
                console.error("Error fetching activities:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllActivities();
        const channel = supabase.channel('extracurricular_db-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'extracurricular_db' }, () => {
                fetchAllActivities();
            })
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    const toggleFavorite = (activityId: number) => {
        setFavorites((prevFavorites) => {
            if (prevFavorites.includes(activityId)) {
                return prevFavorites.filter((id) => id !== activityId);
            } else {
                return [...prevFavorites, activityId];
            }
        });
    };

    const filteredActivitiesFn = useCallback(
        (data: Activity[]) => {
            // Show all if all filters are default and search is empty
            const allFiltersDefault =
                filters.category === "All" &&
                filters.impact === "All" &&
                filters.hours === "All";
            if (allFiltersDefault && searchTerm.trim() === "") {
                let allData = data;
                if (showFavoritesOnly) {
                    allData = allData.filter((activity) => favorites.includes(activity.id));
                }
                return allData;
            }
            let filterActivities = data.filter((activity) => {
                const matchesSearch =
                    activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (activity.skillsGained || []).some((skill) =>
                        skill.toLowerCase().includes(searchTerm.toLowerCase())
                    );

                // Category filter (now array)
                const matchesCategory =
                    filters.category === "All" || (activity.category || []).includes(filters.category);
                const matchesImpact =
                    filters.impact === "All" || activity.impact === filters.impact;
                const matchesHours =
                    filters.hours === "All" || activity.hours === filters.hours;

                return (
                    matchesSearch &&
                    matchesCategory &&
                    matchesImpact &&
                    matchesHours
                );
            });
            if (showFavoritesOnly) {
                filterActivities = filterActivities.filter((activity) =>
                    favorites.includes(activity.id)
                );
            }
            return filterActivities;
        },
        [searchTerm, filters, showFavoritesOnly, favorites]
    );

    const filteredActivities = useMemo(
        () => filteredActivitiesFn(allActivities),
        [filteredActivitiesFn, allActivities]
    );
    const filteredCuratedActivities = useMemo(
        () => filteredActivitiesFn(curatedActivities),
        [filteredActivitiesFn, curatedActivities]
    );

    let activitiesToShow: Activity[] = [];
    if (showCurated && curatedActivities.length > 0) {
        activitiesToShow = filteredCuratedActivities;
    } else {
        activitiesToShow = filteredActivities;
    }

    const categories = [
        "All",
        "Leadership",
        "Academic",
        "Community Service",
        "Arts",
        "Sports",
        "STEM",
        "Media",
    ];
    const impacts = ["All", "High", "Medium", "Low"];
    const hoursOptions = ["All", "1-3", "3-5", "5-10", "10+"];

    const curateActivities = async () => {
        if (!user) {
            alert("Please log in to use this feature.");
            return;
        }
        setIsCurating(true);
        try {
            const { data: sessionData } = await supabase.auth.getSession();
            const accessToken = sessionData?.session?.access_token;
            if (!accessToken) {
                alert("Could not retrieve session token. Please log in again.");
                setIsCurating(false);
                return;
            }
            const response = await fetch("/api/curate-ec", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ userId: user.id }),
            });
            if (!response.ok) throw new Error("Failed to curate activities");
            const results = await response.json();
            if (Array.isArray(results.result)) {
                setCuratedActivities(results.result || []);
                setShowCurated(true);
                alert("Personalization successful! Activities have been curated for you.");
            } else {
                console.error("Unexpected response format:", results);
                alert("Error curating activities. Please try again later.");
            }
        } catch {
            alert("Error curating activities.");
        } finally {
            setIsCurating(false);
        }
    };

    if (loading) return (
        <div className="bg-white min-h-screen w-full flex flex-col items-center justify-center">
            <div className="max-w-[600px] w-full mx-auto px-4 py-6 flex flex-col space-y-6">
                <Header
                    title="Extracurricular Database"
                    subtitle="Explore activities to enhance your skills and impact."
                />
                {/* Curate Button always visible while loading */}
                <div className="flex flex-col items-start mb-2">
                    <button
                        className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-full flex items-center justify-center w-auto transition-all duration-200 shadow-md hover:shadow-lg mb-1 disabled:opacity-60 disabled:cursor-not-allowed"
                        onClick={curateActivities}
                        disabled={isCurating}
                    >
                        {isCurating ? (
                            <>
                                <svg
                                    className="animate-spin h-5 w-5 mr-2 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    />
                                </svg>
                                <span className="font-medium">Curating...</span>
                            </>
                        ) : (
                            <span className="font-medium">Ask Slate to Find</span>
                        )}
                    </button>
                    <p className="text-gray-500 text-sm mt-1">
                        Slate curates activities based on your profile.
                    </p>
                </div>
                <LoadingScreen />
            </div>
        </div>
    );
    return (
        <div className="bg-white min-h-screen w-full">
            <div className="max-w-[1400px] w-full mx-auto px-4 py-6 flex flex-col space-y-6">
                <Header
                    title="Extracurricular Database"
                    subtitle="Explore activities to enhance your skills and impact."
                />
                {/* Curate Button always visible */}
                <div className="flex flex-col items-start mb-2">
                    <button
                        className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-full flex items-center justify-center w-auto transition-all duration-200 shadow-md hover:shadow-lg mb-1 disabled:opacity-60 disabled:cursor-not-allowed"
                        onClick={curateActivities}
                        disabled={isCurating}
                    >
                        {isCurating ? (
                            <>
                                <svg
                                    className="animate-spin h-5 w-5 mr-2 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    />
                                </svg>
                                <span className="font-medium">Curating...</span>
                            </>
                        ) : (
                            <span className="font-medium">Ask Slate to Find</span>
                        )}
                    </button>
                    <p className="text-gray-500 text-sm mt-1">
                        Slate curates activities based on your profile.
                    </p>
                </div>
                {/* Clear Curated Results Button */}
                {curatedActivities.length > 0 && (
                    <div className="mb-2">
                        <Button
                            variant="outline"
                            onClick={() => {setCuratedActivities([]); setShowCurated(false)}}
                            className="text-sm px-4 py-2 border border-gray-300"
                        >
                            Clear Curated Results
                        </Button>
                    </div>
                )}
                {/* ...existing code for search, filters, and activity cards... */}
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="relative flex-grow">
                        <Input
                            placeholder="Search activities..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: "Category", key: "category", options: categories },
                                { label: "Impact", key: "impact", options: impacts },
                                { label: "Hours", key: "hours", options: hoursOptions },
                            ].map(({ label, key, options }) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {label}
                                    </label>
                                    <Select
                                        value={filters[key]}
                                        onChange={(e) =>
                                            setFilters({ ...filters, [key]: e.target.value })
                                        }
                                        className="w-full bg-white text-gray-900 border-gray-300 h-10"
                                    >
                                        {options.map((opt) => (
                                            <option key={opt} value={opt} className="text-gray-900">
                                                {opt}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activitiesToShow.length === 0 ? (
                        <p className="col-span-full text-center text-gray-500 my-8">
                            {showFavoritesOnly
                                ? "No favorite activities match your search."
                                : "No activities match your search."}
                        </p>
                    ) : (
                        activitiesToShow.map((activity) => (
                            <Card
                                key={activity.id}
                                className="group hover:shadow-xl hover:scale-[1.03] transition-all duration-200 ease-in-out overflow-hidden border-2 border-gray-100 bg-white"
                            >
                                {/* ...existing card content... */}
                                <div className="w-full h-24 bg-white border-b border-gray-100 flex items-center px-4 relative">
                                    <div className="absolute top-2 right-3">
                                        <Image
                                            src="/Transparent_Logo_White.png"
                                            alt="SlatePath Logo"
                                            width={48}
                                            height={48}
                                            className="opacity-95"
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 pr-14">
                                        {activity.name}
                                    </h3>
                                </div>
                                <CardHeader className="flex flex-row justify-end items-start space-y-0 bg-white pt-2 pb-0 px-4">
                                    <Button
                                        variant="ghost"
                                        onClick={() => toggleFavorite(activity.id)}
                                        className="p-1 h-auto"
                                    >
                                        <Heart
                                            className={`h-5 w-5 ${
                                                favorites.includes(activity.id)
                                                    ? "fill-red-500 text-red-500"
                                                    : "text-gray-400"
                                            }`}
                                        />
                                    </Button>
                                </CardHeader>
                                <CardContent className="pt-0 bg-white">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {(activity.skillsGained || []).map((skill) => (
                                            <Badge
                                                key={skill}
                                                variant="secondary"
                                                className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 border-none"
                                            >
                                                {skill}
                                            </Badge>
                                        ))}
                                        {/* Show categories as badges */}
                                        {(activity.category || []).map((cat) => (
                                            <Badge
                                                key={cat}
                                                variant="secondary"
                                                className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 border-none"
                                            >
                                                {cat}
                                            </Badge>
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        {activity.description}
                                    </p>
                                    <div className="flex justify-between items-center text-sm border-t pt-3 mt-auto">
                                        <span className="flex items-center gap-1 font-medium">
                                            <span
                                                className={`h-3 w-3 rounded-full ${
                                                    activity.impact === "High"
                                                        ? "bg-green-500"
                                                        : activity.impact === "Medium"
                                                        ? "bg-yellow-500"
                                                        : activity.impact === "Low"
                                                        ? "bg-blue-400"
                                                        : "bg-gray-400"
                                                }`}
                                            ></span>
                                            Impact: {activity.impact}
                                        </span>
                                        <span className="bg-gray-100 px-2 py-1 rounded text-gray-700 font-medium">
                                            {activity.hours} hrs/week
                                        </span>
                                    </div>
                                    <div className="max-h-0 overflow-hidden transition-all duration-300 group-hover:max-h-72 group-hover:mt-4">
                                        <div className="border-t pt-3 space-y-2">
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <span className="text-gray-500">Grades:</span>
                                                    <span className="font-medium ml-1 text-black">
                                                        {(activity.grades || []).join(", ")}
                                                    </span>
                                                </div>
                                            </div>
                                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2">
                                                Apply on Website
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

