'use client'
import CreateAccount from "@/components/CreateAccount";
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
      <div className="w-full md:w-5/6 p-4">
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <Card className="sm:col-span-2 lg:col-span-3 p-6 border rounded-lg shadow-lg bg-white">
  <CardHeader className="font-semibold text-xl border-b-2 border-gray-200 pb-2">
    Assets
  </CardHeader>
  <CardContent className="pt-4">
    <div className="flex flex-col gap-6">
      <ul className="space-y-2">
        <li className="flex justify-between text-gray-700 font-medium">
          <span className="font-medium">Bank</span>
          <span className="font-bold">₹00.00</span>
        </li>
        <li className="flex justify-between text-gray-700 font-medium">
          <span className="font-medium">Cash</span>
          <span className="font-bold">₹0.00</span>
        </li>
      </ul>
    </div>
  </CardContent>
</Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>This Week</CardDescription>
              <CardTitle className="text-3xl">O</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                +0% from last week
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>This Month</CardDescription>
              <CardTitle className="text-3xl">0</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                +0% from last month
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Home);
