'use client'
import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

const ChangeAdminPass = () => {
  return (
    <section id="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Admin Password</CardTitle>
              <CardDescription>Update the administrator password.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Label htmlFor="adminPassword" className="w-24">New Password</Label>
                <Input
                  id="adminPassword"
                  type="password"
                  placeholder="Enter new admin password"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Change Password</Button>
            </CardFooter>
          </Card>
        </section>
  )
}

export default ChangeAdminPass
