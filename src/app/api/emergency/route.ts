import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface EmergencyRequest {
  userId: string
  serviceType: 'guincho' | 'mecanico' | 'pneu' | 'bateria' | 'combustivel'
  location: {
    lat: number
    lng: number
    address?: string
  }
  description: string
  vehicleInfo?: {
    make: string
    model: string
    year: number
    plate: string
  }
  priority: 'low' | 'medium' | 'high' | 'critical'
  contactPhone: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const lat = parseFloat(searchParams.get('lat') || '0')
    const lng = parseFloat(searchParams.get('lng') || '0')
    const serviceType = searchParams.get('serviceType') || 'all'
    const radius = parseInt(searchParams.get('radius') || '25') // 25km default for emergency
    const available24h = searchParams.get('available24h') === 'true'

    console.log('🚨 Emergency services search:', { lat, lng, serviceType, radius, available24h })

    // Build query for emergency service providers
    let queryBuilder = supabase
      .from('emergency_services')
      .select(`
        id,
        name,
        service_types,
        phone,
        whatsapp,
        latitude,
        longitude,
        response_time_min,
        response_time_max,
        price_range_min,
        price_range_max,
        rating,
        available_24h,
        current_status,
        description,
        coverage_radius,
        created_at
      `)
      .eq('is_active', true)
      .eq('current_status', 'available')

    // Filter by service type
    if (serviceType !== 'all') {
      queryBuilder = queryBuilder.contains('service_types', [serviceType])
    }

    // Filter by 24h availability
    if (available24h) {
      queryBuilder = queryBuilder.eq('available_24h', true)
    }

    const { data: services, error } = await queryBuilder
      .order('rating', { ascending: false })

    if (error) {
      console.error('❌ Emergency services query error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch emergency services' },
        { status: 500 }
      )
    }

    if (!services) {
      return NextResponse.json({ services: [] })
    }

    // Calculate distances and filter by radius
    const servicesWithDistance = services
      .map(service => {
        if (!service.latitude || !service.longitude) return null

        // Calculate distance using Haversine formula
        const R = 6371 // Earth's radius in km
        const dLat = (service.latitude - lat) * Math.PI / 180
        const dLng = (service.longitude - lng) * Math.PI / 180
        const a = 
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat * Math.PI / 180) * Math.cos(service.latitude * Math.PI / 180) *
          Math.sin(dLng / 2) * Math.sin(dLng / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        const distance = R * c

        // Check if within radius
        if (distance > radius) return null

        return {
          id: service.id,
          name: service.name,
          type: service.service_types[0], // Primary service type
          serviceTypes: service.service_types,
          phone: service.phone,
          whatsapp: service.whatsapp,
          responseTime: `${service.response_time_min}-${service.response_time_max} min`,
          price: `R$ ${service.price_range_min}-${service.price_range_max}`,
          rating: service.rating || 4.5,
          available24h: service.available_24h,
          distance: parseFloat(distance.toFixed(1)),
          description: service.description,
          status: service.current_status
        }
      })
      .filter(Boolean)
      .sort((a, b) => a.distance - b.distance) // Sort by nearest first

    console.log(`✅ Found ${servicesWithDistance.length} emergency services`)

    return NextResponse.json({
      services: servicesWithDistance,
      searchParams: {
        location: { lat, lng },
        serviceType,
        radius,
        available24h
      }
    })

  } catch (error) {
    console.error('❌ Emergency services API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as EmergencyRequest
    const { 
      userId, 
      serviceType, 
      location, 
      description, 
      vehicleInfo, 
      priority,
      contactPhone 
    } = body

    console.log('🚨 Emergency request:', { userId, serviceType, location, priority })

    // Validate required fields
    if (!userId || !serviceType || !location || !description || !contactPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create emergency request
    const { data: emergencyRequest, error } = await supabase
      .from('emergency_requests')
      .insert({
        user_id: userId,
        service_type: serviceType,
        latitude: location.lat,
        longitude: location.lng,
        address: location.address,
        description,
        vehicle_make: vehicleInfo?.make,
        vehicle_model: vehicleInfo?.model,
        vehicle_year: vehicleInfo?.year,
        vehicle_plate: vehicleInfo?.plate,
        priority,
        contact_phone: contactPhone,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Emergency request creation error:', error)
      return NextResponse.json(
        { error: 'Failed to create emergency request' },
        { status: 500 }
      )
    }

    // Find nearby emergency services
    const nearbyServices = await findNearbyEmergencyServices(location, serviceType)

    // Send notifications to nearby services (in production)
    // await notifyEmergencyServices(emergencyRequest.id, nearbyServices)

    // Log emergency request
    console.log('✅ Emergency request created:', emergencyRequest.id)

    return NextResponse.json({
      requestId: emergencyRequest.id,
      message: 'Emergency request created successfully',
      nearbyServices: nearbyServices.slice(0, 3), // Return top 3 nearest services
      estimatedResponseTime: '15-30 minutos'
    }, { status: 201 })

  } catch (error) {
    console.error('❌ Emergency request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get emergency request status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { requestId, status, providerId, estimatedArrival } = body

    console.log('🔄 Updating emergency request:', { requestId, status })

    const { data: updatedRequest, error } = await supabase
      .from('emergency_requests')
      .update({
        status,
        assigned_provider_id: providerId,
        estimated_arrival: estimatedArrival,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .select()
      .single()

    if (error) {
      console.error('❌ Emergency request update error:', error)
      return NextResponse.json(
        { error: 'Failed to update emergency request' },
        { status: 500 }
      )
    }

    // Send real-time notification to user (in production)
    // await sendRealtimeNotification(updatedRequest.user_id, {
    //   type: 'emergency_update',
    //   status,
    //   estimatedArrival
    // })

    return NextResponse.json({
      message: 'Emergency request updated',
      request: updatedRequest
    })

  } catch (error) {
    console.error('❌ Emergency update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to find nearby emergency services
async function findNearbyEmergencyServices(location: any, serviceType: string) {
  try {
    const { data: services } = await supabase
      .from('emergency_services')
      .select('*')
      .contains('service_types', [serviceType])
      .eq('is_active', true)
      .eq('current_status', 'available')

    if (!services) return []

    return services
      .map(service => {
        const distance = calculateDistance(
          location.lat, 
          location.lng, 
          service.latitude, 
          service.longitude
        )
        return { ...service, distance }
      })
      .filter(service => service.distance <= service.coverage_radius)
      .sort((a, b) => a.distance - b.distance)

  } catch (error) {
    console.error('❌ Error finding nearby services:', error)
    return []
  }
}

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Helper function to get service type in Portuguese
function getServiceTypeName(type: string): string {
  const types: Record<string, string> = {
    guincho: 'Guincho',
    mecanico: 'Mecânico',
    pneu: 'Pneu',
    bateria: 'Bateria',
    combustivel: 'Combustível'
  }
  return types[type] || type
}
