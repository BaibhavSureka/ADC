'use client'
import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts'

export default function ChartComponent({ data, type, dataKey, xAxisKey, color = '#22c55e' }) {
  const [chartData, setChartData] = useState([])
  
  useEffect(() => {
    // Format data for chart if needed
    if (data && data.length > 0) {
      // Limit to 10 items for better visualization
      const formattedData = data.slice(0, 10).map(item => ({
        name: item[xAxisKey]?.substring(0, 15) || 'Unknown', // Truncate long names
        value: typeof item[dataKey] === 'number' ? item[dataKey] : parseInt(item[dataKey]) || 0
      }))
      setChartData(formattedData)
    }
  }, [data, dataKey, xAxisKey])
  
  if (!data || data.length === 0) {
    return <div className="h-64 flex items-center justify-center">No data available</div>
  }
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      {type === 'bar' ? (
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill={color} />
        </BarChart>
      ) : (
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke={color} />
        </LineChart>
      )}
    </ResponsiveContainer>
  )
}