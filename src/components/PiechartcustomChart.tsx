import React from 'react'
import { ChartTooltipContent, ChartTooltip, ChartContainer } from "@/components/ui/chart"
import { Pie, PieChart, } from "recharts"
const PiechartcustomChart = (data:any) => {
  const zeroAmounts = data.data.filter((item: { amount: number }) => item.amount === 0);
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
      <PieChart>
        {zeroAmounts.length === 5 ? (
            <Pie
            data={[
              { asset: "No data", amount: 1 },
            ]}
            dataKey="amount"
            nameKey="asset"
          />
        ):(
         <>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
  <Pie
  data={data.data}
  dataKey="amount"
  nameKey="asset"
/></>
        )}
      </PieChart>
    </ChartContainer>
  </div>
  )
}

export default PiechartcustomChart
