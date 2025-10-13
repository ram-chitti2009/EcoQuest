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