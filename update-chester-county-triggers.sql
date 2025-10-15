-- Updated Smart Database Triggers with Corrected Chester County Bounds
-- Run this in your Supabase SQL Editor to update the trigger functions

-- Drop existing triggers first (if they exist)
DROP TRIGGER IF EXISTS trigger_activities_smart ON user_activities;
DROP TRIGGER IF EXISTS trigger_litter_report_smart ON litter_reports;
DROP TRIGGER IF EXISTS trigger_eco_events_smart ON eco_events;

-- Drop existing functions
DROP FUNCTION IF EXISTS handle_activities_smart();
DROP FUNCTION IF EXISTS handle_litter_report_smart();
DROP FUNCTION IF EXISTS process_eco_event_smart();

-- Updated function for handling activities with correct Chester County bounds
CREATE OR REPLACE FUNCTION handle_activities_smart()
RETURNS TRIGGER AS $$
DECLARE
    user_lat DOUBLE PRECISION;
    user_lng DOUBLE PRECISION;
    is_chester_county BOOLEAN := FALSE;
    nearest_cell_id UUID;
BEGIN
    -- Get user location from user_profiles
    SELECT latitude, longitude INTO user_lat, user_lng
    FROM user_profiles 
    WHERE user_id = NEW.user_id;
    
    -- Log debug info
    INSERT INTO debug_logs (message, context) 
    VALUES (
        format('Activity: user_id=%s, lat=%s, lng=%s, type=%s, magnitude=%s', 
               NEW.user_id, user_lat, user_lng, NEW.type, NEW.magnitude),
        'handle_activities_smart'
    );
    
    -- Check if user is in Chester County (updated bounds)
    IF user_lat IS NOT NULL AND user_lng IS NOT NULL THEN
        is_chester_county := (
            user_lat >= 39.7167 AND user_lat <= 40.1833 AND 
            user_lng >= -76.2417 AND user_lng <= -75.325
        );
    END IF;
    
    INSERT INTO debug_logs (message, context) 
    VALUES (format('Chester County check: %s', is_chester_county), 'handle_activities_smart');
    
    -- Find and update appropriate grid cell
    IF is_chester_county THEN
        -- Find nearest Chester County cell
        SELECT id INTO nearest_cell_id
        FROM chester_county_grid_cells
        WHERE user_lat >= lat_min AND user_lat <= lat_max
          AND user_lng >= lng_min AND user_lng <= lng_max
        LIMIT 1;
        
        IF nearest_cell_id IS NOT NULL THEN
            -- Update Chester County grid
            IF NEW.type = 'Tree Planting' THEN
                UPDATE chester_county_grid_cells 
                SET greenery_score = LEAST(greenery_score + (NEW.magnitude * 2), 100),
                    cleanliness_score = LEAST(cleanliness_score + NEW.magnitude, 100),
                    carbon_emissions = GREATEST((carbon_emissions - NEW.magnitude), 0),
                    last_updated = NOW()
                WHERE id = nearest_cell_id;
            ELSIF NEW.type = 'Recycling' THEN
                UPDATE chester_county_grid_cells 
                SET cleanliness_score = LEAST(cleanliness_score + (NEW.magnitude * 1.5), 100),
                    trash_density = GREATEST(trash_density - NEW.magnitude, 0),
                    carbon_emissions = GREATEST((carbon_emissions - NEW.magnitude * 0.5), 0),
                    last_updated = NOW()
                WHERE id = nearest_cell_id;
            ELSIF NEW.type = 'Cycling' THEN
                UPDATE chester_county_grid_cells 
                SET carbon_emissions = GREATEST((carbon_emissions - NEW.magnitude * 0.3), 0),
                    last_updated = NOW()
                WHERE id = nearest_cell_id;
            END IF;
            
            INSERT INTO debug_logs (message, context) 
            VALUES (format('Updated Chester County cell: %s', nearest_cell_id), 'handle_activities_smart');
        END IF;
    ELSE
        -- Find nearest global cell
        SELECT id INTO nearest_cell_id
        FROM grid_cells
        WHERE user_lat >= lat_min AND user_lat <= lat_max
          AND user_lng >= lng_min AND user_lng <= lng_max
        LIMIT 1;
        
        IF nearest_cell_id IS NOT NULL THEN
            -- Update global grid
            IF NEW.type = 'Tree Planting' THEN
                UPDATE grid_cells 
                SET greenery_score = LEAST(greenery_score + (NEW.magnitude * 2), 100),
                    cleanliness_score = LEAST(cleanliness_score + NEW.magnitude, 100),
                    carbon_emissions = GREATEST((carbon_emissions - NEW.magnitude), 0),
                    last_updated = NOW()
                WHERE id = nearest_cell_id;
            ELSIF NEW.type = 'Recycling' THEN
                UPDATE grid_cells 
                SET cleanliness_score = LEAST(cleanliness_score + (NEW.magnitude * 1.5), 100),
                    trash_density = GREATEST(trash_density - NEW.magnitude, 0),
                    carbon_emissions = GREATEST((carbon_emissions - NEW.magnitude * 0.5), 0),
                    last_updated = NOW()
                WHERE id = nearest_cell_id;
            ELSIF NEW.type = 'Cycling' THEN
                UPDATE grid_cells 
                SET carbon_emissions = GREATEST((carbon_emissions - NEW.magnitude * 0.3), 0),
                    last_updated = NOW()
                WHERE id = nearest_cell_id;
            END IF;
            
            INSERT INTO debug_logs (message, context) 
            VALUES (format('Updated global cell: %s', nearest_cell_id), 'handle_activities_smart');
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Updated function for handling litter reports with correct Chester County bounds
CREATE OR REPLACE FUNCTION handle_litter_report_smart()
RETURNS TRIGGER AS $$
DECLARE
    is_chester_county BOOLEAN := FALSE;
    nearest_cell_id UUID;
