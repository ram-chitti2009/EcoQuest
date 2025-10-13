"use client"
import {useEffect, useRef, useState, useCallback} from "react";
import mapboxgl, {Map} from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { getGridCellsInBounds, gridCellsToGeoJSON, subscribeToGridCellUpdates } from "@/utils/supabase/functions";

// Set Mapbox access token
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
if (MAPBOX_TOKEN) {
    mapboxgl.accessToken = MAPBOX_TOKEN;
} else {
    console.warn("NEXT_PUBLIC_MAPBOX_TOKEN not found in environment variables");
}

interface EcoSimMapProps{
    center?:[number, number];
    zoom?:number;
    onBoundsChange?: (bounds: {latMin: number, latMax: number, lngMin: number, lngMax: number}) => void;
}

export default function EcoSimMap({
    center = [-75.514, 40.036],
    zoom=12,
    onBoundsChange,
} : EcoSimMapProps){
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<Map|null>(null);
    const [mapError, setMapError] = useState<string | null>(null);
    const [isMapLoading, setIsMapLoading] = useState(true);
    
    // Memoize the loadCells function to prevent recreation on every render
    const loadCells = useCallback(async (map: Map) => {
        if (!map || !map.isStyleLoaded()) return;
        
        const bounds = map.getBounds();
        if (!bounds) return;
        
        // Notify parent component of bounds change
        if (onBoundsChange) {
            onBoundsChange({
                latMin: bounds.getSouth(),
                latMax: bounds.getNorth(),
                lngMin: bounds.getWest(),
                lngMax: bounds.getEast(),
            });
        }
        
        try {
            const cells = await getGridCellsInBounds({
                latMin: bounds.getSouth(),
                latMax: bounds.getNorth(),
                lngMin: bounds.getWest(),
                lngMax: bounds.getEast(),
            })
            const geoJSON = gridCellsToGeoJSON(cells);
            
            if(map.getSource("grid-cells")){
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (map.getSource("grid-cells") as mapboxgl.GeoJSONSource).setData(geoJSON as any);
            }
            else{
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                map.addSource('grid-cells', {type: 'geojson', data: geoJSON as any});
                map.addLayer({
                    id: 'grid-cells-layer',
                    type: 'fill',
                    source: 'grid-cells',
                    paint: {"fill-color":["get","color"], "fill-opacity":0.6},
                })
                map.addLayer({
                    id: 'grid-cells-borders',
                    type: 'line',
                    source:"grid-cells",
                    paint:{"line-color":"#000", "line-width":1}
                })
            }
        } catch (error) {
            console.error("Error loading grid cells:", error);
        }
    }, [onBoundsChange]);
    
    useEffect(()=>{
        // Prevent multiple initializations
        if (!mapContainer.current || mapRef.current) return;

        console.log("Initializing map with token:", !!mapboxgl.accessToken);

        // Small delay to ensure DOM is ready
        const initializeMap = () => {
            // Check if Mapbox token is available
            if (!mapboxgl.accessToken) {
                const errorMsg = "Mapbox access token is missing. Please set NEXT_PUBLIC_MAPBOX_TOKEN in your environment variables.";
                console.error(errorMsg);
                setMapError(errorMsg);
                setIsMapLoading(false);
                return;
            }

        try {
            const map = new mapboxgl.Map({
                container: mapContainer.current!,
                style: "mapbox://styles/mapbox/streets-v12",
                center,
                zoom
            })
            mapRef.current=map;

            // Set loading state when map loads
            map.on('load', () => {
                setIsMapLoading(false);
                setMapError(null);
            });

            map.on('error', (e) => {
                console.error('Mapbox error:', e);
                setMapError('Failed to load map. Please check your internet connection.');
                setIsMapLoading(false);
            });

        // Wait for map to load before loading cells
        map.on('load', () => loadCells(map));
        map.on("moveend", () => loadCells(map));

        const unsubscribe = subscribeToGridCellUpdates(updatedCell=>{
            const source = map.getSource("grid-cells") as mapboxgl.GeoJSONSource;
            if(!source) return;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = source._data as any;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const feature = data.features.find((f: any) => f.properties.id === updatedCell.id);
            if (feature) {
                feature.properties.color = gridCellsToGeoJSON([updatedCell]).features[0].properties.color;
                source.setData(data);
            }
        });

        const marker = new mapboxgl.Marker({color:"red"})
            .setLngLat(center)
            .setPopup(
                new mapboxgl.Popup({offset:25}).setText("EcoSim Center")
            )
            .addTo(map);

        return()=>{
            if (unsubscribe) unsubscribe();
            if (marker) marker.remove();
            if (map) map.remove();
            mapRef.current = null;
        }

        } catch (error) {
            console.error("Error initializing map:", error);
            setMapError("Failed to initialize map. Please check your configuration.");
            setIsMapLoading(false);
        }
        };

        // Initialize map with a small delay
        setTimeout(initializeMap, 100);

    }, [center, zoom, loadCells]); // Include dependencies

    // Cleanup effect when component unmounts
    useEffect(() => {
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    return (
        <div 
            ref={mapContainer} 
            className="w-full h-full min-h-[600px] bg-gray-100 rounded-xl relative"
            style={{ width: '100%', height: '100%' }} 
        >
            {isMapLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading map...</p>
                    </div>
                </div>
            )}
            {mapError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
                    <div className="text-center p-6">
                        <div className="text-red-600 text-4xl mb-4">⚠️</div>
                        <p className="text-red-600 font-semibold mb-2">Map Error</p>
                        <p className="text-gray-600 text-sm">{mapError}</p>
                    </div>
                </div>
            )}
        </div>
    );
}