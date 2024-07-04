"use client"

import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useSession } from "next-auth/react";
import { problemsColumns as columns } from "@/components/ui/Column"
import { DataTable } from "@/components/ui/DataTable"
import axios, { AxiosError } from 'axios';
import { toast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';

const Problems = () => {
  const { data: session } = useSession()
  const [problems, setProblems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProblems = async () => {
      setIsLoading(true)
      try {
        const resp = await axios.get("/api/problems")
        setProblems(resp.data.problems)
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
    fetchProblems()
  }, [])

  return (
    <main className="flex flex-col justify-center items-center">

      <div className="container mx-auto py-5">
        <DataTable columns={columns} data={problems} isLoading={isLoading} />
      </div>

      {session?.user.isAdmin &&
        <Link href="/problem/add" className='mb-4'>
          <Button>Add Problem</Button>
        </Link>
      }
    </main>
  )
}

export default Problems