BEGIN
    -- Check if report is in Chester County (updated bounds)
    is_chester_county := (
        NEW.latitude >= 39.7167 AND NEW.latitude <= 40.1833 AND 
        NEW.longitude >= -76.2417 AND NEW.longitude <= -75.325
    );
    
    INSERT INTO debug_logs (message, context) 
    VALUES (
        format('Litter report: lat=%s, lng=%s, chester=%s', 
               NEW.latitude, NEW.longitude, is_chester_county),
        'handle_litter_report_smart'
    );
    
    -- Find and update appropriate grid cell
    IF is_chester_county THEN
        -- Find nearest Chester County cell
        SELECT id INTO nearest_cell_id
        FROM chester_county_grid_cells
        WHERE NEW.latitude >= lat_min AND NEW.latitude <= lat_max
          AND NEW.longitude >= lng_min AND NEW.longitude <= lng_max
        LIMIT 1;
        
        IF nearest_cell_id IS NOT NULL THEN
            UPDATE chester_county_grid_cells 
            SET trash_density = LEAST(trash_density + 5, 100),
                cleanliness_score = GREATEST(cleanliness_score - 3, 0),
                last_updated = NOW()
            WHERE id = nearest_cell_id;
            
            INSERT INTO debug_logs (message, context) 
            VALUES (format('Updated Chester County cell for litter: %s', nearest_cell_id), 'handle_litter_report_smart');
        END IF;
    ELSE
        -- Find nearest global cell
        SELECT id INTO nearest_cell_id
        FROM grid_cells
        WHERE NEW.latitude >= lat_min AND NEW.latitude <= lat_max
          AND NEW.longitude >= lng_min AND NEW.longitude <= lng_max
        LIMIT 1;
        
        IF nearest_cell_id IS NOT NULL THEN
            UPDATE grid_cells 
            SET trash_density = LEAST(trash_density + 5, 100),
                cleanliness_score = GREATEST(cleanliness_score - 3, 0),
                last_updated = NOW()
            WHERE id = nearest_cell_id;
            
            INSERT INTO debug_logs (message, context) 
            VALUES (format('Updated global cell for litter: %s', nearest_cell_id), 'handle_litter_report_smart');
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Updated function for processing eco events with correct Chester County bounds
CREATE OR REPLACE FUNCTION process_eco_event_smart()
RETURNS TRIGGER AS $$
DECLARE
    is_chester_county BOOLEAN := FALSE;
    nearest_cell_id UUID;
    improvement_factor DOUBLE PRECISION := 1.0;
