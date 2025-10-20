import React from "react";

interface MapPopupProps {
  properties: {
    [key: string]: any;
  };
  locationText: string;
  isHighRes: boolean;
}

const MapPopup: React.FC<MapPopupProps> = ({ properties, locationText, isHighRes }) => {
  const {
    ecoScore = 0,
    trash_density = 0,
    greenery_score = 0,
    cleanliness_score = 0,
    carbon_emissions = 0,
  } = properties;

  // Convert 0-1 scale to 0-100 percentage
  const healthScore = Math.round(ecoScore * 100);
  const theme = isHighRes
    ? {
        pulse: "bg-emerald-500",
        text: "text-emerald-700",
        gradient: "from-emerald-50 to-sky-50",
        score: "text-emerald-600",
        label: "High-Resolution Data",
      }
    : {
        pulse: "bg-blue-500",
        text: "text-blue-700",
        gradient: "from-blue-50 to-sky-50",
        score: "text-blue-600",
        label: "Global Grid Data",
      };

  return (
    <div className="p-4 min-w-[240px] bg-white/95 backdrop-blur-md rounded-xl">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 ${theme.pulse} rounded-full animate-pulse`}></div>
        <h3 className={`font-bold ${theme.text}`}>{locationText}</h3>
      </div>
      <div className={`mb-3 p-3 bg-gradient-to-br ${theme.gradient} rounded-lg`}>
        <p className="text-xs text-gray-600 mb-1">Environmental Health</p>
        <p className={`text-2xl font-bold ${theme.score}`}>{healthScore}%</p>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Trash:</span>
          <span className="font-semibold text-red-600">{trash_density.toFixed(1)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Greenery:</span>
          <span className="font-semibold text-emerald-600">{greenery_score.toFixed(0)}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Cleanliness:</span>
          <span className="font-semibold text-blue-600">{cleanliness_score.toFixed(0)}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Carbon:</span>
          <span className="font-semibold text-orange-600">{carbon_emissions.toFixed(1)}t</span>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className={`text-xs ${theme.text} font-medium`}>{theme.label}</p>
      </div>
    </div>
  );
};

export default MapPopup;
