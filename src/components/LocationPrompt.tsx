'use client';

import React, { useState, useEffect } from 'react';
import { X, MapPin, Shield } from 'lucide-react';
import { useLocation } from '@/hooks/useLocation';
import { createClient } from '@/utils/supabase/client';
import { updateUserProfile } from '@/utils/supabase/functions';

interface LocationPromptProps {
  onDismiss?: () => void;
  onLocationGranted?: (lat: number, lng: number) => void;
}

export const LocationPrompt: React.FC<LocationPromptProps> = ({
  onDismiss,
  onLocationGranted
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const { location, error, loading, requestLocation, permissionStatus } = useLocation();
  const supabase = createClient();

  // Check if user is logged in and if we should show the prompt
  useEffect(() => {
    const checkUserAndPermission = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      // Show if user exists (logged in) and permission isn't already granted
      if (user) {
        // Check if user already has location in their profile
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('latitude, longitude, location_permission_granted')
          .eq('id', user.id)
          .single();

        // Show prompt if no location is saved or permission not granted
        if (!profile?.latitude || !profile?.longitude || !profile?.location_permission_granted) {
          setIsVisible(true);
        }
      }
    };

    checkUserAndPermission();
  }, [supabase, permissionStatus]);

  // Handle location save
  useEffect(() => {
    const saveLocation = async () => {
      if (location && user && !saving) {
        setSaving(true);
        try {
          await updateUserProfile(user.id, {
            latitude: location.latitude,
            longitude: location.longitude,
            location_permission_granted: true,
            location_updated_at: new Date().toISOString()
          });
          
          onLocationGranted?.(location.latitude, location.longitude);
          setIsVisible(false);
        } catch (err) {
          console.error('Error saving location:', err);
        } finally {
          setSaving(false);
        }
      }
    };

    saveLocation();
  }, [location, user, saving, onLocationGranted]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const handleAllowLocation = async () => {
    await requestLocation();
  };

  if (!isVisible || !user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">Enable Location</h3>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Get personalized environmental data and find eco-activities near you!
          </p>

          {/* Error Display */}
          {error && (
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
              {error.message}
            </div>
          )}

          {/* Privacy Note */}
          <div className="flex items-start gap-2 text-xs text-gray-500">
            <Shield className="w-3 h-3 mt-0.5 text-green-500" />
            <span>Your location is stored securely and never shared without permission.</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleAllowLocation}
              disabled={loading || saving}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-2 rounded font-medium transition-colors disabled:bg-gray-400"
            >
              {loading || saving ? (
                <span className="flex items-center justify-center gap-1">
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                  {saving ? 'Saving...' : 'Getting...'}
                </span>
              ) : (
                'Allow Location'
              )}
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};