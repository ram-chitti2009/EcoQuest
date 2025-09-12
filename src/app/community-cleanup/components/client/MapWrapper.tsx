"use client";

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Calendar, Clock, Users } from 'lucide-react';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Participant {
  id: string;
  name: string;
  role: 'organizer' | 'coordinator' | 'volunteer';
  joinedAt: string;
}

interface CleanupEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  location: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  };
  organizer: string;
  participants: Participant[];
  maxParticipants: number;
  category: 'beach' | 'park' | 'street' | 'forest' | 'river';
  status: 'upcoming' | 'ongoing' | 'completed';
  equipmentProvided: string[];
  requirements: string[];
  expectedTrashCollection: string;
  carbonOffset: string;
}

interface MapWrapperProps {
  events: CleanupEvent[];
  categoryColors: Record<string, string>;
  onEventSelect: (event: CleanupEvent) => void;
}

const MapWrapper: React.FC<MapWrapperProps> = ({ events, categoryColors, onEventSelect }) => {
  const createCustomIcon = (category: string) => {
    const color = categoryColors[category as keyof typeof categoryColors];
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  return (
    <MapContainer
      center={[40.7128, -74.0060]}
      zoom={11}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {events.map((event) => (
        <Marker
          key={event.id}
          position={[event.location.lat, event.location.lng]}
          icon={createCustomIcon(event.category)}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{event.location.name}</p>
              <p className="text-sm mb-3">{event.description.substring(0, 100)}...</p>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Calendar className="w-4 h-4" />
                <span>{event.date}</span>
                <Clock className="w-4 h-4 ml-2" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <Users className="w-4 h-4" />
                <span>{event.participants.length}/{event.maxParticipants} participants</span>
              </div>
              <button
                onClick={() => onEventSelect(event)}
                className="w-full bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
              >
                View Details
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapWrapper;
