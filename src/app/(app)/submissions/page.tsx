'use client'

import React, { useEffect, useState } from 'react'
import { allSubmissionsColumns as columns } from '@/components/ui/Column'
import { DataTable } from '@/components/ui/DataTable'
import { toast } from '@/components/ui/use-toast'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'

const Submissions = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [submissions, setSubmissions] = useState([])
    useEffect(() => {
        const fetchSubmissions = async () => {
            setIsLoading(true)
            try {
                const resp = await axios.get(`/api/problems/submissions`)
                setSubmissions(resp.data.submissions)
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
        fetchSubmissions()
    }, [])
    return (
        <div className="container mx-auto py-5">
            <DataTable columns={columns} data={submissions} isLoading={isLoading} allowFilter={false} />
        </div>
    )
}

export default Submissions
