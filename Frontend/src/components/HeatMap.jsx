import React from 'react'
import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import { addDays, format } from 'date-fns'

import './HeatMapStyles.css'

const transformSubmissionsToHeatmap = (submissions) => {
  const map = {}

  submissions.forEach((sub) => {
    const day = format(new Date(sub.createdAt), 'yyyy-MM-dd')
    map[day] = (map[day] || 0) + 1
  })

  return Object.entries(map).map(([date, count]) => ({
    date,
    count: Number(count), // Ensure count is a number
  }))
}

const Heatmap = ({ submissions }) => {
  const values = transformSubmissionsToHeatmap(submissions)
  console.log('🔥 Heatmap Values:', values)

  return (
    <div className="bg-[#111] p-4 rounded-xl border border-[#222] mt-6">
      <h2 className="text-[#0FA] font-semibold text-sm mb-3">
        Submission Heatmap
      </h2>

      <CalendarHeatmap
        startDate={addDays(new Date(), -365)}
        endDate={new Date()}
        values={values}
        classForValue={(value) => {
          if (!value || !value.count) return 'color-empty'
          if (value.count >= 10) return 'color-scale-4'
          if (value.count >= 5) return 'color-scale-3'
          if (value.count >= 2) return 'color-scale-2'
          return 'color-scale-1'
        }}
        showWeekdayLabels
        gutterSize={2}
        horizontal={true}
      />

      {/* Custom color styles */}
      <style>{`
        .color-empty rect { fill: #1a1a1a; }
        .color-scale-1 rect { fill: #093; }
        .color-scale-2 rect { fill: #0a5; }
        .color-scale-3 rect { fill: #0c7; }
        .color-scale-4 rect { fill: #0FA; }
      `}</style>
    </div>
  )
}

export default Heatmap
