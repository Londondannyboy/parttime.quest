'use client'

import { useState } from 'react'

interface CompanyLogoProps {
  companyDomain?: string
  companyName: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
}

const initialSizeClasses = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-4xl',
}

export function CompanyLogo({
  companyDomain,
  companyName,
  size = 'sm',
  className = '',
}: CompanyLogoProps) {
  const [imageError, setImageError] = useState(false)
  const brandfetchClientId = process.env.NEXT_PUBLIC_BRANDFETCH_CLIENT_ID

  const showFallback = !companyDomain || imageError || !brandfetchClientId
  const logoUrl = companyDomain && brandfetchClientId
    ? `https://cdn.brandfetch.io/${companyDomain}/w/400/h/400?c=${brandfetchClientId}`
    : null

  return (
    <div className={`flex-shrink-0 ${sizeClasses[size]} rounded-lg overflow-hidden bg-white border border-gray-100 ${className}`}>
      {logoUrl && !showFallback && (
        <img
          src={logoUrl}
          alt={`${companyName} logo`}
          className="w-full h-full object-contain p-1.5"
          onError={() => setImageError(true)}
        />
      )}
      {showFallback && (
        <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
          <span className={`${initialSizeClasses[size]} font-bold text-purple-700`}>
            {companyName.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </div>
  )
}

// Larger version for company pages with different styling
export function CompanyLogoLarge({
  companyDomain,
  companyName,
}: {
  companyDomain?: string
  companyName: string
}) {
  const [imageError, setImageError] = useState(false)
  const brandfetchClientId = process.env.NEXT_PUBLIC_BRANDFETCH_CLIENT_ID

  const showFallback = !companyDomain || imageError || !brandfetchClientId
  const logoUrl = companyDomain && brandfetchClientId
    ? `https://cdn.brandfetch.io/${companyDomain}/w/400/h/400?c=${brandfetchClientId}`
    : null

  return (
    <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-white border-4 border-white/20 shadow-xl">
      {logoUrl && !showFallback && (
        <img
          src={logoUrl}
          alt={`${companyName} logo`}
          className="w-full h-full object-contain p-2"
          onError={() => setImageError(true)}
        />
      )}
      {showFallback && (
        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
          <span className="text-4xl font-bold text-white">
            {companyName.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </div>
  )
}
