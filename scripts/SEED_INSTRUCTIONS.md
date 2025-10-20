# 🌱 Chester County Grid Seeding

## What This Does
Seeds the entire Chester County area with simulated environmental data for realistic map visualization.

## Grid Specifications
- **Coverage Area**: All of Chester County, PA
  - Latitude: `39.7167` to `40.1833`
  - Longitude: `-76.2417` to `-75.325`
- **Grid Resolution**: `0.005°` (~500 meter cells)
- **Expected Cells**: ~17,000-19,000 cells

## Environmental Data Ranges
Each cell gets randomized but realistic values:

| Metric | Range | Notes |
|--------|-------|-------|
| **Trash Density** | 0.5 - 3.0 | Lower is better |
| **Cleanliness Score** | 70 - 95 | Higher is better |
| **Greenery Score** | 50 - 90 | Higher is better (rural areas score higher) |
| **Carbon Emissions** | 5 - 15 kg/day | Lower is better |

## 🚀 How to Run

1. **Open Supabase SQL Editor**
2. **Copy entire contents of `seed-chester-county-grid.sql`**
3. **Click "Run"** (or press `Ctrl+Enter`)
4. **Wait for completion** (~30-60 seconds)

## Expected Output

```
========================================
Seeding Chester County Grid Cells
========================================
Boundaries:
  Latitude:  39.7167 to 40.1833
  Longitude: -76.2417 to -75.325
  Grid Size: 0.005 degrees (~500m)

Progress: Inserted ~1000 cells (Lat: 39.7667)
Progress: Inserted ~2000 cells (Lat: 39.8167)
...
========================================
✓ SEEDING COMPLETE!
========================================
Total cells inserted: 17,568
```

Then you'll see verification tables showing:
- ✅ Total coverage stats
- ✅ Environmental metric averages
- ✅ Coverage in specific test areas

## ✅ Verify It Worked

After running, check your EcoSim page:
1. **Zoom to Eagleview/Chesterbrook area**
2. **You should see grid cells everywhere**
3. **Metrics should display in the UI**

Or run this quick check:
```sql
SELECT COUNT(*) FROM chester_county_grid_cells;
-- Should return ~17,000-19,000
```

## 🔄 Need to Re-seed?

If you want to start fresh:
```sql
-- Clear all existing cells first
DELETE FROM chester_county_grid_cells;

-- Then run the seed script again
```

## 🎯 What This Fixes
- ✅ Complete wall-to-wall coverage of Chester County
- ✅ No more "missing data" areas
- ✅ Eagleview, Chesterbrook, and all other areas covered
- ✅ Realistic environmental data for simulation
- ✅ Ready for comparison/tracking features

**Run it now and your entire map will have data!** 🗺️
