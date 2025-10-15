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
    
    // Define Chester County bounds
    const chesterBounds = {
      latMin: 39.7167,
      latMax: 40.1833,
      lngMin: -76.2417,
      lngMax: -75.325,
    };

    // Check if viewport intersects with Chester County
    const viewIntersectsChester = !(
      bounds.latMax < chesterBounds.latMin ||
      bounds.latMin > chesterBounds.latMax ||
      bounds.lngMax < chesterBounds.lngMin ||
      bounds.lngMin > chesterBounds.lngMax
    );

    console.log('View intersects Chester County:', viewIntersectsChester);

    let allCellData: GridCellData[] = [];

    // If we intersect with Chester County, get Chester County cells
    if (viewIntersectsChester) {
      console.log('Fetching Chester County cells...');
      
      const { data: chesterData, error: chesterError } = await supabase
        .from('chester_county_grid_cells')
        .select('trash_density, cleanliness_score, greenery_score, carbon_emissions')
        .lte('lat_min', bounds.latMax)
        .gte('lat_max', bounds.latMin)
        .lte('lng_min', bounds.lngMax)
        .gte('lng_max', bounds.lngMin);

      if (chesterError) {
        console.error('Error fetching Chester County cells:', chesterError);
      } else if (chesterData) {
        console.log(`Found ${chesterData.length} Chester County cells`);
        allCellData.push(...chesterData);
      }
    }

    // Always try to get global cells (excluding Chester County area)
    console.log('Fetching global cells...');
    
    const { data: globalData, error: globalError } = await supabase
      .from('grid_cells')
      .select('trash_density, cleanliness_score, greenery_score, carbon_emissions, lat_min, lat_max, lng_min, lng_max')
      .lte('lat_min', bounds.latMax)
      .gte('lat_max', bounds.latMin)
      .lte('lng_min', bounds.lngMax)
      .gte('lng_max', bounds.lngMin);

    if (globalError) {
      console.error('Error fetching global cells:', globalError);
    } else if (globalData) {
      // Filter out cells that are in Chester County (to avoid double counting)
      const filteredGlobalData = globalData.filter((cell: any) => {
        const centerLat = (cell.lat_min + cell.lat_max) / 2;
        const centerLng = (cell.lng_min + cell.lng_max) / 2;
        return !isInChesterCounty(centerLat, centerLng);
      });
      
      console.log(`Found ${globalData.length} total global cells, ${filteredGlobalData.length} after Chester filtering`);
      
      // Add only the metric data (not the coordinate data) to avoid type issues
      const globalMetrics = filteredGlobalData.map(cell => ({
        trash_density: cell.trash_density,
        cleanliness_score: cell.cleanliness_score,
        greenery_score: cell.greenery_score,
        carbon_emissions: cell.carbon_emissions
      }));
      
      allCellData.push(...globalMetrics);
    }

    console.log(`Total cells for analysis: ${allCellData.length}`);

    if (allCellData.length === 0) {
      console.log('No data found for bounds:', bounds);
      return {
        avgTrash: 0,
        avgCleanliness: 0,
        avgGreenery: 0,
        avgCarbon: 0,
        totalCells: 0,
      };
    }

    const totalCells = allCellData.length;
    const avgTrash = allCellData.reduce((sum: number, cell: GridCellData) => sum + (cell.trash_density || 0), 0) / totalCells;
    const avgCleanliness = allCellData.reduce((sum: number, cell: GridCellData) => sum + (cell.cleanliness_score || 0), 0) / totalCells;
    const avgGreenery = allCellData.reduce((sum: number, cell: GridCellData) => sum + (cell.greenery_score || 0), 0) / totalCells;
    const avgCarbon = allCellData.reduce((sum: number, cell: GridCellData) => sum + (cell.carbon_emissions || 0), 0) / totalCells;

    const result = {
      avgTrash,
      avgCleanliness,
      avgGreenery,
      avgCarbon,
      totalCells,
    };

    console.log('Calculated metrics:', result);
    return result;
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
  .lte('lat_min', bounds.north)
  .gte('lat_max', bounds.south)
  .lte('lng_min', bounds.east)
  .gte('lng_max', bounds.west)

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
    lat >= 39.7167 && lat <= 40.1833 &&
    lng >= -76.2417 && lng <= -75.325
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