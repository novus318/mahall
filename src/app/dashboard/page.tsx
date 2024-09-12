'use client'
import CreateAccount from "@/components/CreateAccount";
import LinechartChart from "@/components/LinechartChart";
import PiechartcustomChart from "@/components/PiechartcustomChart";
import RecentTransactions from "@/components/RecentTransactions";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { withAuth } from "@/components/withAuth";
import axios from "axios";
import { useEffect, useState } from "react";

import React from 'react'

const Page = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [asset, setAsset] = useState(0);
    const [donations, setDonations] = useState(0);
    const [expense, setExpense] = useState(0);
    const [lineData, setlineData] = useState([]);
  const[expensePercentage,setExpensePercentage] =useState(0)
    const [pieChartData, setPieChartData] = useState([]);
  const fetchAssets = async ()=>{
    try {
      const response = await axios.get(`${apiUrl}/api/dashboard/get-assets`);
      setAsset(response.data.asset);
    } catch (error) {
      console.log(error);
    }
  }
  
  const fetchDonations = async ()=>{
    try {
      const response = await axios.get(`${apiUrl}/api/dashboard/get-donations`);
      setDonations(response.data.totalDonations);
    } catch (error) {
      console.log(error);
    }
  }
  
  const fetchExpenses = async ()=>{
    try {
      const response = await axios.get(`${apiUrl}/api/dashboard/get-expenses`);
      setExpense(response.data.currentMonthTotal);
      setExpensePercentage(response.data.percentageChange)
    } catch (error) {
      console.log(error);
    }
    }
    const fetchLineData = async ()=>{
      try {
        const response = await axios.get(`${apiUrl}/api/dashboard/get-donation-expense-trends`);
        setlineData(response.data.trends);
      } catch (error) {
        console.log(error);
      }
    }
    const fetchPieChartData = async ()=>{
      try {
        const response = await axios.get(`${apiUrl}/api/dashboard/get-expense-categories`);
        setPieChartData(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    useEffect(() => {
      fetchAssets();
      fetchDonations();
      fetchExpenses();
      fetchLineData();
      fetchPieChartData();
    }, []);
    return (
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/6">
            <Sidebar />
          </div>
          <div className="w-full md:w-5/6 p-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Accounts</CardTitle>
                    <CardDescription>The total number of assets managed by the accounts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">₹{asset?.toFixed(2)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Total Donations</CardTitle>
                    <CardDescription>The total amount of donations received this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">₹{donations?.toFixed(2)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Total Expenses</CardTitle>
                    <CardDescription>The total Expenses of the month.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">₹{expense?.toFixed(2)}</div>
                  </CardContent>
                  <CardFooter>
                    <div className="text-sm text-gray-600">
                      {expensePercentage > 0? '+': ''}{expensePercentage}%  from last month
                    </div>
                  </CardFooter>
                </Card>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Asset Distribution</CardTitle>
                    <CardDescription>A breakdown the assets of month by category.</CardDescription>
                  </CardHeader>
                  <CardContent>
                   <PiechartcustomChart data={pieChartData} />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Donation & Expense Trends</CardTitle>
                    <CardDescription>A line chart showing the trend of donations & expenses over time.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LinechartChart data={lineData} />
                  </CardContent>
                </Card>
                </div>
                <RecentTransactions/>
          </div>
        </div>
      );
}

export default withAuth(Page)
