'use client'
import CreateAccount from "@/components/CreateAccount";
import LinechartChart from "@/components/LinechartChart";
import PiechartcustomChart from "@/components/PiechartcustomChart";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { withAuth } from "@/components/withAuth";
import axios from "axios";
import { useEffect, useState } from "react";

function Home() {


  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/6">
        <Sidebar />
      </div>
      <div className="w-full md:w-5/6 p-4 space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Assets</CardTitle>
                <CardDescription>The total number of assets managed by the NGO.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">1,234</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Donations</CardTitle>
                <CardDescription>The total amount of donations received by the NGO.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">$567,890</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Volunteer Hours</CardTitle>
                <CardDescription>The total number of volunteer hours contributed to the NGO.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">12,345</div>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Asset Distribution</CardTitle>
                <CardDescription>A breakdown of the NGOs assets by category.</CardDescription>
              </CardHeader>
              <CardContent>
                <PiechartcustomChart className="aspect-[4/3]" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Donation Trends</CardTitle>
                <CardDescription>A line chart showing the trend of donations over time.</CardDescription>
              </CardHeader>
              <CardContent>
                <LinechartChart className="aspect-[4/3]" />
              </CardContent>
            </Card>
            </div>
      </div>
    </div>
  );
}

export default withAuth(Home);
