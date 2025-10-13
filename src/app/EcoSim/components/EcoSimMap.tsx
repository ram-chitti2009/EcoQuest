"use client"
import {useEffect, useRef, useState, useCallback} from "react";
import mapboxgl, {Map} from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { getGridCellsInBounds, gridCellsToGeoJSON, subscribeToGridCellUpdates } from "@/utils/supabase/functions";
import { getChesterCountryGridCellsInBounds, isInChesterCounty } from "../lib/functions";

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

interface ChesterGridCell {
    id: string;
    lat_min: number;
    lat_max: number;
    lng_min: number;
    lng_max: number;
    trash_density: number;
    greenery_score: number;
    cleanliness_score: number;
    carbon_emissions: number | null;
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
    
    // Helper function to convert Chester County cells to GeoJSON
    const chesterCellsToGeoJSON = (cells: ChesterGridCell[]) => {
        return {
            type: "FeatureCollection",
            features: cells.map(cell => {
                const score = (
                    (100 - Math.min(cell.trash_density * 10, 100)) * 0.3 + 
                    cell.greenery_score * 0.3 + 
                    cell.cleanliness_score * 0.3 - 
                    Math.min((cell.carbon_emissions || 0) * 2, 50) * 0.1
                );
                
                // Color based on environmental score
                const color = score > 70 ? '#22c55e' : 
                             score > 50 ? '#eab308' : 
                             score > 30 ? '#f97316' : '#ef4444';
                
                return {
                    type: 'Feature',
                    geometry: {
                        type: 'Polygon',
                        coordinates: [[
                            [cell.lng_min, cell.lat_min],
                            [cell.lng_max, cell.lat_min],
                            [cell.lng_max, cell.lat_max],
                            [cell.lng_min, cell.lat_max],
                            [cell.lng_min, cell.lat_min]
                        ]]
                    },
                    properties: {
                        id: cell.id,
                        trash_density: cell.trash_density,
                        greenery_score: cell.greenery_score,
                        cleanliness_score: cell.cleanliness_score,
                        carbon_emissions: cell.carbon_emissions || 0,
                        ecoScore: score,
                        color: color,
                        gridType: 'chester'
                    }
                };
            })
        };
    };

