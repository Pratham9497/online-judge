'use client'

import React, { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useDebounceCallback } from "usehooks-ts"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Loader2, LoaderPinwheel } from 'lucide-react'
import { addProblemSchema } from '@/schemas/addProblemSchema'
import { Textarea } from '@/components/ui/textarea'
import useTextFormatting from '@/hooks/useTextFormatting'
import RichTextEditor from '@/components/RichTextEditor'
import { Testcase } from '@/models/Problem'

const initialFormValues: {
    title: string
    statement: string
    constraints: string
    sampleTestcases: Testcase[]
    judgeTestcases: Testcase[]
    rating: string
    editorial: string
} = {
    title: '',
    statement: '',
    constraints: '',
    sampleTestcases: [],
    judgeTestcases: [],
    rating: '',
    editorial: '',
};

const ProblemAdd = () => {

    const router = useRouter()
    const [title, setTitle] = useState('')
    const [titleMessage, setTitleMessage] = useState('')
    const [titleStatus, setTitleStatus] = useState(false)
    const [isCheckingTitle, setIsCheckingTitle] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const debounced = useDebounceCallback(setTitle, 500)
    const { toast } = useToast()
    const [formValues, setFormValues] = useState(initialFormValues)


    // zod implementation
    const form = useForm<z.infer<typeof addProblemSchema>>({
        resolver: zodResolver(addProblemSchema),
        defaultValues: formValues
    })

    useTextFormatting('.formatted-text')

    useEffect(() => {
        const checkTitleUnique = async () => {
            if (title) {
                setIsCheckingTitle(true)
                setTitleMessage('')
                try {
                    const resp = await axios.get(`/api/problems/check-title?title=${title}`)
                    setTitleMessage(resp.data.message)
                    setTitleStatus(resp.data.success)
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setTitleMessage(axiosError.response?.data.message ?? "Error while checking problem title")
                    setTitleStatus(false)
                } finally {
                    setIsCheckingTitle(false)
                }
            }
            else {
                setTitleMessage('Problem Title should not be empty')
                setTitleStatus(false)
            }
        }
        checkTitleUnique()
    }, [title])

    const onSubmit = async (data: z.infer<typeof addProblemSchema>) => {
        setIsSubmitting(true)
        try {
            const resp = await axios.post<ApiResponse>(`/api/problems`, data)
            toast({
                title: "Success",
                description: resp.data.message
            })
            router.replace("/problem")
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data.message
            toast({
                title: "Problem submission failed",
                description: errorMessage,
                variant: 'destructive'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleAddTestcase = (type: 'sampleTestcases' | 'judgeTestcases') => {
        form.setValue(`${type}.${formValues[type].length}.input`, '');
        form.setValue(`${type}.${formValues[type].length}.expectedOutput`, '');
        setFormValues((prevValues) => ({
            ...prevValues,
            [type]: [...prevValues[type], { input: '', expectedOutput: '' }],
        }));
    };

    const handleDeleteTestcase = (type: 'sampleTestcases' | 'judgeTestcases', index: number) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [type]: prevValues[type].filter((_, i) => i !== index),
        }));
    };

    const handleFileUpload = (
        event: React.ChangeEvent<HTMLInputElement>,
        type: 'input' | 'expectedOutput',
        index: number,
        testCaseType: 'sampleTestcases' | 'judgeTestcases'
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const text = reader.result as string;
                form.setValue(`${testCaseType}.${index}.${type}`, text);
                setFormValues((prevValues) => {
                    const updatedTestCases = [...prevValues[testCaseType]];
                    updatedTestCases[index][type] = text;
                    return {
                        ...prevValues,
                        [testCaseType]: updatedTestCases,
                    };
                });
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className='flex justify-center items-center min-h-screen'>
            <div className='w-full p-8 m-2 space-y-8 bg-black-200 rounded-lg shadow-md'>
                <div className='text-center'>
                    <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
                        <span className=' text-purple'>Admin</span> Page
                    </h1>
                    <p className='mb-4'>
                        Click on submit to add problem to problems list
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                        <FormField
                            name="title"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Problem Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Add Problem Title" disabled={isSubmitting}
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e)
                                                debounced(e.target.value)
                                            }}
                                        />
                                    </FormControl>
                                    {isCheckingTitle && <LoaderPinwheel className='animate-spin' />}
                                    {!isCheckingTitle && <p className={`text-xs ${titleStatus ? "text-green-500" : "text-red-500"}`}>{titleMessage}</p>}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="rating"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rating</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Rating e.g., 1000" disabled={isSubmitting}
                                            {...field}
                                            className='resize-none'
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="statement"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Problem Statement</FormLabel>
                                    <FormControl>
                                        <RichTextEditor
                                            value={field.value}
                                            onChange={field.onChange}
                                            disabled={isSubmitting}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="constraints"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Constraints</FormLabel>
                                    <FormControl>
                                        <RichTextEditor
                                            value={field.value}
                                            onChange={field.onChange}
                                            disabled={isSubmitting}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            name="editorial"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Editorial</FormLabel>
                                    <FormControl>
                                        <RichTextEditor
                                            value={field.value}
                                            onChange={field.onChange}
                                            disabled={isSubmitting}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Sample Testcases */}
                        <div>

                            {formValues.sampleTestcases.map((testcase, index) => (
                                <div key={index} className='p-4 bg-black-200 flex flex-col gap-2'>
                                    <FormField
                                        key={index}
                                        name={`sampleTestcases.${index}.input`}
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Sample Testcase {index + 1} Input</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder={`Sample Testcase ${index + 1} Input`} disabled={isSubmitting}
                                                        {...field}
                                                        className='resize-none'
                                                    />
                                                </FormControl>
                                                <Input
                                                    type="file"
                                                    accept='.txt'
                                                    title='uploadTestcase'
                                                    onChange={(e) => handleFileUpload(e, 'input', index, 'sampleTestcases')}
                                                    disabled={isSubmitting}
                                                    className=' w-fit text-[12px] cursor-pointer'
                                                />

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        key={index}
                                        name={`sampleTestcases.${index}.expectedOutput`}
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Sample Testcase {index + 1} Output</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder={`Sample Testcase ${index + 1} Output`} disabled={isSubmitting}
                                                        {...field}
                                                        className='resize-none'
                                                    />
                                                </FormControl>
                                                <Input
                                                    type="file"
                                                    title='uploadTestcase'
                                                    onChange={(e) => handleFileUpload(e, 'expectedOutput', index, 'sampleTestcases')}
                                                    disabled={isSubmitting}
                                                    accept='.txt'
                                                    className=' w-fit text-[12px] cursor-pointer'

                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button className='text-sm' type="button" onClick={() => handleDeleteTestcase('sampleTestcases', index)} disabled={isSubmitting}>Delete Sample Testcase {index + 1}</Button>
                                </div>
                            ))}

                            <Button className='text-sm' type="button" onClick={() => handleAddTestcase('sampleTestcases')} disabled={isSubmitting}>Add Sample Testcase</Button>
                        </div>

                        {/* Judge Testcases */}
                        <div>

                            {formValues.judgeTestcases.map((testcase, index) => (
                                <div className='p-4 bg-black-200 flex flex-col gap-2' key={index}>
                                    <FormField
                                        key={index}
                                        name={`judgeTestcases.${index}.input`}
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Judge Testcase {index + 1} Input</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder={`Judge Testcase ${index + 1} Input`} disabled={isSubmitting}
                                                        {...field}
                                                        className='resize-none'
                                                    />
                                                </FormControl>
                                                <Input
                                                    type="file"
                                                    title='uploadTestcase'
                                                    onChange={(e) => handleFileUpload(e, 'input', index, 'judgeTestcases')}
                                                    disabled={isSubmitting}
                                                    accept='.txt'
                                                    className=' w-fit text-[12px] cursor-pointer'
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        key={index}
                                        name={`judgeTestcases.${index}.expectedOutput`}
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Judge Testcase {index + 1} Output</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder={`Judge Testcase ${index + 1} Output`} disabled={isSubmitting}
                                                        {...field}
                                                        className='resize-none'
                                                    />
                                                </FormControl>
                                                <Input
                                                    type="file"
                                                    title='uploadTestcase'
                                                    onChange={(e) => handleFileUpload(e, 'expectedOutput', index, 'judgeTestcases')}
                                                    disabled={isSubmitting}
                                                    accept='.txt'
                                                    className=' w-fit text-[12px] cursor-pointer'
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="button" onClick={() => handleDeleteTestcase('judgeTestcases', index)} disabled={isSubmitting}>Delete Judge Testcase {index + 1}</Button>
                                </div>
                            ))}

                            <Button type="button" onClick={() => handleAddTestcase('judgeTestcases')} disabled={isSubmitting}>Add Judge Testcase</Button>
                        </div>

                        <Button type='submit' disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className='mr-2 w-4 h-4 animate-spin' />
                                    Please wait
                                </>
                            ) : "Submit"}
                        </Button>

                    </form>
                </Form>
            </div>
        </div>
    )
}

export default ProblemAdd