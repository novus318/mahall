import React from 'react'
import { ChartTooltipContent, ChartTooltip, ChartContainer } from "@/components/ui/chart"
import { Pie, PieChart, } from "recharts"
const PiechartcustomChart = (data:any) => {
  return (
    <div className='aspect-[5/3]'>
    <ChartContainer
      config={{
        salary: {
          label: "Salary",
        },
        rent: {
          label: "Rent",
        },
        kudiCollection: {
          label: "Collection",
        },
        donation: {
          label: "Donation",
        },
        pravasi: {
          label: "Pravasi",
        },
        expenses: {
          label: "Expenses",
        },
      }}
    >
      <PieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={[
            { asset: "Salary", percentage: 30, fill: '#8884d8'},
            { asset: "Rent", percentage: 20 ,fill: '#82ca9d' },
            { asset: "Kudi Collection", percentage: 25,fill:'#0088FE' },
            { asset: "Donation", percentage: 15 ,fill:'	#dba054' },
            { asset: "Pravasi Income", percentage: 10,fill:'#FF8042' },
            { asset: "Other expences", percentage: 10, fill:'	#FFBB28' },
          ]}
          dataKey="percentage"
          nameKey="asset"
        />
      </PieChart>
    </ChartContainer>
    <h2 className='text-muted-foreground font-extrabold'>Comming soon...</h2>
  </div>
  )
}

export default PiechartcustomChart
