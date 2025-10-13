// EcoSim specific functions
import { createClient } from '@/utils/supabase/client';

export interface RegionMetrics {
  avgTrash: number;
  avgCleanliness: number;
  avgGreenery: number;
  avgCarbon: number;
  totalCells: number;
}

export interface RegionBounds {
  latMin: number;
  latMax: number;
  lngMin: number;
  lngMax: number;
}

interface GridCellData {
  trash_density: number;
  cleanliness_score: number;
  greenery_score: number;
  carbon_emissions: number;
}

export async function getRegionMetrics(bounds: RegionBounds): Promise<RegionMetrics | null> {
  try {
    const supabase = createClient();
    
    console.log('Fetching region metrics with bounds:', bounds);
    
    // First, let's check if there's any data in the table at all
    const { data: allData, error: countError } = await supabase
      .from('grid_cells')
      .select('id, lat_min, lat_max, lng_min, lng_max, trash_density, cleanliness_score, greenery_score, carbon_emissions')
      .limit(10);
    
    console.log('Sample data from grid_cells:', allData);
    console.log('Count query error:', countError);
    
    // Query for grid cells that overlap with the view bounds
    // A cell overlaps if: cell_max >= view_min AND cell_min <= view_max
    const { data, error } = await supabase
      .from('grid_cells')
      .select('trash_density, cleanliness_score, greenery_score, carbon_emissions')
      .gte('lat_max', bounds.latMin)  // Cell's max lat >= view's min lat
      .lte('lat_min', bounds.latMax)  // Cell's min lat <= view's max lat
      .gte('lng_max', bounds.lngMin)  // Cell's max lng >= view's min lng
      .lte('lng_min', bounds.lngMax); // Cell's min lng <= view's max lng

    console.log('Filtered data:', data);
    console.log('Query error:', error);

    if (error) {
      console.error('Error fetching region metrics:', error);
      return null;
    }

    if (!data || data.length === 0) {
      console.log('No data found for bounds:', bounds);
      return {
        avgTrash: 0,
        avgCleanliness: 0,
        avgGreenery: 0,
        avgCarbon: 0,
        totalCells: 0,
      };
    }

    const totalCells = data.length;
    const avgTrash = data.reduce((sum: number, cell: GridCellData) => sum + (cell.trash_density || 0), 0) / totalCells;
    const avgCleanliness = data.reduce((sum: number, cell: GridCellData) => sum + (cell.cleanliness_score || 0), 0) / totalCells;
    const avgGreenery = data.reduce((sum: number, cell: GridCellData) => sum + (cell.greenery_score || 0), 0) / totalCells;
    const avgCarbon = data.reduce((sum: number, cell: GridCellData) => sum + (cell.carbon_emissions || 0), 0) / totalCells;

    return {
      avgTrash,
      avgCleanliness,
      avgGreenery,
      avgCarbon,
      totalCells,
    };
  } catch (error) {
    console.error('Error in getRegionMetrics:', error);
    return null;
  }
}


//Chester County Grid CRUD functions

export async function getChesterCountryGridCells(){
  const supabase = createClient();
  const {data, error} = await supabase
  .from('chester_county_grid_cells')
  .select('*')
  .order('lat_min', {ascending: true});
  if (error) {
    console.error('Error fetching Chester County grid cells:', error);
    return null;
  }
  return data;
}


export async function getChesterCountryGridCellsInBounds(
  bounds:{
    north:number;
    south:number;
    east:number;
    west:number;
  }
){
  const supabase = createClient();
  const {data, error} = await supabase
  .from('chester_county_grid_cells')
  .select('*')
  .gte('lat_min', bounds.south)
  .lte('lat_max', bounds.north)
  .gte('lng_min', bounds.west)
  .lte('lng_max', bounds.east)

  if(error){
    console.error("Error fetching chester county grid cells in bounds")
    throw error;
  }

  return data; 
}

export async function getChesterCountyGridCell(id:string){
  const supabase = createClient();
  const {data, error} = await supabase
  .from('chester_county_grid_cells')
  .select('*')
  .eq('id', id)
  .single()

  if(error){
    console.error("Error fetching chester county cell ", error)
    throw error
  }
  return data
}


export async function updateChesterCountyGridCell(
  id:string,
  updates:{
    trash_density?:number;
    greenery_score?:number;
    cleanliness_score?:number;
    carbon_emissions?:number;
  }
){
  const supabase = createClient();
  const{data, error} = await supabase
  .from('chester_county_grid_cells')
  .update({
    ...updates,
    last_updated:new Date().toISOString()
  })
  .eq('id', id)
  .select()
  .single();

  if(error){
    console.error("Error updating chester county grid cell", error);
    throw error;
  }
  return data; 
}

export async function getChesterCountyEnvironmentalStats() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('chester_county_grid_cells')
    .select('trash_density, greenery_score, cleanliness_score, carbon_emissions');

  if (error) {
    console.error('Error fetching Chester County environmental stats:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    return {
      avgTrashDensity: 0,
      avgGreeneryScore: 0,
      avgCleanlinessScore: 0,
      avgCarbonEmissions: 0,
      totalCells: 0
    };
  }

  const totalCells = data.length;
  const avgTrashDensity = data.reduce((sum: number, cell: any) => sum + cell.trash_density, 0) / totalCells;
  const avgGreeneryScore = data.reduce((sum: number, cell: any) => sum + cell.greenery_score, 0) / totalCells;
  const avgCleanlinessScore = data.reduce((sum: number, cell: any) => sum + cell.cleanliness_score, 0) / totalCells;
  const avgCarbonEmissions = data.reduce((sum: number, cell: any) => sum + (cell.carbon_emissions || 0), 0) / totalCells;

  return {
    avgTrashDensity: Number(avgTrashDensity.toFixed(2)),
    avgGreeneryScore: Number(avgGreeneryScore.toFixed(1)),
    avgCleanlinessScore: Number(avgCleanlinessScore.toFixed(1)),
    avgCarbonEmissions: Number(avgCarbonEmissions.toFixed(2)),
    totalCells
  };
}

export async function findNearestChesterCountyGridCell(lat: number, lng: number) {
  const supabase = createClient();
  const {data, error} = await supabase.rpc('find_grid_cell_for_activity', { lat, lng });
  
  if (error) {
    console.error('Error finding nearest Chester County grid cell:', error);
    throw error;
  }
  
  return data;
}

export function isInChesterCounty(lat:number, lng:number):boolean{
  return (
    lat >= 39.72 && lat <= 40.23 &&
    lng >= -76.01 && lng <= -75.33
  );
}

// Unified grid cell fetcher (returns either Chester County or global)
export async function getGridCellForLocation(lat: number, lng: number) {
  const supabase = createClient();
  
  if (isInChesterCounty(lat, lng)) {
    // Find Chester County cell
    const { data, error } = await supabase
      .from('chester_county_grid_cells')
      .select('*')
      .gte('lat_min', lat)
      .lte('lat_max', lat)
      .gte('lng_min', lng)
      .lte('lng_max', lng)
      .limit(1)
      .single();

    return { data, error, gridType: 'chester' };
  } else {
    // Find global cell
    const { data, error } = await supabase
      .from('grid_cells')
      .select('*')
      .gte('lat_min', lat)
      .lte('lat_max', lat)
      .gte('lng_min', lng)
      .lte('lng_max', lng)
      .limit(1)
      .single();

    return { data, error, gridType: 'global' };
  }
}