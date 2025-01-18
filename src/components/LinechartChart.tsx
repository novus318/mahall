import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { CartesianGrid, XAxis, Line, LineChart, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const LinechartChart = ({ data }: any) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income & Expense Trends</CardTitle>
        <CardDescription>A line chart showing the trend of income & expenses over time.</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: '300px' }}> {/* Responsive container */}
          <ChartContainer
            config={{
              desktop: {
                label: "Desktop",
                color: "hsl(var(--chart-1))",
              },
              mobile: {
                label: "Mobile",
                color: "hsl(var(--chart-2))",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 20,
                  right: 20,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid vertical={false} stroke="#eee" strokeDasharray="3 3" /> {/* Add grid lines */}
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                  tick={{ fill: '#666', fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ stroke: '#ddd', strokeWidth: 1 }}
                  content={<ChartTooltipContent />}
                />
                <Line
                  dataKey="income"
                  type="monotone"
                  stroke="var(--color-desktop)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <Line
                  dataKey="expense"
                  type="monotone"
                  stroke="var(--color-mobile)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinechartChart;