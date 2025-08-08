import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const query = searchParams.get('q') || ''
    const lat = parseFloat(searchParams.get('lat') || '0')
    const lng = parseFloat(searchParams.get('lng') || '0')
    const radius = parseInt(searchParams.get('radius') || '10')
    const priceRange = searchParams.get('priceRange') || 'all'
    const rating = parseFloat(searchParams.get('rating') || '0')
    const openNow = searchParams.get('openNow') === 'true'
    const services = searchParams.get('services')?.split(',') || []
    const plano = searchParams.get('plano') || 'all'
    const sortBy = searchParams.get('sortBy') || 'distance'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    console.log('🔍 API Search params:', {
      query, lat, lng, radius, priceRange, rating, openNow, services, plano, sortBy, page, limit
    })

    // Build the base query
    let queryBuilder = supabase
      .from('workshops')
      .select(`
        id,
        name,
        description,
        address,
        city,
        state,
        latitude,
        longitude,
        phone,
        whatsapp,
        email,
        website,
        plan_type,
        is_verified,
        rating,
        review_count,
        price_range,
        services,
        specializations,
        amenities,
        opening_hours,
        photos,
        response_time,
        availability_status,
        created_at,
        updated_at,
        profiles!inner(
          name,
          avatar_url
        )
      `)
      .eq('profiles.type', 'oficina')
      .eq('is_active', true)

    // Apply filters
    if (query) {
      queryBuilder = queryBuilder.or(
        `name.ilike.%${query}%,description.ilike.%${query}%,services.cs.{${query}},specializations.cs.{${query}}`
      )
    }

    if (priceRange !== 'all') {
      queryBuilder = queryBuilder.eq('price_range', priceRange)
    }

    if (rating > 0) {
      queryBuilder = queryBuilder.gte('rating', rating)
    }

    if (plano !== 'all') {
      queryBuilder = queryBuilder.eq('plan_type', plano)
    }

    if (services.length > 0) {
      // Filter by services array overlap
      queryBuilder = queryBuilder.overlaps('services', services)
    }

    // Execute query
    const { data: workshops, error } = await queryBuilder
      .order('rating', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      console.error('❌ Database error:', error)
      return NextResponse.json(
        { error: 'Failed to search workshops' },
        { status: 500 }
      )
    }

    if (!workshops || workshops.length === 0) {
      return NextResponse.json({
        workshops: [],
        total: 0,
        page,
        limit,
        hasMore: false
      })
    }

    // Calculate distances if coordinates provided
    const workshopsWithDistance = workshops.map(workshop => {
      let distance = 0
      let estimatedTime = 'N/A'

      if (lat && lng && workshop.latitude && workshop.longitude) {
        // Haversine formula for distance calculation
        const R = 6371 // Earth's radius in kilometers
        const dLat = (workshop.latitude - lat) * Math.PI / 180
        const dLng = (workshop.longitude - lng) * Math.PI / 180
        const a = 
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat * Math.PI / 180) * Math.cos(workshop.latitude * Math.PI / 180) *
          Math.sin(dLng / 2) * Math.sin(dLng / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        distance = R * c

        // Estimate time (assuming 30 km/h average speed in city)
        const timeInHours = distance / 30
        const minutes = Math.round(timeInHours * 60)
        estimatedTime = minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)}h ${minutes % 60}min`
      }

      return {
        id: workshop.id,
        name: workshop.name,
        description: workshop.description,
        address: workshop.address,
        city: workshop.city,
        state: workshop.state,
        position: {
          lat: workshop.latitude || 0,
          lng: workshop.longitude || 0
        },
        distance: parseFloat(distance.toFixed(1)),
        estimatedTime,
        rating: workshop.rating || 0,
        reviews: workshop.review_count || 0,
        priceRange: workshop.price_range || 'moderate',
        plano: workshop.plan_type || 'free',
        services: workshop.services || [],
        specializations: workshop.specializations || [],
        isOpen: this.isCurrentlyOpen(workshop.opening_hours),
        openingHours: workshop.opening_hours || {},
        contact: {
          phone: workshop.phone,
          whatsapp: workshop.whatsapp,
          email: workshop.email,
          website: workshop.website
        },
        amenities: workshop.amenities || {},
        photos: workshop.photos || [],
        lastUpdate: workshop.updated_at,
        verified: workshop.is_verified || false,
        responseTime: workshop.response_time || '2-4h',
        availability: workshop.availability_status || 'available',
        owner: {
          name: workshop.profiles?.name,
          avatar: workshop.profiles?.avatar_url
        }
      }
    })

    // Filter by radius if coordinates provided
    let filteredWorkshops = workshopsWithDistance
    if (lat && lng && radius > 0) {
      filteredWorkshops = workshopsWithDistance.filter(w => w.distance <= radius)
    }

    // Sort results
    filteredWorkshops.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance
        case 'rating':
          return b.rating - a.rating
        case 'price':
          const priceOrder = { budget: 1, moderate: 2, expensive: 3 }
          return priceOrder[a.priceRange] - priceOrder[b.priceRange]
        case 'availability':
          const availOrder = { available: 1, busy: 2, full: 3, closed: 4 }
          return availOrder[a.availability] - availOrder[b.availability]
        default:
          return 0
      }
    })

    // Get total count for pagination
    const { count } = await supabase
      .from('workshops')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    const total = count || 0
    const hasMore = (page * limit) < total

    console.log(`✅ Found ${filteredWorkshops.length} workshops`)

    return NextResponse.json({
      workshops: filteredWorkshops,
      total: filteredWorkshops.length,
      page,
      limit,
      hasMore,
      filters: {
        query,
        location: lat && lng ? { lat, lng } : null,
        radius,
        priceRange,
        rating,
        openNow,
        services,
        plano,
        sortBy
      }
    })

  } catch (error) {
    console.error('❌ Search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to check if workshop is currently open
function isCurrentlyOpen(openingHours: any): boolean {
  if (!openingHours || typeof openingHours !== 'object') return false
  
  const now = new Date()
  const currentDay = now.toLocaleDateString('en', { weekday: 'lowercase' })
  const currentTime = now.toTimeString().slice(0, 5) // HH:MM format
  
  const dayHours = openingHours[currentDay]
  if (!dayHours || dayHours.closed) return false
  
  const { open, close } = dayHours
  if (!open || !close) return false
  
  // Simple time comparison (assumes same day, no overnight hours)
  return currentTime >= open && currentTime <= close
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { searchQuery, location, filters } = body

    // This endpoint could be used for complex search queries
    // or to save search preferences
    
    return NextResponse.json({
      message: 'Search saved',
      searchId: `search_${Date.now()}`
    })

  } catch (error) {
    console.error('❌ Search POST error:', error)
    return NextResponse.json(
      { error: 'Failed to process search' },
      { status: 500 }
    )
  }
}
