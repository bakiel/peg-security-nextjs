import React from 'react'
import Link from 'next/link'
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'

export interface StatsCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  href?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  gradient?: string
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  href,
  trend,
  gradient = 'from-gold to-gold-dark'
}: StatsCardProps) {
  const CardContent = (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center shadow-md`}>
          <Icon size={24} className="text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-sans font-semibold ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-grey-medium text-sm font-sans font-semibold mb-1">{title}</h3>
      <p className="text-3xl font-sans font-bold text-onyx">{value}</p>
      <div className={`h-1 bg-gradient-to-r ${gradient} mt-4 rounded-full transition-all duration-300`} />
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 p-6 group"
      >
        {CardContent}
      </Link>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {CardContent}
    </div>
  )
}