BEGIN
    -- Check if event is in Chester County (updated bounds)
    is_chester_county := (
        NEW.latitude >= 39.7167 AND NEW.latitude <= 40.1833 AND 
        NEW.longitude >= -76.2417 AND NEW.longitude <= -75.325
    );
    
    -- Scale improvement based on participant count
    IF NEW.participant_count > 0 THEN
        improvement_factor := LEAST(NEW.participant_count * 0.5, 10.0);
    END IF;
    
    INSERT INTO debug_logs (message, context) 
    VALUES (
        format('Eco event: lat=%s, lng=%s, chester=%s, participants=%s', 
               NEW.latitude, NEW.longitude, is_chester_county, NEW.participant_count),
        'process_eco_event_smart'
    );
    
    -- Find and update appropriate grid cell
    IF is_chester_county THEN
        -- Find nearest Chester County cell
        SELECT id INTO nearest_cell_id
        FROM chester_county_grid_cells
        WHERE NEW.latitude >= lat_min AND NEW.latitude <= lat_max
          AND NEW.longitude >= lng_min AND NEW.longitude <= lng_max
        LIMIT 1;
        
        IF nearest_cell_id IS NOT NULL THEN
            UPDATE chester_county_grid_cells 
            SET trash_density = GREATEST(trash_density - (improvement_factor * 3), 0),
                cleanliness_score = LEAST(cleanliness_score + (improvement_factor * 2), 100),
                greenery_score = LEAST(greenery_score + improvement_factor, 100),
                last_updated = NOW()
            WHERE id = nearest_cell_id;
            
            INSERT INTO debug_logs (message, context) 
            VALUES (format('Updated Chester County cell for eco event: %s', nearest_cell_id), 'process_eco_event_smart');
        END IF;
    ELSE
        -- Find nearest global cell
        SELECT id INTO nearest_cell_id
        FROM grid_cells
        WHERE NEW.latitude >= lat_min AND NEW.latitude <= lat_max
          AND NEW.longitude >= lng_min AND NEW.longitude <= lng_max
        LIMIT 1;
        
        IF nearest_cell_id IS NOT NULL THEN
            UPDATE grid_cells 
            SET trash_density = GREATEST(trash_density - (improvement_factor * 3), 0),
                cleanliness_score = LEAST(cleanliness_score + (improvement_factor * 2), 100),
                greenery_score = LEAST(greenery_score + improvement_factor, 100),
                last_updated = NOW()
            WHERE id = nearest_cell_id;
            
            INSERT INTO debug_logs (message, context) 
            VALUES (format('Updated global cell for eco event: %s', nearest_cell_id), 'process_eco_event_smart');
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the triggers
CREATE TRIGGER trigger_activities_smart
    AFTER INSERT ON user_activities
    FOR EACH ROW
    EXECUTE FUNCTION handle_activities_smart();

CREATE TRIGGER trigger_litter_report_smart
    AFTER INSERT ON litter_reports
    FOR EACH ROW
    EXECUTE FUNCTION handle_litter_report_smart();

CREATE TRIGGER trigger_eco_events_smart
    AFTER INSERT ON eco_events
    FOR EACH ROW
    EXECUTE FUNCTION process_eco_event_smart();

-- Verify triggers are created
SELECT 
    schemaname, 
    tablename, 
    triggername, 
    tgtype,
    tgenabled
FROM pg_trigger 
JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid
JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid
WHERE triggername LIKE '%smart%'
ORDER BY tablename, triggername;

-- Create or ensure debug_logs table exists for trigger debugging
CREATE TABLE IF NOT EXISTS debug_logs (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    context TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comment for future reference
COMMENT ON FUNCTION handle_activities_smart() IS 'Smart trigger function for user activities with correct Chester County bounds: 39.7167-40.1833°N, -76.2417 to -75.325°W';
COMMENT ON FUNCTION handle_litter_report_smart() IS 'Smart trigger function for litter reports with correct Chester County bounds: 39.7167-40.1833°N, -76.2417 to -75.325°W';
COMMENT ON FUNCTION process_eco_event_smart() IS 'Smart trigger function for eco events with correct Chester County bounds: 39.7167-40.1833°N, -76.2417 to -75.325°W';