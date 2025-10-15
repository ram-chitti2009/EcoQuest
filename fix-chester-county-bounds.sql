-- Move out-of-bounds Chester County cells to global grid
-- Bounds: 39.7167-40.1833°N, -76.2417 to -75.325°W

-- Move cells to global grid
INSERT INTO grid_cells (lat_min, lat_max, lng_min, lng_max, trash_density, greenery_score, cleanliness_score, carbon_emissions, last_updated, created_at)
SELECT lat_min, lat_max, lng_min, lng_max, trash_density, greenery_score, cleanliness_score, carbon_emissions, last_updated, created_at
FROM chester_county_grid_cells
WHERE lat_min < 39.7167 OR lat_max > 40.1833 OR lng_min < -76.2417 OR lng_max > -75.325;

-- Remove out-of-bounds cells from Chester County table
DELETE FROM chester_county_grid_cells
WHERE lat_min < 39.7167 OR lat_max > 40.1833 OR lng_min < -76.2417 OR lng_max > -75.325;