"use client"

import { Button } from '@/components/ui/Button'
import { useSession } from "next-auth/react";
import Hero from "@/components/Hero";
import Link from 'next/link';
import { DataTable } from '@/components/ui/DataTable';
import { adminColumns as columns } from '@/components/ui/Column';
import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';

export default function Home() {
  const { data: session } = useSession()
  const [admins, setAdmins] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState('')

  const onAddAdmin = async (username: string) => {
    try {
      const resp = await axios.post("/api/users/admins", { username })
      toast({
        title: resp.data.message || "Success"
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      const errorMessage = axiosError.response?.data.message || "Internal Server Error"
      toast({
        title: errorMessage,
        variant: "destructive"
      })
    }
  }

  const onRemoveAdmin = async (username: string) => {
    try {
      const resp = await axios.post("/api/users/admins/remove", { username })
      toast({
        title: resp.data.message || "Success"
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      const errorMessage = axiosError.response?.data.message || "Internal Server Error"
      toast({
        title: errorMessage,
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    const fetchAdmins = async () => {
      setIsLoading(true)
      try {
        const resp = await axios.get("/api/users/admins")
        setAdmins(resp.data.admins)
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        const errorMessage = axiosError.response?.data.message
        toast({
          title: "Try reloading page",
          description: errorMessage,
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchAdmins()
  }, [])
  return (
    <main className="flex flex-col justify-center items-center">
      <Hero />
      <div className='w-full h-full flex flex-col justify-center items-center py-8'>
        <h1 className='heading text-purple'>Our Admins</h1>
        <div className='w-full h-full max-w-5xl py-10'>
          <DataTable columns={columns} isLoading={isLoading} data={admins} allowFilter={false} />
        </div>
        {session?.user.isSuperAdmin &&
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Change Admins</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add or Remove Admins</DialogTitle>
                <DialogDescription>
                  Add username and click Remove Admin to remove as admin, and Add Admin to create an admin.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input
                    id="username"
                    placeholder='Add a valid username'
                    className="col-span-3"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={() => onAddAdmin(username)}>Add Admin</Button>
                <Button type="button" onClick={() => onRemoveAdmin(username)}>Remove Admin</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      </div>
    </main>
  );
}
