// Script to populate grid_cells table with sample data
// Run this in your Supabase SQL editor or use the Supabase client

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const sampleGridData = [
  // Center Philadelphia area
  { lat_min: 39.95, lat_max: 39.96, lng_min: -75.17, lng_max: -75.16, trash_density: 3.2, greenery_score: 6.5, cleanliness_score: 7.8, carbon_emissions: 4.1 },
  { lat_min: 39.96, lat_max: 39.97, lng_min: -75.17, lng_max: -75.16, trash_density: 2.8, greenery_score: 7.2, cleanliness_score: 8.1, carbon_emissions: 3.9 },
  { lat_min: 39.97, lat_max: 39.98, lng_min: -75.17, lng_max: -75.16, trash_density: 4.1, greenery_score: 5.8, cleanliness_score: 6.9, carbon_emissions: 4.5 },
  { lat_min: 39.98, lat_max: 39.99, lng_min: -75.17, lng_max: -75.16, trash_density: 3.5, greenery_score: 6.9, cleanliness_score: 7.5, carbon_emissions: 4.2 },

  // West Philadelphia
  { lat_min: 39.95, lat_max: 39.96, lng_min: -75.18, lng_max: -75.17, trash_density: 4.8, greenery_score: 5.2, cleanliness_score: 6.1, carbon_emissions: 5.2 },
  { lat_min: 39.96, lat_max: 39.97, lng_min: -75.18, lng_max: -75.17, trash_density: 3.9, greenery_score: 6.8, cleanliness_score: 7.3, carbon_emissions: 4.6 },
  { lat_min: 39.97, lat_max: 39.98, lng_min: -75.18, lng_max: -75.17, trash_density: 5.1, greenery_score: 4.9, cleanliness_score: 5.8, carbon_emissions: 5.8 },
  { lat_min: 39.98, lat_max: 39.99, lng_min: -75.18, lng_max: -75.17, trash_density: 4.2, greenery_score: 6.1, cleanliness_score: 6.7, carbon_emissions: 4.9 },

  // East Philadelphia  
  { lat_min: 39.95, lat_max: 39.96, lng_min: -75.16, lng_max: -75.15, trash_density: 2.9, greenery_score: 7.8, cleanliness_score: 8.5, carbon_emissions: 3.7 },
  { lat_min: 39.96, lat_max: 39.97, lng_min: -75.16, lng_max: -75.15, trash_density: 3.3, greenery_score: 7.1, cleanliness_score: 8.0, carbon_emissions: 4.0 },
  { lat_min: 39.97, lat_max: 39.98, lng_min: -75.16, lng_max: -75.15, trash_density: 2.5, greenery_score: 8.2, cleanliness_score: 8.7, carbon_emissions: 3.4 },
  { lat_min: 39.98, lat_max: 39.99, lng_min: -75.16, lng_max: -75.15, trash_density: 3.1, greenery_score: 7.5, cleanliness_score: 8.3, carbon_emissions: 3.8 },

  // University City area (better scores)
  { lat_min: 39.95, lat_max: 39.96, lng_min: -75.19, lng_max: -75.18, trash_density: 2.1, greenery_score: 8.5, cleanliness_score: 9.1, carbon_emissions: 2.8 },
  { lat_min: 39.96, lat_max: 39.97, lng_min: -75.19, lng_max: -75.18, trash_density: 2.4, greenery_score: 8.2, cleanliness_score: 8.9, carbon_emissions: 3.1 },
  
  // Suburban areas (excellent scores)
  { lat_min: 40.00, lat_max: 40.01, lng_min: -75.17, lng_max: -75.16, trash_density: 1.8, greenery_score: 8.9, cleanliness_score: 9.2, carbon_emissions: 2.3 },
  { lat_min: 40.00, lat_max: 40.01, lng_min: -75.18, lng_max: -75.17, trash_density: 1.5, greenery_score: 9.1, cleanliness_score: 9.4, carbon_emissions: 2.1 },
];

export async function populateGridData() {
  try {
    const { data, error } = await supabase
      .from('grid_cells')
      .insert(sampleGridData);
    
    if (error) {
      console.error('Error inserting sample data:', error);
      return false;
    }
    
    console.log('Successfully inserted sample grid data:', data);
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

// Run this function to populate data
// populateGridData();