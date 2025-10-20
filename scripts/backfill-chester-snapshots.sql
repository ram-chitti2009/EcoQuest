-- ============================================================
-- BACKFILL HISTORICAL DATA FOR COMPARISON FEATURE
-- Creates snapshots for 7 and 30 days ago ONLY
-- 180 days and Year will show "Insufficient data" gracefully
-- ============================================================

DO $$
DECLARE
  target_date TIMESTAMP WITH TIME ZONE;
  days_ago INTEGER;
  inserted_count INTEGER;
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Backfilling Historical Snapshots';
  RAISE NOTICE '========================================';
  
  -- ONLY create snapshots for 7 and 30 days (realistic for demo)
  -- 180 days and year will show "Insufficient data" message
  FOREACH days_ago IN ARRAY ARRAY[7, 30] LOOP
    target_date := NOW() - (days_ago || ' days')::INTERVAL;
    
    RAISE NOTICE '';
    RAISE NOTICE 'Creating snapshot for % days ago...', days_ago;
    RAISE NOTICE '  Target date: %', target_date;
    
    -- Insert historical data showing WORSE environmental conditions in the past
    -- This creates a clear improvement story for your demo
    INSERT INTO chester_county_grid_cells_history (
      grid_cell_id,
      lat_min,
      lat_max,
      lng_min,
      lng_max,
      trash_density,
      cleanliness_score,
      greenery_score,
      carbon_emissions,
      recorded_at
    )
    SELECT 
      id,
      lat_min,
      lat_max,
      lng_min,
      lng_max,
      -- Historical values show WORSE conditions (improvement factor)
      -- Week: 7% worse, Month: 15% worse
      CASE 
        WHEN days_ago = 7 THEN 
          GREATEST(0.5, trash_density / 0.93)::DOUBLE PRECISION  -- More trash 7 days ago
        WHEN days_ago = 30 THEN 
          GREATEST(0.5, trash_density / 0.85)::DOUBLE PRECISION  -- Much more trash 30 days ago
      END,
      CASE 
        WHEN days_ago = 7 THEN 
          LEAST(100, GREATEST(0, cleanliness_score * 0.93))::DOUBLE PRECISION  -- Less clean
        WHEN days_ago = 30 THEN 
          LEAST(100, GREATEST(0, cleanliness_score * 0.85))::DOUBLE PRECISION
      END,
      CASE 
        WHEN days_ago = 7 THEN 
          LEAST(100, GREATEST(0, greenery_score * 0.93))::DOUBLE PRECISION  -- Less green
        WHEN days_ago = 30 THEN 
          LEAST(100, GREATEST(0, greenery_score * 0.85))::DOUBLE PRECISION
      END,
      CASE 
        WHEN days_ago = 7 THEN 
          GREATEST(0.5, carbon_emissions / 0.93)::DOUBLE PRECISION  -- More emissions
        WHEN days_ago = 30 THEN 
          GREATEST(0.5, carbon_emissions / 0.85)::DOUBLE PRECISION
      END,
      target_date
    FROM chester_county_grid_cells
    WHERE trash_density IS NOT NULL
      AND cleanliness_score IS NOT NULL
      AND greenery_score IS NOT NULL
      AND carbon_emissions IS NOT NULL;
    
    GET DIAGNOSTICS inserted_count = ROW_COUNT;
    RAISE NOTICE '  ✓ Inserted % snapshot records', inserted_count;
  END LOOP;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✓ BACKFILL COMPLETE!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Available comparisons:';
  RAISE NOTICE '  ✓ 1 Week  - Will show ~7-8%% improvements';
  RAISE NOTICE '  ✓ 1 Month - Will show ~15-18%% improvements';
  RAISE NOTICE '  ⚠ 180 Days - Will show "Insufficient data"';
  RAISE NOTICE '  ⚠ 1 Year   - Will show "Insufficient data"';
  RAISE NOTICE '';
END $$;

-- Verify the created snapshots
SELECT 
  '📅 Snapshot Dates' as info,
  DATE(recorded_at) as snapshot_date,
  COUNT(*) as cell_count,
  ROUND(AVG(trash_density)::NUMERIC, 2) as avg_trash,
  ROUND(AVG(cleanliness_score)::NUMERIC, 2) as avg_cleanliness,
  ROUND(AVG(greenery_score)::NUMERIC, 2) as avg_greenery,
  ROUND(AVG(carbon_emissions)::NUMERIC, 2) as avg_carbon
FROM chester_county_grid_cells_history
GROUP BY DATE(recorded_at)
ORDER BY DATE(recorded_at) DESC;

-- Calculate and show the expected percentage changes
WITH current_data AS (
  SELECT 
    AVG(trash_density) as current_trash,
    AVG(cleanliness_score) as current_clean,
    AVG(greenery_score) as current_green,
    AVG(carbon_emissions) as current_carbon
  FROM chester_county_grid_cells
),
historical_week AS (
  SELECT 
    AVG(trash_density) as week_trash,
    AVG(cleanliness_score) as week_clean,
    AVG(greenery_score) as week_green,
    AVG(carbon_emissions) as week_carbon
  FROM chester_county_grid_cells_history
  WHERE DATE(recorded_at) = CURRENT_DATE - 7
),
historical_month AS (
  SELECT 
    AVG(trash_density) as month_trash,
    AVG(cleanliness_score) as month_clean,
    AVG(greenery_score) as month_green,
    AVG(carbon_emissions) as month_carbon
  FROM chester_county_grid_cells_history
  WHERE DATE(recorded_at) = CURRENT_DATE - 30
)
SELECT 
  '📊 Expected Changes' as type,
  '1 Week' as timeframe,
  ROUND(((c.current_trash - h.week_trash) / h.week_trash * 100)::NUMERIC, 1) || '%' as trash_change,
  ROUND(((c.current_clean - h.week_clean) / h.week_clean * 100)::NUMERIC, 1) || '%' as cleanliness_change,
  ROUND(((c.current_green - h.week_green) / h.week_green * 100)::NUMERIC, 1) || '%' as greenery_change,
  ROUND(((c.current_carbon - h.week_carbon) / h.week_carbon * 100)::NUMERIC, 1) || '%' as carbon_change
FROM current_data c, historical_week h
UNION ALL
SELECT 
  '📊 Expected Changes' as type,
  '1 Month' as timeframe,
  ROUND(((c.current_trash - h.month_trash) / h.month_trash * 100)::NUMERIC, 1) || '%' as trash_change,
  ROUND(((c.current_clean - h.month_clean) / h.month_clean * 100)::NUMERIC, 1) || '%' as cleanliness_change,
  ROUND(((c.current_green - h.month_green) / h.month_green * 100)::NUMERIC, 1) || '%' as greenery_change,
  ROUND(((c.current_carbon - h.month_carbon) / h.month_carbon * 100)::NUMERIC, 1) || '%' as carbon_change
FROM current_data c, historical_month h;

-- Final confirmation
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '🎉 YOU''RE ALL SET!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Refresh your EcoSim page';
  RAISE NOTICE '  2. Click "Compare" button';
  RAISE NOTICE '  3. Select "Past Week" - see improvements!';
  RAISE NOTICE '  4. Select "Past Month" - see bigger improvements!';
  RAISE NOTICE '  5. Select "180 Days/Year" - gracefully shows no data';
  RAISE NOTICE '';
  RAISE NOTICE 'Perfect for demo! 🚀';
  RAISE NOTICE '========================================';
END $$;
