import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import { submissionsColumns as columns } from "@/components/ui/Column"
import { DataTable } from "@/components/ui/DataTable"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import React, { useCallback, useState } from 'react'
import mongoose from 'mongoose';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { toast } from './ui/use-toast';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

type Props = {
    problem: {
        id: number,
        title: string,
        statement: string,
        rating: number,
        author: string,
        constraints: string,
        sampleTestcases: { _id: mongoose.Types.ObjectId, input: string, expectedOutput: string }[],
        judgeTestcases: { _id: mongoose.Types.ObjectId, input: string, expectedOutput: string }[],
        editorial: string,
        usersAccepted: mongoose.Types.ObjectId[],
        createdAt: Date
    },
    author: string,
    tab: string | null,
}

const ProblemDetails = ({ problem, author, tab }: Props) => {
    const ratingCol = problem.rating <= 1000 ? "#03fc07" : problem.rating <= 1200 ? "#a9fc03" : problem.rating <= 1400 ? "#f0ff4a" : problem.rating <= 1600 ? "#fc6203" : "#fc0303";
    const [isLoading, setIsLoading] = useState(true)
    const [submissions, setSubmissions] = useState([])

    const handleSubmissionClick = useCallback(async () => {
        setIsLoading(true)
        try {
            const resp = await axios.get(`/api/problems/${problem.id}/submissions`)
            setSubmissions(resp.data.submissions)
            console.log(submissions)
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
    }, [problem.id, submissions])
    return (
        <ScrollArea className="shadcn-scrollbar h-full rounded-md border p-4">
            <Tabs defaultValue={tab || "problem"} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="problem" className="text-xs sm:text-sm md:text-xs lg:text-sm">Problem</TabsTrigger>
                    <TabsTrigger onClick={handleSubmissionClick} value="submissions" className="text-xs sm:text-sm md:text-xs lg:text-sm">Submissions</TabsTrigger>
                    <TabsTrigger value="editorial" className="text-xs sm:text-sm md:text-xs lg:text-sm">Editorial</TabsTrigger>
                </TabsList>
                <TabsContent value="problem">
                    <div className='h-full px-3 flex flex-col items-left justify-start gap-7 pb-2 overflow-y-auto'>
                        <div className='flex flex-col items-left justify-center gap-2'>
                            <h2 className='text-3xl underline '><Link href={`/problem/${problem.id}`}>{problem.id + ". " + problem.title}</Link></h2>
                            <div className='text-base' style={{ color: ratingCol }}>
                                Difficulty Level: <span>{problem.rating}</span>
                            </div>
                            <div className='text-base'>
                                Users Accepted: <span className='bg-blue-400 px-[8px] py-[3px] rounded-lg'>{problem.usersAccepted.length}</span>
                            </div>
                        </div>
                        <div className='flex flex-col items-left justify-center gap-2'>
                            <h2 className='text-2xl font-semibold'>Problem Statement: </h2>
                            <div className='text-base flex flex-col items-left justify-center gap-3'>
                                {problem.statement.split('\n').map((line, idx) => (
                                    <div key={idx} className='leading-6' dangerouslySetInnerHTML={{ __html: line }} />
                                ))}
                            </div>
                        </div>
                        <div className='flex flex-col items-left justify-center gap-2'>
                            <h2 className='text-2xl font-semibold'>Constraints: </h2>
                            <div className='text-base'>
                                <ul className=' list-disc flex flex-col items-left justify-center gap-1 pl-2'>
                                    {problem.constraints.split('\n').map((line, idx) => (
                                        <li key={idx} className='border-[2px] border-slate-600 bg-black-200 text-white-100 leading-6 rounded-xl px-2 w-fit' dangerouslySetInnerHTML={{ __html: line }} />
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className='flex flex-col items-left justify-center gap-2'>
                            <h2 className='text-2xl font-semibold'>TestCases: </h2>
                            <div className='text-lg'>
                                <ul className=' list-none flex flex-col items-left justify-center gap-3'>
                                    {problem.sampleTestcases.map((tc, idx) => (
                                        <li key={idx} className='flex flex-col items-left justify-center border-[2px] border-slate-600 bg-black-200 text-white-100 leading-8 rounded-xl p-3 gap-2'>
                                            <div className='text-xl font-semibold'>
                                                TestCase {idx + 1}:
                                            </div>
                                            <div>
                                                <div className='text-lg'>
                                                    Input:
                                                </div>
                                                <div className='py-2 px-3 bg-black-300 border-[2px] border-black-200 text-slate-500 rounded-lg'>
                                                    {tc.input.split('\n').map((inp, i) => (
                                                        <div key={i} className='leading-7'>
                                                            {inp}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <div className='text-lg'>
                                                    Output:
                                                </div>
                                                <div className='py-2 px-3 bg-black-300 border-[2px] border-black-200 text-slate-500 rounded-lg'>
                                                    {tc.expectedOutput.split('\n').map((op, i) => (
                                                        <div key={i} className='leading-7'>
                                                            {op}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className='text-2xl font-semibold'>
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>Author</AccordionTrigger>
                                    <AccordionContent>
                                        <Link className='text-xl text-purple italic font-semibold' href={`/u/${author}`}>{author}</Link>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="submissions">
                    <div className="container mx-auto py-5">
                        <DataTable columns={columns} data={submissions} isLoading={isLoading} allowFilter={false} allowPagination={false} />
                    </div>
                </TabsContent>
                <TabsContent value="editorial">
                    <div
                        className={`text-lg py-2 px-3 my-2 bg-black-300 border-[2px] border-black-200 rounded-lg flex flex-col justify-start items-left gap-3 text-justify`}
                    >{problem.editorial.split('\n').map((line, idx) => (
                        <div key={idx} dangerouslySetInnerHTML={{ __html: line }} />
                    ))}</div>
                </TabsContent>
            </Tabs>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    )
}

export default ProblemDetails
