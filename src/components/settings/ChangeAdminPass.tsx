'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import axios from 'axios'
import { toast } from '../ui/use-toast'

const ChangeAdminPass = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async () => {
    // Validate password: ensure it is exactly 6 digits
    const passwordRegex = /^\d{6}$/;
    if (!passwordRegex.test(adminPassword)) {
      return toast({
        title: "Invalid password",
        description: "Password must be exactly 6 digits.",
        variant: "destructive"
      });
    }

    try {
      setLoading(true);
      const response = await axios.post(`${apiUrl}/api/auth/reset-password`, {
        username:'admin',
        newPassword:adminPassword
      });

      if (response.data.success) {
        toast({ title: "Password changed", description: "Admin password updated successfully.", variant: "default" });
      } else {
        toast({ title: "Error", description: "Failed to update the password.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An error occurred while updating the password.", variant: "destructive" });
    } finally {
      setLoading(false);
      setAdminPassword('');
    }
  };

  return (
    <section className='mt-4'>
      <Card>
        <CardHeader>
          <CardTitle>Change Admin Password</CardTitle>
          <CardDescription>Update the administrator password.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Label htmlFor="adminPassword" className="w-24">New Password</Label>
            <Input
              type="password"
              id="adminPassword"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Enter 6-digit password"
              disabled={loading}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handlePasswordChange} disabled={loading}>
            {loading ? 'Updating...' : 'Change Password'}
          </Button>
        </CardFooter>
      </Card>
    </section>
  )
}

export default ChangeAdminPass;
