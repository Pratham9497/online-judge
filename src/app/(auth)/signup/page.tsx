'use client'

import React, { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import Link from 'next/link'
import { useDebounceCallback } from "usehooks-ts"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schemas/signUpSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ArrowUpRight, Loader2, LoaderPinwheel } from 'lucide-react'



const SignUp = () => {
    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [usernameStatus, setUsernameStatus] = useState(false)
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const debounced = useDebounceCallback(setUsername, 500)
    const { toast } = useToast()
    const router = useRouter()

    // zod implementation
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            firstname: '',
            lastname: '',
            username: '',
            email: '',
            password: ''
        },
    })

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username) {
                setIsCheckingUsername(true)
                setUsernameMessage('')
                try {
                    const resp = await axios.get(`/api/users/check-username?username=${username}`)
                    setUsernameMessage(resp.data.message)
                    setUsernameStatus(resp.data.success)
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setUsernameMessage(axiosError.response?.data.message ?? "Error while checking username")
                    setUsernameStatus(false)
                } finally {
                    setIsCheckingUsername(false)
                }
            }
        }
        checkUsernameUnique()
    }, [username])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        try {
            const resp = await axios.post<ApiResponse>(`/api/users/signup`, data)
            toast({
                title: "Success",
                description: resp.data.message
            })
            router.replace(`/verify/${username}`)
        } catch (error) {
            console.error("Error while signing up user", error)
            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data.message
            toast({
                title: "Sign up failed",
                description: errorMessage,
                variant: 'destructive'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className='flex justify-center items-center min-h-screen'>
            <div className='w-full max-w-md p-8 m-2 space-y-8 bg-black-200 rounded-lg shadow-md'>
                <div className='text-center'>
                    <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
                        Code With <span className=' text-purple'>CodeMonks</span>
                    </h1>
                    <p className='mb-4'>
                        <Link href="/"><button className='px-4 py-2 hover:bg-black-300 border-[2px] border-slate-300 rounded-lg'>Go to Home Page <ArrowUpRight className='relative inline-block'/> </button></Link>
                    </p>

                    <p className='mb-4'>
                        Sign Up and start your coding journey with CodeMonks
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                        <FormField
                            name="firstname"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="first name" disabled={isSubmitting}
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="lastname"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="last name" disabled={isSubmitting}
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="username" disabled={isSubmitting}
                                        {...field} 
                                        onChange={(e) => {
                                            field.onChange(e)
                                            debounced(e.target.value)
                                        }}
                                        />
                                    </FormControl>
                                    {isCheckingUsername && <LoaderPinwheel className='animate-spin'/>}
                                    {!isCheckingUsername && <p className={`text-xs ${usernameStatus ? "text-green-500" : "text-red-500"}`}>{usernameMessage}</p>}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type='email' disabled={isSubmitting} placeholder="e.g., pratham@shalya.com" 
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type='password' disabled={isSubmitting} placeholder="password" 
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type='submit' disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className='mr-2 w-4 h-4 animate-spin'/>
                                    Please wait
                                </>
                            ) : "Sign Up"}
                        </Button>

                    </form>
                </Form>
                <div className='text-center mt-4'>
                    <p>
                        Already have an account?{' '}
                        <Link href="/login" className='text-blue-600 hover:text-blue-800'>
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUp