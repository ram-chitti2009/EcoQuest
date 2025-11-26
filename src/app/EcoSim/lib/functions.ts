// EcoSim specific functions
// Lazy import to avoid creating Supabase client during module initialization
async function getSupabaseClient() {
  const { createClient } = await import('@/utils/supabase/client');
  return createClient();
}

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
    const supabase = await getSupabaseClient();
    
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
        .gte('lat_min', bounds.latMin)
        .lte('lat_max', bounds.latMax)
        .gte('lng_min', bounds.lngMin)
        .lte('lng_max', bounds.lngMax);

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
      .gte('lat_min', bounds.latMin)
      .lte('lat_max', bounds.latMax)
      .gte('lng_min', bounds.lngMin)
      .lte('lng_max', bounds.lngMax);

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
  const supabase = await getSupabaseClient();
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
  const supabase = await getSupabaseClient();
  const {data, error} = await supabase
  .from('chester_county_grid_cells')
  .select('*')
  .gte('lat_min', bounds.south)  // Cell's south edge >= viewport's south edge
  .lte('lat_max', bounds.north)  // Cell's north edge <= viewport's north edge
  .gte('lng_min', bounds.west)   // Cell's west edge >= viewport's west edge
  .lte('lng_max', bounds.east)   // Cell's east edge <= viewport's east edge

  if(error){
    console.error("Error fetching chester county grid cells in bounds")
    throw error;
  }

  return data; 
}

export async function getChesterCountyGridCell(id:string){
  const supabase = await getSupabaseClient();
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
  const supabase = await getSupabaseClient();
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
  const supabase = await getSupabaseClient();
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
  const supabase = await getSupabaseClient();
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
  const supabase = await getSupabaseClient();
  
  if (isInChesterCounty(lat, lng)) {
    // Find Chester County cell
    const { data, error } = await supabase
      .from('chester_county_grid_cells')
      .select('*')
      .lte('lat_min', lat)
      .gte('lat_max', lat)
      .lte('lng_min', lng)
      .gte('lng_max', lng)
      .limit(1)
      .single();

    return { data, error, gridType: 'chester' };
  } else {
    // Find global cell
    const { data, error } = await supabase
      .from('grid_cells')
      .select('*')
      .lte('lat_min', lat)
      .gte('lat_max', lat)
      .lte('lng_min', lng)
      .gte('lng_max', lng)
      .limit(1)
      .single();

    return { data, error, gridType: 'global' };
  }
}

//Chester county historical snapshots crud

export async function createChesterCountySnapshot():Promise<{success:boolean,error:any}> {

  try{
    const supabase = await getSupabaseClient();
    const { error } = await supabase.rpc('snapshot_chester_county_grid_cells');
    return { success: !error, error };
  } catch (error) {
    console.error("Error creating Chester County snapshot:", error);
    return { success: false, error };
  }
}

/**
 * Get chester county grid ells from x days ago
 * used for histroical comparisons(30,60,90,180,365)
 */

export async function getChesterCountyHistoricalData(
  daysAgo: number,
  bounds?: { north: number; south: number; east: number; west: number }
): Promise<{ data: any[]; error: any }> {
  try {
    const supabase = await getSupabaseClient();
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - daysAgo);
    
    console.log('[getChesterCountyHistoricalData] Looking for snapshots around', targetDate.toISOString());
    
    // First, find the closest snapshot date
    const { data: closestSnapshot, error: snapshotError } = await supabase
      .from('chester_county_grid_cells_history')
      .select('recorded_at')
      .lte('recorded_at', targetDate.toISOString())
      .order('recorded_at', { ascending: false })
      .limit(1)
  .single();
    
    if (snapshotError || !closestSnapshot) {
      console.log('[getChesterCountyHistoricalData] No snapshots found before', targetDate.toISOString());
      return { data: [], error: 'No historical snapshots available' };
    }
    
    console.log('[getChesterCountyHistoricalData] Found closest snapshot at:', closestSnapshot.recorded_at);
    
    // Now get all cells from that exact snapshot date
    let query = supabase
      .from('chester_county_grid_cells_history')
      .select('*')
      .eq('recorded_at', closestSnapshot.recorded_at);
    
    if (bounds) {
      query = query
        .gte('lat_min', bounds.south)
        .lte('lat_max', bounds.north)
        .gte('lng_min', bounds.west)
        .lte('lng_max', bounds.east);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    console.log('[getChesterCountyHistoricalData] Retrieved', data?.length || 0, 'historical cells');
    return { data: data || [], error: null };
  } catch (error) {
    console.error('[getChesterCountyHistoricalData] Error:', error);
    return { data: [], error };
  }
}


/**
 * Compare current chester county metrics with historical data
 * returns current metrics historical metrics and percentage changes
 */

export async function compareChesterCountyMetrics(
  daysAgo: number,
  bounds?: { north: number; south: number; east: number; west: number }
): Promise<{
  data: {
    current: {
      avgTrash: number;
      avgCleanliness: number;
      avgGreenery: number;
      avgCarbon: number;
      totalCells: number;
    };
    historical: {
      avgTrash: number;
      avgCleanliness: number;
      avgGreenery: number;
      avgCarbon: number;
      totalCells: number;
    };
    change: {
      trash: number;
      cleanliness: number;
      greenery: number;
      carbon: number;
    };
  } | null;
  error: any;
}> {
  try {
    const supabase = await getSupabaseClient();
    
    console.log('[compareChesterCountyMetrics] Comparing data from', daysAgo, 'days ago');
    
    // Get current Chester County data
    let currentQuery = supabase
      .from('chester_county_grid_cells')
      .select('trash_density, cleanliness_score, greenery_score, carbon_emissions');
    
    if (bounds) {
      currentQuery = currentQuery
        .gte('lat_min', bounds.south)
        .lte('lat_max', bounds.north)
        .gte('lng_min', bounds.west)
        .lte('lng_max', bounds.east);
    }
    
    const { data: currentCells, error: currentError } = await currentQuery;
    
    if (currentError) throw currentError;
    
    console.log('[compareChesterCountyMetrics] Found', currentCells?.length || 0, 'current cells');
    
    // Get historical data
    const { data: historicalCells, error: historicalError } = await getChesterCountyHistoricalData(daysAgo, bounds);
    
    if (historicalError) throw historicalError;
    
    console.log('[compareChesterCountyMetrics] Found', historicalCells?.length || 0, 'historical cells');
    
    if (!currentCells || currentCells.length === 0 || !historicalCells || historicalCells.length === 0) {
      console.log('[compareChesterCountyMetrics] Insufficient data - current:', currentCells?.length, 'historical:', historicalCells?.length);
      return { data: null, error: 'Insufficient data for comparison' };
    }
    
    // Calculate averages for current data
    const calcAvg = (cells: any[], field: string) => 
      cells.reduce((sum, cell) => sum + (cell[field] || 0), 0) / cells.length;
    
    const current = {
      avgTrash: calcAvg(currentCells, 'trash_density'),
      avgCleanliness: calcAvg(currentCells, 'cleanliness_score'),
      avgGreenery: calcAvg(currentCells, 'greenery_score'),
      avgCarbon: calcAvg(currentCells, 'carbon_emissions'),
      totalCells: currentCells.length
    };
    
    const historical = {
      avgTrash: calcAvg(historicalCells, 'trash_density'),
      avgCleanliness: calcAvg(historicalCells, 'cleanliness_score'),
      avgGreenery: calcAvg(historicalCells, 'greenery_score'),
      avgCarbon: calcAvg(historicalCells, 'carbon_emissions'),
      totalCells: historicalCells.length
    };
    
    // Calculate percentage changes (avoid division by zero)
    const change = {
      trash: historical.avgTrash === 0 ? 0 : ((current.avgTrash - historical.avgTrash) / historical.avgTrash) * 100,
      cleanliness: historical.avgCleanliness === 0 ? 0 : ((current.avgCleanliness - historical.avgCleanliness) / historical.avgCleanliness) * 100,
      greenery: historical.avgGreenery === 0 ? 0 : ((current.avgGreenery - historical.avgGreenery) / historical.avgGreenery) * 100,
      carbon: historical.avgCarbon === 0 ? 0 : ((current.avgCarbon - historical.avgCarbon) / historical.avgCarbon) * 100
    };
    
    console.log('[compareChesterCountyMetrics] Comparison successful - Changes:', change);
    
    return { data: { current, historical, change }, error: null };
  } catch (error) {
    console.error('[compareChesterCountyMetrics] Error:', error);
    return { data: null, error };
  }
}


/**
 * Get all available historical snapshots for chester county
 * returns unique dates when snapshots were taken
 * useful for showing available comparison dates in UI
 */

/**
 * Debug function to check historical data availability
 */
export async function debugHistoricalData() {
  try {
    const supabase = await getSupabaseClient();
    
    // Count total snapshots
    const { count: totalCount } = await supabase
      .from('chester_county_grid_cells_history')
      .select('*', { count: 'exact', head: true });
    
    // Get unique snapshot dates
    const { data: snapshots } = await supabase
      .from('chester_county_grid_cells_history')
      .select('recorded_at')
      .order('recorded_at', { ascending: false });
    
    const uniqueDates = [...new Set(snapshots?.map(s => s.recorded_at) || [])];
    
    console.log('[debugHistoricalData] Total snapshots:', totalCount);
    console.log('[debugHistoricalData] Unique dates:', uniqueDates.length);
    console.log('[debugHistoricalData] Most recent snapshot:', uniqueDates[0]);
    console.log('[debugHistoricalData] All unique dates:', uniqueDates);
    
    return { totalCount, uniqueDates };
  } catch (error) {
    console.error('[debugHistoricalData] Error:', error);
    return null;
  }
}

export async function getAvailableChesterCountySnapshots():Promise<{ data: Date[]; error: any }> {
try{
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
  .from('chester_county_grid_cells_history')
  .select('recorded_at')
  .order('recorded_at', { ascending: false });

  if(error){
    console.error("Error fetching available chester county snapshots", error);
    throw error;
  }

  //Get Unique dates 
    const uniqueDates = [...new Set(data?.map(item => 
      new Date(item.recorded_at).toISOString().split('T')[0]
    ))].map(dateStr => new Date(dateStr));

    return{data:uniqueDates, error:null};
} catch (error) {
  console.error("Error in getAvailableChesterCountySnapshots", error);
  return { data: [], error };

  }
}

/**
 * Get Chester County historical data for a specific date range
 * Useful for custom date comparisons
 */
export async function getChesterCountyHistoricalDataByDateRange(
  startDate: string,
  endDate: string,
  bounds?: { north: number; south: number; east: number; west: number }
): Promise<{ data: any[]; error: any }> {
  try {
    const supabase = await getSupabaseClient();
    let query = supabase
      .from('chester_county_grid_cells_history')
      .select('*')
      .gte('recorded_at', startDate)
      .lte('recorded_at', endDate)
      .order('recorded_at', { ascending: false });
    
    if (bounds) {
      query = query
        .gte('lat_min', bounds.south)
        .lte('lat_max', bounds.north)
        .gte('lng_min', bounds.west)
        .lte('lng_max', bounds.east);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching Chester County historical data by date range:', error);
    return { data: [], error };
  }
}

/**
 * Get historical snapshot count for a specific grid cell
 * useful for tracking how many times a cell has been snapshotted
 */

export async function getChesterCountyCellSnapshotCount(
  gridCellId: string
): Promise<{ count: number; error: any }> {
  try {
    const supabase = await getSupabaseClient();
    const { count, error } = await supabase
      .from('chester_county_grid_cells_history')
      .select('*', { count: 'exact', head: true })
      .eq('grid_cell_id', gridCellId);
    
    if (error) throw error;
    return { count: count || 0, error: null };
  } catch (error) {
    console.error('Error fetching cell snapshot count:', error);
    return { count: 0, error };
  }
}


/**
 * Get trend data for a specific grid cell over time
 * returns all historical records for the cell ordered by date
 * useful for showing time series trends in UI
 */

export async function getChesterCountyCellTrend(
  gridCellId: string
): Promise<{ data: any[]; error: any }> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('chester_county_grid_cells_history')
      .select('*')
      .eq('grid_cell_id', gridCellId)
      .order('recorded_at', { ascending: true });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching cell trend data:', error);
    return { data: [], error };
  }
}

/**
 * Delete old chester county snapshots
 * keep only snapshots from the last X days
 */

export async function deleteOldChesterCountySnapshots(
  daysToKeep:number=365
):Promise<{success:boolean,error:any}> {

  try{
    const cutOffDate = new Date();
    cutOffDate.setDate(cutOffDate.getDate() - daysToKeep);
    const supabase = await getSupabaseClient();
    const { error } = await supabase
    .from('chester_county_grid_cells_history')
    .delete()
    .lt('recorded_at', cutOffDate.toISOString());

    if(error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting old Chester County snapshots:', error);
    return { success: false, error };
  }
}