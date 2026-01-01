"use client"
import { useEffect } from 'react'
import { useAuth } from '../context/authContext'
import { useRouter } from 'next/navigation'

const clientAccessRules = {
  '/ai': ['booked', 'paid'],
  '/faq': ['paid'],
  '/medical-assistance': ['paid']
}

export default function RouteGuard() {
  const { user, isExternal, isBooked, isPremium } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) return

    const currentPath = window.location.pathname
    
    Object.entries(clientAccessRules).forEach(([path, allowedTypes]) => {
      if (currentPath.startsWith(path)) {
        const hasAccess = allowedTypes.includes(user.patient_type)
        
        if (!hasAccess) {
          const redirectPath = isExternal ? '/appointements' : '/Upgrade'
          router.push(redirectPath)
        }
      }
    })
  }, [user])

  return null
}