import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const workshopId = searchParams.get('workshopId')
    const userId = searchParams.get('userId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const rating = searchParams.get('rating')
    const sentiment = searchParams.get('sentiment')
    const period = searchParams.get('period') // 7, 30, 90, 365 days
    
    console.log('📊 Avaliacoes API params:', { workshopId, userId, page, limit, rating, sentiment, period })

    // Build base query
    let queryBuilder = supabase
      .from('reviews')
      .select(`
        id,
        rating,
        comment,
        service_type,
        service_value,
        created_at,
        updated_at,
        response,
        response_date,
        helpful_count,
        verified_purchase,
        profiles!inner(
          id,
          name,
          avatar_url,
          type
        ),
        workshops!inner(
          id,
          name,
          plan_type
        )
      `)

    // Apply filters
    if (workshopId) {
      queryBuilder = queryBuilder.eq('workshop_id', workshopId)
    }

    if (userId) {
      queryBuilder = queryBuilder.eq('user_id', userId)
    }

    if (rating) {
      queryBuilder = queryBuilder.eq('rating', parseInt(rating))
    }

    if (period) {
      const daysAgo = parseInt(period)
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - daysAgo)
      queryBuilder = queryBuilder.gte('created_at', startDate.toISOString())
    }

    // Execute query with pagination
    const { data: reviews, error, count } = await queryBuilder
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      console.error('❌ Reviews query error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      )
    }

    if (!reviews) {
      return NextResponse.json({
        reviews: [],
        stats: { total: 0, average: 0, distribution: {} },
        pagination: { page, limit, total: 0, hasMore: false }
      })
    }

    // Calculate statistics
    const stats = calculateReviewStats(reviews)

    // Format reviews with AI analysis for PRO users
    const formattedReviews = reviews.map(review => {
      const formatted = {
        id: review.id,
        clienteNome: review.profiles?.name || 'Cliente',
        clienteAvatar: review.profiles?.avatar_url,
        rating: review.rating,
        comentario: review.comment,
        servico: review.service_type || 'Serviço geral',
        valorServico: review.service_value || 0,
        data: new Date(review.created_at).toLocaleDateString('pt-BR'),
        respondida: !!review.response,
        resposta: review.response,
        helpful: review.helpful_count || 0,
        clienteFrequente: false, // TODO: Calculate based on review history
        verified: review.verified_purchase || false
      }

      // Add AI analysis for PRO workshops
      if (review.workshops?.plan_type === 'pro') {
        formatted.sentiment = analyzeSentiment(review.comment)
        formatted.keywords = extractKeywords(review.comment)
      }

      return formatted
    })

    const total = count || 0
    const hasMore = (page * limit) < total

    console.log(`✅ Found ${reviews.length} reviews`)

    return NextResponse.json({
      reviews: formattedReviews,
      stats,
      pagination: {
        page,
        limit,
        total,
        hasMore
      }
    })

  } catch (error) {
    console.error('❌ Avaliacoes API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      workshopId, 
      userId, 
      rating, 
      comment, 
      serviceType, 
      serviceValue,
      appointmentId 
    } = body

    console.log('📝 Creating review:', { workshopId, userId, rating, serviceType })

    // Validate required fields
    if (!workshopId || !userId || !rating || !comment) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Check if user already reviewed this workshop
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('workshop_id', workshopId)
      .eq('user_id', userId)
      .eq('appointment_id', appointmentId)
      .single()

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this service' },
        { status: 409 }
      )
    }

    // Create the review
    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        workshop_id: workshopId,
        user_id: userId,
        appointment_id: appointmentId,
        rating,
        comment,
        service_type: serviceType,
        service_value: serviceValue,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Review creation error:', error)
      return NextResponse.json(
        { error: 'Failed to create review' },
        { status: 500 }
      )
    }

    // Update workshop rating
    await updateWorkshopRating(workshopId)

    console.log('✅ Review created:', review.id)

    return NextResponse.json({
      message: 'Review created successfully',
      review: {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.created_at
      }
    }, { status: 201 })

  } catch (error) {
    console.error('❌ Review creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to calculate review statistics
function calculateReviewStats(reviews: any[]) {
  const total = reviews.length
  
  if (total === 0) {
    return {
      total: 0,
      average: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      responded: 0,
      pending: 0
    }
  }

  const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
  const average = sum / total

  const distribution = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1
    return acc
  }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 })

  const responded = reviews.filter(r => r.response).length
  const pending = total - responded

  return {
    total,
    average: parseFloat(average.toFixed(1)),
    distribution,
    responded,
    pending
  }
}

// Simple sentiment analysis (for PRO features)
function analyzeSentiment(comment: string): 'positive' | 'neutral' | 'negative' {
  const positiveWords = [
    'excelente', 'ótimo', 'bom', 'maravilhoso', 'perfeito', 'recomendo',
    'profissional', 'rápido', 'qualidade', 'satisfeito', 'feliz'
  ]
  
  const negativeWords = [
    'ruim', 'péssimo', 'horrível', 'demora', 'caro', 'problema',
    'insatisfeito', 'decepcionado', 'erro', 'falha'
  ]

  const lowerComment = comment.toLowerCase()
  
  const positiveCount = positiveWords.filter(word => lowerComment.includes(word)).length
  const negativeCount = negativeWords.filter(word => lowerComment.includes(word)).length

  if (positiveCount > negativeCount) return 'positive'
  if (negativeCount > positiveCount) return 'negative'
  return 'neutral'
}

// Extract keywords from comment (for PRO features)
function extractKeywords(comment: string): string[] {
  const keywords = [
    'atendimento', 'preço', 'qualidade', 'rapidez', 'profissional',
    'limpeza', 'organização', 'explicação', 'transparência', 'honestidade',
    'demora', 'problema', 'solução', 'recomendo', 'voltarei'
  ]

  const lowerComment = comment.toLowerCase()
  return keywords.filter(keyword => lowerComment.includes(keyword))
}

// Update workshop overall rating
async function updateWorkshopRating(workshopId: string) {
  try {
    // Get all reviews for this workshop
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('workshop_id', workshopId)

    if (!reviews || reviews.length === 0) return

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / reviews.length

    // Update workshop rating
    await supabase
      .from('workshops')
      .update({
        rating: parseFloat(averageRating.toFixed(1)),
        review_count: reviews.length,
        updated_at: new Date().toISOString()
      })
      .eq('id', workshopId)

    console.log(`✅ Updated workshop ${workshopId} rating to ${averageRating.toFixed(1)}`)

  } catch (error) {
    console.error('❌ Error updating workshop rating:', error)
  }
}
