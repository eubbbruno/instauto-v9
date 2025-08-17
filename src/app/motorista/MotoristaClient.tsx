'use client'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import BeautifulSidebar from '@/components/BeautifulSidebar'
import ChatManager from '@/components/chat/ChatManager'
import QuickDiagnosticAI from '@/components/ai/QuickDiagnosticAI'
import ChatFloatingButton from '@/components/chat/ChatFloatingButton'
import { ModernDashboard } from '@/components/dashboard/ModernDashboard'
import { SkeletonDashboardAdvanced } from '@/components/ui/SkeletonAdvanced'

export default function MotoristaClient() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    checkUser()
  }, [])
  
  async function checkUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (!user) {
        window.location.href = '/login'
        return
      }
      
      setUser(user)
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (profile?.type !== 'motorista') {
        window.location.href = '/dashboard'
        return
      }
      
      setProfile(profile)
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const logout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <SkeletonDashboardAdvanced />
      </div>
    )
  }
  
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar */}
      <BeautifulSidebar 
        userType="motorista"
        userName={profile?.name || user?.email?.split('@')[0] || 'Motorista'}
        userEmail={user?.email}
        onLogout={logout}
      />
      
      {/* Main Content */}
      <div className="flex-1 transition-all duration-300 ml-0 md:ml-60">
        {/* Content Container */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-4 md:p-6 max-w-7xl">
              <ModernDashboard 
                userType="motorista"
                profile={profile}
                user={user}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Chat Components */}
      <ChatFloatingButton />
      <ChatManager />
    </div>
  )
}
}