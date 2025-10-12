"use client";

import React from 'react';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import LoadingScreen from "@/components/LoadingScreen";
import SidebarWrapper from "../components/SidebarWrapper";
import { LocationPermission } from '@/components/LocationPermission';
import { createClient } from '@/utils/supabase/client';

export default function LocationSettingsPage() {
  const checking = useRequireAuth();
  const supabase = createClient();
  const [user, setUser] = React.useState<{ id: string } | null>(null);

  React.useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  if (checking) {
    return <LoadingScreen />;
  }

  const handleLocationSaved = (latitude: number, longitude: number) => {
    console.log('Location saved:', { latitude, longitude });
  };

  return (
    <div className="flex h-screen">
      <SidebarWrapper loading={false} />
      <main className="flex-1 overflow-hidden">
        <div className="h-full p-6">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                📍 Location Settings
              </h1>
              <p className="text-gray-600">
                Enable location access to get personalized environmental data for your area.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <LocationPermission
                userId={user?.id}
                onLocationSaved={handleLocationSaved}
                showButton={true}
              />
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">🌍 How we use your location:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Show environmental data for your area</li>
                
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}