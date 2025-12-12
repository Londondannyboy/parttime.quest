'use client'

import { ReactNode } from 'react'

interface CalculatorCardProps {
  title: string
  subtitle?: string
  icon?: string
  children: ReactNode
  footer?: ReactNode
}

export function CalculatorCard({
  title,
  subtitle,
  icon,
  children,
  footer
}: CalculatorCardProps) {
  return (
    <div className="calculator-container">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 px-6 py-5 border-b border-purple-100">
        <div className="flex items-center gap-4">
          {icon && (
            <span className="text-3xl">{icon}</span>
          )}
          <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 md:p-8">
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  )
}
