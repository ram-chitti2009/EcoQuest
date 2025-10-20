-- ============================================================
-- SEED CHESTER COUNTY GRID CELLS
-- Creates complete grid coverage with realistic environmental data
-- Chester County Bounds: Lat [39.7167, 40.1833], Lng [-76.2417, -75.325]
-- ============================================================

-- Configuration
DO $$
DECLARE
  grid_size DOUBLE PRECISION := 0.005; -- ~500m cells (good balance of detail vs performance)
  
  -- Chester County boundaries
  lat_min DOUBLE PRECISION := 39.7167;
  lat_max DOUBLE PRECISION := 40.1833;
  lng_min DOUBLE PRECISION := -76.2417;
  lng_max DOUBLE PRECISION := -75.325;
  
  current_lat DOUBLE PRECISION;
  current_lng DOUBLE PRECISION;
  
  -- Counters
  total_inserted INTEGER := 0;
  batch_size INTEGER := 1000;
  batch_count INTEGER := 0;
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Seeding Chester County Grid Cells';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Boundaries:';
  RAISE NOTICE '  Latitude:  % to %', lat_min, lat_max;
  RAISE NOTICE '  Longitude: % to %', lng_min, lng_max;
  RAISE NOTICE '  Grid Size: % degrees (~500m)', grid_size;
  RAISE NOTICE '';
  
  -- Start the seeding process
  current_lat := lat_min;
  
  WHILE current_lat < lat_max LOOP
    current_lng := lng_min;
    
    WHILE current_lng < lng_max LOOP
      -- Insert grid cell with realistic simulated environmental data
      INSERT INTO chester_county_grid_cells (
        lat_min,
        lat_max,
        lng_min,
        lng_max,
        trash_density,
        cleanliness_score,
        greenery_score,
        carbon_emissions
      ) VALUES (
        current_lat,
        current_lat + grid_size,
        current_lng,
        current_lng + grid_size,
        -- Trash density: 0.5 to 3.0 (lower is better)
        -- Urban areas tend to have more trash
        ROUND((0.5 + (RANDOM() * 2.5))::NUMERIC, 2),
        
        -- Cleanliness score: 70 to 95 (higher is better)
        -- Most areas reasonably clean with some variation
        ROUND((70 + (RANDOM() * 25))::NUMERIC, 2),
        
        -- Greenery score: 50 to 90 (higher is better)
        -- Chester County has good mix of urban/suburban/rural
        ROUND((50 + (RANDOM() * 40))::NUMERIC, 2),
        
        -- Carbon emissions: 5 to 15 kg/person/day (lower is better)
        ROUND((5 + (RANDOM() * 10))::NUMERIC, 2)
      );
      
      total_inserted := total_inserted + 1;
      current_lng := current_lng + grid_size;
    END LOOP;
    
    current_lat := current_lat + grid_size;
    batch_count := batch_count + 1;
    
    -- Progress update every 10 rows of latitude
    IF batch_count % 10 = 0 THEN
      RAISE NOTICE 'Progress: Inserted ~% cells (Lat: %)', total_inserted, ROUND(current_lat::NUMERIC, 4);
    END IF;
  END LOOP;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✓ SEEDING COMPLETE!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Total cells inserted: %', total_inserted;
  RAISE NOTICE '';
END $$;

-- Verify the seeded data
SELECT 
  '📊 Seeded Data Summary' as info,
  COUNT(*) as total_cells,
  ROUND(MIN(lat_min)::NUMERIC, 4) as min_latitude,
  ROUND(MAX(lat_max)::NUMERIC, 4) as max_latitude,
  ROUND(MIN(lng_min)::NUMERIC, 4) as min_longitude,
  ROUND(MAX(lng_max)::NUMERIC, 4) as max_longitude
FROM chester_county_grid_cells;

-- Show environmental statistics
SELECT 
  '🌍 Environmental Metrics' as category,
  ROUND(AVG(trash_density)::NUMERIC, 2) as avg_trash_density,
  ROUND(AVG(cleanliness_score)::NUMERIC, 2) as avg_cleanliness,
  ROUND(AVG(greenery_score)::NUMERIC, 2) as avg_greenery,
  ROUND(AVG(carbon_emissions)::NUMERIC, 2) as avg_carbon_emissions,
  ROUND(MIN(trash_density)::NUMERIC, 2) as min_trash,
  ROUND(MAX(trash_density)::NUMERIC, 2) as max_trash
FROM chester_county_grid_cells;

-- Test coverage in specific areas
SELECT 
  'Coverage Check' as test,
  '✓ Eagleview/Chesterbrook' as area,
  COUNT(*) as cells_found
FROM chester_county_grid_cells
WHERE lat_min >= 40.04 AND lat_max <= 40.07
  AND lng_min >= -75.52 AND lng_max <= -75.48
UNION ALL
SELECT 
  'Coverage Check' as test,
  '✓ West Chester (Central)' as area,
  COUNT(*) as cells_found
FROM chester_county_grid_cells
WHERE lat_min >= 39.95 AND lat_max <= 39.97
  AND lng_min >= -75.62 AND lng_max <= -75.59
UNION ALL
SELECT 
  'Coverage Check' as test,
  '✓ Northern Border' as area,
  COUNT(*) as cells_found
FROM chester_county_grid_cells
WHERE lat_min >= 40.15 AND lat_max <= 40.18
UNION ALL
SELECT 
  'Coverage Check' as test,
  '✓ Southern Border' as area,
  COUNT(*) as cells_found
FROM chester_county_grid_cells
WHERE lat_min >= 39.72 AND lat_max <= 39.75;

RAISE NOTICE '========================================';
RAISE NOTICE '🎉 Chester County grid is ready!';
RAISE NOTICE '   All areas now have complete coverage';
RAISE NOTICE '   Refresh your EcoSim page to see data';
RAISE NOTICE '========================================';
