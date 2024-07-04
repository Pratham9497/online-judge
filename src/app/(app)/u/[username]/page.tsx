'use client'

import Profile from '@/components/Profile'
import { User } from '@/models/User'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { notFound } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const UserProfile = ({ params: { username } }: { params: { username: string } }) => {
    const [profile, setProfile] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [userFound, setUserFound] = useState(true)
    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true)
            try {
                const resp = await axios.get(`/api/users/${username}`)
                setProfile(resp.data.user)
            } catch (error) {
                setUserFound(false)
            } finally {
                setIsLoading(false)
            }
        }
        fetchUser()
    }, [])

    if (!userFound) {
        notFound()
    }
    return (
        <>
            {isLoading || !userFound ?
                <div className='w-[100vw] h-[80vh] flex items-center justify-center'>
                    <Loader2 className='w-20 h-20 animate-spin' />
                </div>
                : <Profile profile={profile as User} />}
        </>
    )
}

export default UserProfile
