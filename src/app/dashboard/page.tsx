'use client'
import CreateAccount from "@/components/CreateAccount";
import LinechartChart from "@/components/LinechartChart";
import PiechartcustomChart from "@/components/PiechartcustomChart";
import RecentTransactions from "@/components/RecentTransactions";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { withAuth } from "@/components/withAuth";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import React from 'react'

const Page = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [asset, setAsset] = useState(0);
  const [income, setincome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [lineData, setlineData] = useState([]);
  const [expensePercentage, setExpensePercentage] = useState(0)
  const [incomePercentage, setIncomePercentage] = useState(0)
  const [pieChartData, setPieChartData] = useState([]);
  const fetchAssets = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/dashboard/get-assets`);
      setAsset(response.data.asset);
    } catch (error) {
      console.log(error);
    }
  }

  const fetchincome = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/dashboard/get-incomes`);
      setincome(response.data.currentMonthTotal);
      setIncomePercentage(response.data.percentageChange)
    } catch (error) {
      console.log(error);
    }
  }

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/dashboard/get-expenses`);
      setExpense(response.data.currentMonthTotal);
      setExpensePercentage(response.data.percentageChange)
    } catch (error) {
      console.log(error);
    }
  }
  const fetchLineData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/dashboard/get-income-expense-trends`);
      setlineData(response.data.trends);
    } catch (error) {
      console.log(error);
    }
  }
  const fetchPieChartData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/dashboard/get-expense-categories`);
      setPieChartData(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchAssets();
    fetchincome();
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-700">Total Accounts</CardTitle>
              <CardDescription className="text-sm text-gray-500">The total number of assets managed by the accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {asset ? (
                  `₹${new Intl.NumberFormat('en-IN', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(asset)}`
                ) : (
                  <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-700">Total Income</CardTitle>
              <CardDescription className="text-sm text-gray-500">The total amount of Income received this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {income ? (
                  `₹${new Intl.NumberFormat('en-IN', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(income)}`
                ) : (
                  <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
                )}
              </div>
            </CardContent>
            <CardFooter>
              <div className={`text-xs ${incomePercentage > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {incomePercentage > 0 ? '+' : ''}{incomePercentage?.toFixed(2)}% from last month
              </div>
            </CardFooter>
          </Card>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-700">Total Expenses</CardTitle>
              <CardDescription className="text-sm text-gray-500">The total Expenses of the month.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {expense ? (
                  `₹${new Intl.NumberFormat('en-IN', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(expense)}`
                ) : (
                  <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
                )}
              </div>
            </CardContent>
            <CardFooter>
              <div className={`text-xs ${expensePercentage > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {expensePercentage > 0 ? '+' : ''}{expensePercentage?.toFixed(2)}% from last month
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
              <LinechartChart data={lineData} />
        </div>
        <RecentTransactions />
      </div>
    </div>
  );
}

export default withAuth(Page)
