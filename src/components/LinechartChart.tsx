import React, { useState } from 'react'
import { ChartContainer, ChartTooltipContent } from './ui/chart'
import {  CartesianGrid, XAxis, Line, LineChart, Tooltip, } from "recharts"
import axios from 'axios'

const LinechartChart = ({data}:any) => {
  return (
    <div className='aspect-[5/3]'>
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
          data={data}
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
