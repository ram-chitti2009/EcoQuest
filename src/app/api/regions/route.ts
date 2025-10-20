import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Revalidate the data every 5 minutes
export const revalidate = 300;

interface GridCell {
  id: string;
  lat_min: number;
  lat_max: number;
  lng_min: number;
  lng_max: number;
  trash_density: number;
  greenery_score: number;
  cleanliness_score: number;
  carbon_emissions: number | null;
  updated_at: string;
}

interface GeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  properties: Omit<GridCell, 'updated_at'> & {
    ecoScore: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing required environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Get cookies asynchronously - this fixes the Next.js 13+ warning
    const cookieStore = await cookies();

    // Create Supabase client with proper async cookie handling
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          getSession: async () => {
            // Get the session token from cookies
            const token = cookieStore.get('sb-ovmeiqclpdchakrqrjle-auth-token')?.value;
            return token ? { data: { session: { access_token: token } }, error: null } : { data: { session: null }, error: null };
          }
        }
      }
    );

    const { searchParams } = new URL(request.url);

    // Optional: Add pagination if needed
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '1000', 10);

    // Calculate offset for pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Fetch grid cells with pagination
    const { data: gridCells, error, count } = await supabase
      .from('chester_county_grid_cells')
      .select('*', { count: 'exact' })
      .order('last_updated', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch grid cells' },
        { status: 500 }
      );
    }

    if (!gridCells || gridCells.length === 0) {
      return NextResponse.json(
        { features: [], type: 'FeatureCollection' },
        { status: 200 }
      );
    }

    // Convert grid cells to GeoJSON features
    const features: GeoJSONFeature[] = gridCells.map((cell: any) => {
      // Calculate ecoScore (example: average of normalized metrics)
      const ecoScore = Math.round((
        (1 - cell.trash_density / 100) * 40 +
        (cell.greenery_score / 100) * 40 +
        (cell.cleanliness_score / 100) * 20
      ) * 100) / 100;

      return {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [cell.lng_min, cell.lat_min],
            [cell.lng_max, cell.lat_min],
            [cell.lng_max, cell.lat_max],
            [cell.lng_min, cell.lat_max],
            [cell.lng_min, cell.lat_min]
          ]]
        },
        properties: {
          id: cell.id,
          lat_min: cell.lat_min,
          lat_max: cell.lat_max,
          lng_min: cell.lng_min,
          lng_max: cell.lng_max,
          trash_density: cell.trash_density,
          greenery_score: cell.greenery_score,
          cleanliness_score: cell.cleanliness_score,
          carbon_emissions: cell.carbon_emissions,
          ecoScore
        }
      };
    });

    // Return GeoJSON FeatureCollection
    return NextResponse.json({
      type: 'FeatureCollection',
      features,
      pagination: {
        total: count || 0,
        page,
        totalPages: count ? Math.ceil(count / limit) : 1,
        limit
      }
    });

  } catch (error) {
    console.error('Error in regions API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}