    // Memoize the loadCells function to prevent recreation on every render
    const loadCells = useCallback(async (map: Map) => {
        if (!map || !map.isStyleLoaded()) return;
        
        const bounds = map.getBounds();
        if (!bounds) return;
        
        const boundsObj = {
            latMin: bounds.getSouth(),
            latMax: bounds.getNorth(),
            lngMin: bounds.getWest(),
            lngMax: bounds.getEast(),
        };
        
        // Notify parent component of bounds change
        if (onBoundsChange) {
            onBoundsChange(boundsObj);
        }
        
        try {
            // Check if current view intersects with Chester County
            const chesterBounds = {
                latMin: 39.72,
                latMax: 40.23,
                lngMin: -76.01,
                lngMax: -75.33
            };
            
            const viewIntersectsChester = !(
                boundsObj.latMax < chesterBounds.latMin ||
                boundsObj.latMin > chesterBounds.latMax ||
                boundsObj.lngMax < chesterBounds.lngMin ||
                boundsObj.lngMin > chesterBounds.lngMax
            );
            
            // Load global grid cells (excluding Chester County area)
            const globalCells = await getGridCellsInBounds(boundsObj);
            
            // Filter out cells that are in Chester County area
            const filteredGlobalCells = globalCells.filter(cell => {
                const centerLat = (cell.lat_min + cell.lat_max) / 2;
                const centerLng = (cell.lng_min + cell.lng_max) / 2;
                return !isInChesterCounty(centerLat, centerLng);
            });
            
            const globalGeoJSON = gridCellsToGeoJSON(filteredGlobalCells);
            
            // Update or create global grid source
            if(map.getSource("grid-cells")){
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (map.getSource("grid-cells") as mapboxgl.GeoJSONSource).setData(globalGeoJSON as any);
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                map.addSource('grid-cells', {type: 'geojson', data: globalGeoJSON as any});
                map.addLayer({
                    id: 'grid-cells-layer',
                    type: 'fill',
                    source: 'grid-cells',
                    paint: {"fill-color":["get","color"], "fill-opacity":0.6},
                });
                map.addLayer({
                    id: 'grid-cells-borders',
                    type: 'line',
                    source:"grid-cells",
                    paint:{"line-color":"#000", "line-width":1}
                });
            }
            
            // Load Chester County high-resolution grid if view intersects
            if (viewIntersectsChester) {
                const chesterCells = await getChesterCountryGridCellsInBounds({
                    north: boundsObj.latMax,
                    south: boundsObj.latMin,
                    east: boundsObj.lngMax,
                    west: boundsObj.lngMin
                });
                
                if (chesterCells && chesterCells.length > 0) {
                    const chesterGeoJSON = chesterCellsToGeoJSON(chesterCells);
                    
                    // Update or create Chester County grid source
                    if(map.getSource("chester-grid-cells")){
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (map.getSource("chester-grid-cells") as mapboxgl.GeoJSONSource).setData(chesterGeoJSON as any);
                    } else {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        map.addSource('chester-grid-cells', {type: 'geojson', data: chesterGeoJSON as any});
                        map.addLayer({
                            id: 'chester-grid-cells-layer',
                            type: 'fill',
                            source: 'chester-grid-cells',
                            paint: {
                                "fill-color":["get","color"], 
                                "fill-opacity": 0.7
                            },
                        });
                        map.addLayer({
                            id: 'chester-grid-cells-borders',
                            type: 'line',
                            source:"chester-grid-cells",
                            paint:{
                                "line-color":"#ffffff", 
                                "line-width": 0.5,
                                "line-opacity": 0.8
                            }
                        });
                        
                        // Add popup on click for Chester County cells
                        map.on('click', 'chester-grid-cells-layer', (e) => {
                            if (e.features && e.features[0]) {
                                const props = e.features[0].properties;
                                new mapboxgl.Popup()
                                    .setLngLat(e.lngLat)
                                    .setHTML(`
                                        <div class="p-3 min-w-[200px]">
                                            <h3 class="font-bold text-green-600 mb-2">🏛️ Chester County, PA</h3>
                                            <div class="text-sm space-y-1">
                                                <div class="flex justify-between">
                                                    <span>🗑️ Trash:</span>
                                                    <span class="font-medium">${props?.trash_density?.toFixed(1)}</span>
                                                </div>
                                                <div class="flex justify-between">
                                                    <span>🌳 Greenery:</span>
                                                    <span class="font-medium">${props?.greenery_score?.toFixed(0)}%</span>
                                                </div>
                                                <div class="flex justify-between">
                                                    <span>✨ Cleanliness:</span>
                                                    <span class="font-medium">${props?.cleanliness_score?.toFixed(0)}%</span>
                                                </div>
                                                <div class="flex justify-between">
                                                    <span>🏭 Carbon:</span>
                                                    <span class="font-medium">${props?.carbon_emissions?.toFixed(1)}t</span>
                                                </div>
                                                <hr class="my-2">
                                                <div class="text-xs text-green-700 font-medium">
                                                    High-Resolution Data
                                                </div>
                                            </div>
                                        </div>
                                    `)
                                    .addTo(map);
                            }
                        });
                        
                        // Change cursor on hover
                        map.on('mouseenter', 'chester-grid-cells-layer', () => {
                            map.getCanvas().style.cursor = 'pointer';
                        });
                        
                        map.on('mouseleave', 'chester-grid-cells-layer', () => {
                            map.getCanvas().style.cursor = '';
                        });
                    }
                }
            } else {
                // Remove Chester County layer if view doesn't intersect
                if (map.getSource("chester-grid-cells")) {
                    if (map.getLayer('chester-grid-cells-layer')) map.removeLayer('chester-grid-cells-layer');
                    if (map.getLayer('chester-grid-cells-borders')) map.removeLayer('chester-grid-cells-borders');
                    map.removeSource('chester-grid-cells');
                }
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