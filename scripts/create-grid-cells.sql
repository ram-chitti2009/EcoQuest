-- Create grid_cells table if it doesn't exist
CREATE TABLE IF NOT EXISTS grid_cells (
    id SERIAL PRIMARY KEY,
    lat_min DECIMAL(10, 6) NOT NULL,
    lat_max DECIMAL(10, 6) NOT NULL,
    lng_min DECIMAL(10, 6) NOT NULL,
    lng_max DECIMAL(10, 6) NOT NULL,
    trash_density DECIMAL(5, 2) NOT NULL,
    greenery_score DECIMAL(5, 2) NOT NULL,
    cleanliness_score DECIMAL(5, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) if needed
ALTER TABLE grid_cells ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access (adjust as needed)
CREATE POLICY "Allow public read access" ON grid_cells
    FOR SELECT USING (true);

-- Create a policy to allow authenticated users to insert (adjust as needed)
CREATE POLICY "Allow authenticated insert" ON grid_cells
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Generate grid cells data
DO $$
DECLARE
    lat_val INTEGER;
    lng_val INTEGER;
    trash_density_val DECIMAL(5,2);
    greenery_score_val DECIMAL(5,2);
    cleanliness_score_val DECIMAL(5,2);
    batch_size INTEGER := 1000;
    batch_count INTEGER := 0;
    total_count INTEGER := 0;
BEGIN
    -- Clear existing data
    DELETE FROM grid_cells;
    
    -- Generate grid cells
    FOR lat_val IN -90..89 LOOP
        FOR lng_val IN -180..179 LOOP
            -- Generate random values
            trash_density_val := ROUND((RANDOM() * 100)::NUMERIC, 2);
            greenery_score_val := ROUND((RANDOM() * 100)::NUMERIC, 2);
            cleanliness_score_val := ROUND((100 - trash_density_val + (greenery_score_val * 0.5))::NUMERIC, 2);
            
            -- Insert the cell
            INSERT INTO grid_cells (lat_min, lat_max, lng_min, lng_max, trash_density, greenery_score, cleanliness_score)
            VALUES (lat_val, lat_val + 1, lng_val, lng_val + 1, trash_density_val, greenery_score_val, cleanliness_score_val);
            
            total_count := total_count + 1;
            
            -- Commit in batches to avoid memory issues
            IF total_count % batch_size = 0 THEN
                batch_count := batch_count + 1;
                RAISE NOTICE 'Inserted batch % (% rows total)', batch_count, total_count;
                COMMIT;
            END IF;
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Grid cells generation complete! Total rows: %', total_count;
END $$;

-- Verify the data
SELECT COUNT(*) as total_cells FROM grid_cells;
SELECT * FROM grid_cells LIMIT 5;