import { User } from '@/models/User'
import React, { useEffect, useState } from 'react'
import { DataTable } from './ui/DataTable'
import { allSubmissionsColumns as columns } from './ui/Column'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { toast } from './ui/use-toast'

type Props = {
    profile: User
}

const Profile = ({ profile }: Props) => {
    const [isLoading, setIsLoading] = useState(true)
    const [submissions, setSubmissions] = useState([])
    useEffect(() => {
        const fetchSubmissions = async () => {
            setIsLoading(true)
            try {
                const resp = await axios.get(`/api/users/${profile.username}/submissions`)
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
        <div className='w-full h-full flex flex-col gap-20 py-10'>
            <div className='w-full h-full flex flex-col gap-8'>
                <h1 className='heading text-purple'>
                    Profile Details
                </h1>
                <div className='w-full h-full flex md:flex-row flex-col items-center justify-center text-2xl md:gap-20 gap-5 px-10 py-2'>
                    <div className='flex flex-col justify-center items-start gap-2'>
                        {/* <div className='font-semibold'>First Name : <span className='text-purple'>{profile.firstname}</span></div>
                        <div className='font-semibold'>Username : <span className='text-purple'>{profile.username}</span></div>
                        <div className='font-semibold'>Problems Solved : <span className='bg-blue-400 px-2 rounded-lg'>{profile.solvedProblems.length}</span></div> */}
                        <div className='font-semibold'>Name : <span className='text-purple'>{profile.firstname + " " + profile.lastname}</span></div>
                        <div className='font-semibold'>Username : <span className='text-purple'>{profile.username}</span></div>
                        <div className='font-semibold '>Email : <span className='text-purple'>{profile.email}</span></div>
                        <div className='font-semibold'>Problems Solved : <span className='bg-blue-400 px-2 rounded-lg'>{profile.solvedProblems.length}</span></div>
                        <div className='font-semibold'>Total Submissions : <span className='bg-blue-400 px-2 rounded-lg'>{profile.submissions.length}</span></div>
                    </div>
                </div>
            </div>
            <div className='w-full h-full flex flex-col gap-5'>
                <h1 className=' heading text-purple'>
                    All Submissions
                </h1>
                <div className="container mx-auto py-5">
                    <DataTable columns={columns} data={submissions} isLoading={isLoading} allowFilter={false} />
                </div>
            </div>
        </div>
    )
}

export default Profile
