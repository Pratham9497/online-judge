'use client'
import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import Link from 'next/link'
import { useToast } from "@/components/ui/use-toast"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ArrowUpRight, Loader2, LoaderPinwheel } from 'lucide-react'
import { signInSchema } from '@/schemas/signInSchema'
import { signIn } from 'next-auth/react'



const SignIn = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    // zod implementation
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: ''
        },
    })

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true)
        const res = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        })
        setIsSubmitting(false)
        if (res?.error){
            toast({
                title: 'Login Failed',
                description: res.error,
                variant: "destructive"
            })
        }
        console.log(res)
        if(res?.url) {
            window.history.back();
        }
    }

    return (
        <div className='flex justify-center items-center min-h-screen'>
            <div className='w-full max-w-md p-8 space-y-8 bg-black-200 rounded-lg shadow-md'>
                <div className='text-center'>
                    <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
                        Code With <span className=' text-purple'>CodeMonks</span>
                    </h1>
                    <p>
                        <Link href="/"><button className='px-4 py-2 hover:bg-black-300 border-[2px] border-slate-300 rounded-lg'>Go to Home Page <ArrowUpRight className='relative inline-block'/> </button></Link>
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                        <FormField
                            name="identifier"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username or Email</FormLabel>
                                    <FormControl>
                                        <Input type='text' disabled={isSubmitting} placeholder="username / email" 
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
                            ) : "Sign In"}
                        </Button>

                    </form>
                </Form>
                <div className='text-center mt-4'>
                    <p>
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className='text-blue-600 hover:text-blue-800'>
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignIn