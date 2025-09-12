"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, Trash2, Leaf, X, UserPlus } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const MapWrapper = dynamic(() => import('./MapWrapper'), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-green-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-green-600 font-medium">Loading map...</p>
      </div>
    </div>
  )
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

const sampleEvents: CleanupEvent[] = [
  {
    id: '1',
    title: 'Central Park Cleanup',
    description: 'Join us for a morning cleanup of Central Park. We\'ll focus on the areas around the lake and walking paths.',
    date: '2025-09-15',
    time: '09:00',
    duration: '3 hours',
    location: {
      name: 'Central Park',
      address: 'Central Park, New York, NY 10024',
      lat: 40.785091,
      lng: -73.968285
    },
    organizer: 'NYC Parks Department',
    participants: [
      { id: '1', name: 'Sarah Johnson', role: 'organizer', joinedAt: '2025-09-01' },
      { id: '2', name: 'Mike Chen', role: 'coordinator', joinedAt: '2025-09-03' },
      { id: '3', name: 'Emma Davis', role: 'volunteer', joinedAt: '2025-09-05' },
      { id: '4', name: 'John Smith', role: 'volunteer', joinedAt: '2025-09-07' }
    ],
    maxParticipants: 50,
    category: 'park',
    status: 'upcoming',
    equipmentProvided: ['Gloves', 'Trash bags', 'Grabbers', 'Safety vests'],
    requirements: ['Comfortable walking shoes', 'Water bottle', 'Sun protection'],
    expectedTrashCollection: '200 lbs',
    carbonOffset: '50 kg CO2'
  },
  {
    id: '2',
    title: 'Brooklyn Bridge Cleanup',
    description: 'Help keep the iconic Brooklyn Bridge and surrounding areas clean. Perfect for photography enthusiasts!',
    date: '2025-09-18',
    time: '14:00',
    duration: '2 hours',
    location: {
      name: 'Brooklyn Bridge',
      address: 'Brooklyn Bridge, New York, NY 10038',
      lat: 40.706086,
      lng: -73.996864
    },
    organizer: 'Brooklyn Community Group',
    participants: [
      { id: '5', name: 'Alex Rivera', role: 'organizer', joinedAt: '2025-08-28' },
      { id: '6', name: 'Lisa Wang', role: 'volunteer', joinedAt: '2025-09-02' }
    ],
    maxParticipants: 30,
    category: 'street',
    status: 'upcoming',
    equipmentProvided: ['Gloves', 'Trash bags', 'First aid kit'],
    requirements: ['Comfortable shoes', 'Photo ID for bridge access'],
    expectedTrashCollection: '100 lbs',
    carbonOffset: '25 kg CO2'
  },
  {
    id: '3',
    title: 'Hudson River Shore Cleanup',
    description: 'Coastal cleanup along the Hudson River. Help protect marine life and enjoy beautiful river views.',
    date: '2025-09-22',
    time: '10:00',
    duration: '4 hours',
    location: {
      name: 'Hudson River Park',
      address: 'Hudson River Park, New York, NY 10014',
      lat: 40.729030,
      lng: -74.009667
    },
    organizer: 'Hudson River Conservation',
    participants: [
      { id: '7', name: 'Maria Gonzalez', role: 'organizer', joinedAt: '2025-08-25' },
      { id: '8', name: 'David Kim', role: 'coordinator', joinedAt: '2025-08-30' },
      { id: '9', name: 'Anna Brown', role: 'volunteer', joinedAt: '2025-09-01' },
      { id: '10', name: 'Tom Wilson', role: 'volunteer', joinedAt: '2025-09-04' },
      { id: '11', name: 'Rachel Green', role: 'volunteer', joinedAt: '2025-09-06' }
    ],
    maxParticipants: 75,
    category: 'river',
    status: 'upcoming',
    equipmentProvided: ['Gloves', 'Trash bags', 'Recycling bags', 'Data collection sheets', 'Refreshments'],
    requirements: ['Closed-toe shoes', 'Sun protection', 'Water bottle', 'Weather-appropriate clothing'],
    expectedTrashCollection: '500 lbs',
    carbonOffset: '125 kg CO2'
  }
];

const categoryColors = {
  beach: '#3B82F6',
  park: '#10B981',
  street: '#F59E0B',
  forest: '#059669',
  river: '#06B6D4'
};

const statusColors = {
  upcoming: '#10B981',
  ongoing: '#F59E0B',
  completed: '#6B7280'
};

export default function CommunityCleanupMap() {
  const [selectedEvent, setSelectedEvent] = useState<CleanupEvent | null>(null);
  const [events, setEvents] = useState<CleanupEvent[]>(sampleEvents);

  const handleJoinEvent = (eventId: string) => {
    setEvents(prevEvents => 
      prevEvents.map(event => {
        if (event.id === eventId && event.participants.length < event.maxParticipants) {
          const newParticipant: Participant = {
            id: Date.now().toString(),
            name: 'You',
            role: 'volunteer',
            joinedAt: new Date().toISOString().split('T')[0]
          };
          return {
            ...event,
            participants: [...event.participants, newParticipant]
          };
        }
        return event;
      })
    );
    
    if (selectedEvent && selectedEvent.id === eventId) {
      const updatedEvent = events.find(e => e.id === eventId);
      if (updatedEvent) {
        setSelectedEvent({
          ...updatedEvent,
          participants: [...updatedEvent.participants, {
            id: Date.now().toString(),
            name: 'You',
            role: 'volunteer',
            joinedAt: new Date().toISOString().split('T')[0]
          }]
        });
      }
    }
  };

  return (
    <div className="h-screen w-full relative">
      <div className="h-full">
        <MapWrapper 
          events={events}
          categoryColors={categoryColors}
          onEventSelect={setSelectedEvent}
        />
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000]">
        <h3 className="font-semibold mb-2">Event Categories</h3>
        {Object.entries(categoryColors).map(([category, color]) => (
          <div key={category} className="flex items-center gap-2 mb-1">
            <div 
              className="w-4 h-4 rounded-full border-2 border-white shadow"
              style={{ backgroundColor: color }}
            ></div>
            <span className="text-sm capitalize">{category}</span>
          </div>
        ))}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000] p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedEvent.title}</h2>
                  <div className="flex items-center gap-2">
                    <span 
                      className="px-2 py-1 rounded text-xs font-medium text-white"
                      style={{ backgroundColor: categoryColors[selectedEvent.category] }}
                    >
                      {selectedEvent.category}
                    </span>
                    <span 
                      className="px-2 py-1 rounded text-xs font-medium text-white"
                      style={{ backgroundColor: statusColors[selectedEvent.status] }}
                    >
                      {selectedEvent.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-6">{selectedEvent.description}</p>

              {/* Event Details Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Date & Time */}
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Date & Time
                  </h3>
                  <p className="text-gray-600">Date: {selectedEvent.date}</p>
                  <p className="text-gray-600">Time: {selectedEvent.time}</p>
                  <p className="text-gray-600">Duration: {selectedEvent.duration}</p>
                </div>

                {/* Location */}
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location
                  </h3>
                  <p className="text-gray-600">{selectedEvent.location.name}</p>
                  <p className="text-gray-600 text-sm">{selectedEvent.location.address}</p>
                </div>

                {/* Organizer */}
                <div>
                  <h3 className="font-semibold mb-2">Organizer</h3>
                  <p className="text-gray-600">{selectedEvent.organizer}</p>
                </div>

                {/* Participants */}
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Participants ({selectedEvent.participants.length}/{selectedEvent.maxParticipants})
                  </h3>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(selectedEvent.participants.length / selectedEvent.maxParticipants) * 100}%` }}
                    ></div>
                  </div>
                  {selectedEvent.participants.length < selectedEvent.maxParticipants && (
                    <button
                      onClick={() => handleJoinEvent(selectedEvent.id)}
                      className="flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                      Join Event
                    </button>
                  )}
                </div>

                {/* Impact */}
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Trash2 className="w-5 h-5" />
                    Expected Impact
                  </h3>
                  <p className="text-gray-600">Trash Collection: {selectedEvent.expectedTrashCollection}</p>
                  <p className="text-gray-600 flex items-center gap-1">
                    <Leaf className="w-4 h-4 text-green-500" />
                    Carbon Offset: {selectedEvent.carbonOffset}
                  </p>
                </div>
              </div>

              {/* Equipment & Requirements */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-2">Equipment Provided</h3>
                  <ul className="text-gray-600 text-sm">
                    {selectedEvent.equipmentProvided.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">What to Bring</h3>
                  <ul className="text-gray-600 text-sm">
                    {selectedEvent.requirements.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Participants List */}
              <div>
                <h3 className="font-semibold mb-3">Registered Participants</h3>
                <div className="bg-gray-50 rounded-lg p-4 max-h-32 overflow-y-auto">
                  {selectedEvent.participants.map((participant) => (
                    <div key={participant.id} className="flex justify-between items-center py-1">
                      <span className="text-sm">{participant.name}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        participant.role === 'organizer' ? 'bg-purple-100 text-purple-800' :
                        participant.role === 'coordinator' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {participant.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
