import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: join(__dirname, '..', '.env.local') });

// Debug: Check what environment variables are loaded
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Found' : 'Missing');
console.log('Service Role Key:', process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ? 'Found' : 'Missing');
console.log('Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Found' : 'Missing');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use the correct environment variable name
const serviceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || 
                      process.env.SUPABASE_SERVICE_ROLE_KEY ||
                      process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing required environment variables:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('- Service Role Key:', serviceRoleKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function generateGridCells() {
  // Test connection and check if grid_cells table exists
  console.log('Testing Supabase connection...');
  try {
    // Try to access the grid_cells table to test connection and table existence
    const { error: tableError } = await supabase
      .from('grid_cells')
      .select('*', { count: 'exact', head: true });
    
    if (tableError) {
      if (tableError.code === '42P01') {
        console.error('Table "grid_cells" does not exist!');
        console.log('Please create the table first using the create-grid-cells.sql script in the Supabase SQL Editor.');
        return;
      } else {
        console.error('Connection or authentication failed:', tableError);
        return;
      }
    }
    
    console.log('Connection successful! Table "grid_cells" exists.');
  } catch (err) {
    console.error('Connection error:', err.message);
    return;
  }

  const latStep = 1;
  const lngStep = 1;

  let cells = [];
  for (let lat = -90; lat < 90; lat += latStep) {
    for (let lng = -180; lng < 180; lng += lngStep) {
      const trash_density = Math.random() * 100;
      const greenery_score = Math.random() * 100;
      const cleanliness_score = 100 - trash_density + (greenery_score * 0.5);

      cells.push({
        lat_min: lat,
        lat_max: lat + latStep,
        lng_min: lng,
        lng_max: lng + lngStep,
        trash_density,
        greenery_score,
        cleanliness_score
      });
    }
  }

  console.log(`Generated ${cells.length} cells. Inserting into Supabase...`);
  
  // Insert in batches to avoid potential size limits
  const batchSize = 1000;
  for (let i = 0; i < cells.length; i += batchSize) {
    const batch = cells.slice(i, i + batchSize);
    console.log(`Inserting batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(cells.length/batchSize)}...`);
    
    try {
      const { error } = await supabase.from("grid_cells").insert(batch);
      
      if (error) {
        console.error("Insert error:", error);
        return;
      }
    } catch (err) {
      console.error("Insert exception:", err.message);
      return;
    }
  }

  console.log("Grid cells generated successfully!");
}

generateGridCells();
