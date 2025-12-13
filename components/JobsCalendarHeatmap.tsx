'use client'

import { useEffect, useRef, useState } from 'react'

interface DayData {
  date: string
  count: number
  jobs: Array<{ title: string; company: string; slug: string }>
}

export interface JobsCalendarHeatmapProps {
  height?: string
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getColor(count: number, maxCount: number): string {
  if (count === 0) return '#1a1a2e'
  const intensity = Math.min(count / maxCount, 1)
  if (intensity < 0.25) return '#312e81'
  if (intensity < 0.5) return '#4338ca'
  if (intensity < 0.75) return '#6366f1'
  return '#818cf8'
}

export function JobsCalendarHeatmap({ height = '300px' }: JobsCalendarHeatmapProps) {
  const [data, setData] = useState<Map<string, DayData>>(new Map())
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null)
  const [maxCount, setMaxCount] = useState(1)

  // Fetch and process job data
  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch('/api/graph/jobs?limit=500')
        if (!response.ok) throw new Error('Failed to fetch')

        const result = await response.json()
        const graphData = result.graph || result
        const jobs = graphData.nodes?.filter((n: any) => n.type === 'job') || []

        // Group jobs by date
        const dateMap = new Map<string, DayData>()
        let max = 1

        for (const job of jobs) {
          const postedDate = job.data?.posted_date
          if (!postedDate) continue

          const date = new Date(postedDate).toISOString().split('T')[0]

          if (!dateMap.has(date)) {
            dateMap.set(date, { date, count: 0, jobs: [] })
          }

          const dayData = dateMap.get(date)!
          dayData.count++
          if (dayData.jobs.length < 5) {
            dayData.jobs.push({
              title: job.label || 'Job',
              company: job.data?.company || 'Company',
              slug: job.data?.slug || ''
            })
          }

          if (dayData.count > max) max = dayData.count
        }

        setData(dateMap)
        setMaxCount(max)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching jobs for calendar:', err)
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  // Generate calendar weeks for last 12 months
  const generateCalendarWeeks = () => {
    const weeks: Array<Array<{ date: string; dayOfMonth: number; month: number }>> = []
    const today = new Date()
    const startDate = new Date(today)
    startDate.setMonth(startDate.getMonth() - 11)
    startDate.setDate(1)

    // Align to start of week
    const dayOfWeek = startDate.getDay()
    startDate.setDate(startDate.getDate() - dayOfWeek)

    let currentWeek: Array<{ date: string; dayOfMonth: number; month: number }> = []

    while (startDate <= today) {
      currentWeek.push({
        date: startDate.toISOString().split('T')[0],
        dayOfMonth: startDate.getDate(),
        month: startDate.getMonth()
      })

      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }

      startDate.setDate(startDate.getDate() + 1)
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek)
    }

    return weeks
  }

  const weeks = generateCalendarWeeks()

  // Find month labels positions
  const monthLabels: Array<{ month: number; weekIndex: number }> = []
  let lastMonth = -1
  weeks.forEach((week, weekIndex) => {
    const firstDay = week[0]
    if (firstDay && firstDay.month !== lastMonth) {
      monthLabels.push({ month: firstDay.month, weekIndex })
      lastMonth = firstDay.month
    }
  })

  return (
    <div className="relative" style={{ minHeight: height }}>
      <div className="bg-gray-950 rounded-xl p-6 overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-indigo-300 text-sm">Loading calendar...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Month labels */}
            <div className="flex mb-2 ml-8">
              {monthLabels.map(({ month, weekIndex }, i) => (
                <div
                  key={i}
                  className="text-xs text-gray-500"
                  style={{
                    position: 'relative',
                    left: `${weekIndex * 14}px`,
                    width: '40px'
                  }}
                >
                  {MONTHS[month]}
                </div>
              ))}
            </div>

            <div className="flex">
              {/* Day labels */}
              <div className="flex flex-col mr-2">
                {DAYS.map((day, i) => (
                  <div
                    key={day}
                    className="text-xs text-gray-500 h-[14px] flex items-center"
                    style={{ visibility: i % 2 === 1 ? 'visible' : 'hidden' }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="flex gap-[2px]">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-[2px]">
                    {week.map((day, dayIndex) => {
                      const dayData = data.get(day.date)
                      const count = dayData?.count || 0

                      return (
                        <div
                          key={dayIndex}
                          className="w-[12px] h-[12px] rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-indigo-400"
                          style={{ backgroundColor: getColor(count, maxCount) }}
                          title={`${day.date}: ${count} jobs`}
                          onClick={() => dayData && setSelectedDay(dayData)}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Less</span>
                <div className="flex gap-1">
                  {[0, 0.25, 0.5, 0.75, 1].map((intensity, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: getColor(intensity * maxCount, maxCount) }}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">More</span>
              </div>
              <div className="text-xs text-gray-500">
                {data.size > 0 ? `${Array.from(data.values()).reduce((a, b) => a + b.count, 0)} jobs tracked` : 'No data'}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Selected day popup */}
      {selectedDay && (
        <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-sm rounded-xl p-4 max-w-xs border border-indigo-500/30 z-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold">{new Date(selectedDay.date).toLocaleDateString('en-GB', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}</h3>
            <button
              onClick={() => setSelectedDay(null)}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-indigo-400 text-sm mb-3">{selectedDay.count} jobs posted</p>
          <div className="space-y-2">
            {selectedDay.jobs.map((job, i) => (
              <a
                key={i}
                href={`/fractional-job/${job.slug}`}
                className="block p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <p className="text-white text-sm font-medium truncate">{job.title}</p>
                <p className="text-gray-400 text-xs truncate">{job.company}</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
