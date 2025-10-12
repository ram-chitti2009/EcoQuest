import { useState, useEffect } from 'react';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface LocationError {
  code: number;
  message: string;
}

export interface UseLocationReturn {
  location: LocationData | null;
  error: LocationError | null;
  loading: boolean;
  requestLocation: () => Promise<void>;
  isSupported: boolean;
  permissionStatus: PermissionState | null;
}

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<LocationError | null>(null);
  const [loading, setLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<PermissionState | null>(null);

  const isSupported = 'geolocation' in navigator;

  // Check permission status on mount
  useEffect(() => {
    if (isSupported && 'permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setPermissionStatus(result.state);
        
        // Listen for permission changes
        result.addEventListener('change', () => {
          setPermissionStatus(result.state);
        });
      }).catch(() => {
        // Permissions API not fully supported, that's okay
      });
    }
  }, [isSupported]);

  const requestLocation = async (): Promise<void> => {
    if (!isSupported) {
      setError({
        code: 0,
        message: 'Geolocation is not supported by this browser.'
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 5 * 60 * 1000 // 5 minutes
          }
        );
      });

      const locationData: LocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      };

      setLocation(locationData);
    } catch (err) {
      const geolocationError = err as GeolocationPositionError;
      
      let errorMessage: string;
      switch (geolocationError.code) {
        case geolocationError.PERMISSION_DENIED:
          errorMessage = 'Location access denied by user.';
          break;
        case geolocationError.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable.';
          break;
        case geolocationError.TIMEOUT:
          errorMessage = 'Location request timed out.';
          break;
        default:
          errorMessage = 'An unknown error occurred while retrieving location.';
          break;
      }

      setError({
        code: geolocationError.code,
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    location,
    error,
    loading,
    requestLocation,
    isSupported,
    permissionStatus
  };
};