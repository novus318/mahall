import React from 'react'
import { ChartContainer, ChartTooltipContent } from './ui/chart'
import {  CartesianGrid, XAxis, Line, LineChart, Tooltip, } from "recharts"

const LinechartChart = (props:any) => {
  return (
    <div {...props}>
      <ChartContainer
        config={{
          desktop: {
            label: "Desktop",
            color: "hsl(var(--chart-1))",
          },
        }}
      >
        <LineChart
          accessibilityLayer
          data={[
            { month: "January", donation: 186, expense: 120 },
            { month: "February", donation: 305, expense: 200 },
            { month: "March", donation: 237, expense: 180 },
            { month: "April", donation: 73, expense: 95 },
            { month: "May", donation: 209, expense: 150 },
            { month: "June", donation: 214, expense: 175 },
          ]}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Line 
            dataKey="donation" 
            type="natural" 
            stroke="#82ca9d" 
            strokeWidth={2} 
            dot={false} 
          />
          <Line 
            dataKey="expense" 
            type="natural" 
            stroke="#8884d8" 
            strokeWidth={2} 
            dot={false} 
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}

export default LinechartChart
