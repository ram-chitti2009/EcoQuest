"use client";

import { useState, useEffect, useCallback } from "react";
import EcoSimMap from "./components/EcoSimMap";
import { getRegionMetrics } from "./lib/functions";

export default function EcoSimPage() {
  const [regionMetrics, setRegionMetrics] = useState({
    avgTrash: 0,
    avgCleanliness: 0,
    avgGreenery: 0,
    avgCarbon: 0,
    totalCells: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [currentBounds, setCurrentBounds] = useState({
    latMin: -90,
    latMax: 90,
    lngMin: -180,
    lngMax: 180,
  });

  // Function to handle bounds changes from the map
  const handleBoundsChange = useCallback(async (bounds: {latMin: number, latMax: number, lngMin: number, lngMax: number}) => {
    setCurrentBounds(bounds);
    
    try {
      setIsLoading(true);
      const metrics = await getRegionMetrics(bounds);
      if (metrics) setRegionMetrics(metrics);
    } catch (error) {
      console.error("Failed to load region metrics:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    async function loadInitialMetrics() {
      try {
        setIsLoading(true);
        const metrics = await getRegionMetrics(currentBounds);
        if (metrics) setRegionMetrics(metrics);
      } catch (error) {
        console.error("Failed to load region metrics:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialMetrics();
  }, [currentBounds]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-green-50 to-blue-50">
      <h1 className="text-4xl font-bold text-green-700 mb-6 text-center">
        EcoSim — Your Community Impact
      </h1>
      
      <p className="text-gray-600 mb-8 text-center max-w-2xl">
        Explore real-time environmental data and see how your community is making a difference
      </p>

      <section className="relative w-full max-w-7xl flex flex-col items-center h-[700px] rounded-2xl overflow-hidden shadow-2xl">
        <EcoSimMap onBoundsChange={handleBoundsChange} />
        
        {/* Enhanced Stats Panel */}
        <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 min-w-[280px]">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <div>
              <p className="font-bold text-gray-900 text-lg">EcoSim Analytics</p>
              <p className="text-xs text-gray-500">
                {/* Show Chester if we're in Chester area, otherwise show Current View */}
                {(currentBounds.latMin >= 39.8 && currentBounds.latMax <= 40.2 && 
                  currentBounds.lngMin >= -75.6 && currentBounds.lngMax <= -75.0) 
                  ? "Chester Area" : "Current View"}
              </p>
            </div>
          </div>
          
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">🗑️ Trash Density:</span>
                <span className="font-semibold text-red-600">
                  {regionMetrics.avgTrash.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">✨ Cleanliness:</span>
                <span className="font-semibold text-blue-600">
                  {regionMetrics.avgCleanliness.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">🌿 Greenery:</span>
                <span className="font-semibold text-green-600">
                  {regionMetrics.avgGreenery.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">💨 Carbon:</span>
                <span className="font-semibold text-orange-600">
                  {regionMetrics.avgCarbon.toFixed(1)}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 text-sm font-medium">Total Cells:</span>
                  <span className="font-semibold text-gray-900">
                    {regionMetrics.totalCells}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Legend Panel */}
        <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">Map Legend</p>
          <div className="space-y-1 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span className="text-gray-700 font-medium">Eco-Friendly</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
              <span className="text-gray-700 font-medium">Moderate</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
              <span className="text-gray-700 font-medium">Needs Attention</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
