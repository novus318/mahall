import React from 'react'
import { ChartTooltipContent, ChartTooltip, ChartContainer } from "@/components/ui/chart"
import { Pie, PieChart, } from "recharts"
const PiechartcustomChart = (props:any) => {
  return (
    <div{...props}>
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
  </div>
  )
}

export default PiechartcustomChart
