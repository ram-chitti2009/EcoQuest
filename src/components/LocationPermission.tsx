'use client';

import React, { useState } from 'react';
import { useLocation } from '@/hooks/useLocation';
import { updateUserProfile } from '@/utils/supabase/functions';
import { createClient } from '@/utils/supabase/client';

interface LocationPermissionProps {
  userId?: string;
  onLocationSaved?: (latitude: number, longitude: number) => void;
  showButton?: boolean;
}

export const LocationPermission: React.FC<LocationPermissionProps> = ({
  userId,
  onLocationSaved,
  showButton = true
}) => {
  const { location, error, loading, requestLocation, isSupported, permissionStatus } = useLocation();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleRequestAndSaveLocation = async () => {
    try {
      await requestLocation();
      
      // If we got location and have a user ID, save it to the database
      if (location && userId) {
        setSaving(true);
        
        await updateUserProfile(userId, {
          latitude: location.latitude,
          longitude: location.longitude,
          location_permission_granted: true,
          location_updated_at: new Date().toISOString()
        });

        setSaved(true);
        onLocationSaved?.(location.latitude, location.longitude);
        
        // Reset saved status after 3 seconds
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error('Error saving location:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">
          🚫 Location services are not supported by your browser.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Permission Status */}
      {permissionStatus && (
        <div className={`p-3 rounded-lg text-sm ${
          permissionStatus === 'granted' 
            ? 'bg-green-50 text-green-700 border border-green-200'
            : permissionStatus === 'denied'
            ? 'bg-red-50 text-red-700 border border-red-200'
            : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
        }`}>
          <strong>Location Permission:</strong> {permissionStatus}
        </div>
      )}

      {/* Current Location Display */}
      {location && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">📍 Current Location</h3>
          <div className="text-sm text-green-700 space-y-1">
            <p><strong>Latitude:</strong> {location.latitude.toFixed(6)}</p>
            <p><strong>Longitude:</strong> {location.longitude.toFixed(6)}</p>
            <p><strong>Accuracy:</strong> ±{Math.round(location.accuracy)}m</p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-semibold text-red-800 mb-2">❌ Location Error</h3>
          <p className="text-sm text-red-700">{error.message}</p>
          {error.code === 1 && (
            <p className="text-xs text-red-600 mt-2">
              💡 You can enable location access in your browser settings.
            </p>
          )}
        </div>
      )}

      {/* Action Button */}
      {showButton && (
        <button
          onClick={handleRequestAndSaveLocation}
          disabled={loading || saving}
          className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
            saved
              ? 'bg-green-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400'
          }`}
        >
          {loading || saving ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {saving ? 'Saving Location...' : 'Getting Location...'}
            </span>
          ) : saved ? (
            '✓ Location Saved!'
          ) : location ? (
            '💾 Save Current Location'
          ) : (
            '📍 Get My Location'
          )}
        </button>
      )}

      {/* Info Text */}
      <div className="text-xs text-gray-600 space-y-1">
        <p>🛡️ Your location data is stored securely and only used to enhance your EcoQuest experience.</p>
        <p>🌍 This helps us show you local environmental data and nearby cleanup opportunities.</p>
      </div>
    </div>
  );
};