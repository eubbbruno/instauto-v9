'use client'
import { ReactNode } from 'react'
import InstitutionalHeader from './InstitutionalHeader'
import InstitutionalFooter from './InstitutionalFooter'

interface InstitutionalLayoutProps {
  children: ReactNode
  headerTransparent?: boolean
  headerFixed?: boolean
  className?: string
}

export default function InstitutionalLayout({ 
  children, 
  headerTransparent = false,
  headerFixed = true,
  className = ''
}: InstitutionalLayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      <InstitutionalHeader 
        transparent={headerTransparent} 
        fixed={headerFixed}
      />
      
      <main className={`flex-1 ${headerFixed ? 'pt-24' : ''}`}>
        {children}
      </main>
      
      <InstitutionalFooter />
    </div>
  )
}
