"use client"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"

import { submissionsColumns as columns } from "@/components/ui/Column"
import { DataTable } from "@/components/ui/DataTable"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import React, { ProgressHTMLAttributes, useCallback, useEffect, useState } from 'react'
import MonacoEditor from './MonacoEditor';
import mongoose from 'mongoose';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Monaco } from '@monaco-editor/react';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { toast } from './ui/use-toast';
import { Loader2 } from 'lucide-react';
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
    tab: string | null
}

type Language = 'javascript' | 'typescript' | 'java' | 'cpp' | 'python'

const ProblemDes = ({ problem, author, tab }: Props) => {
    const [code, setCode] = useState('/*For java, write class name as Hello. Use Ctrl + Up Arrow key to increase font size and Ctrl + Down Arrow key to decrease font size*/')

    const [language, setLanguage] = useState<Language>('cpp');
    const [fontSize, setFontSize] = useState(14);
    const [output, setOutput] = useState<string | undefined>(undefined)
    const [isCompilingOrSubmitting, setIsCompilingOrSubmitting] = useState(false)
    const [input, setInput] = useState(problem.sampleTestcases[0]?.input || '')
    const [submitted, setSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [submissions, setSubmissions] = useState([])

    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        try {
            setIsCompilingOrSubmitting(true)
            setSubmitted(true)
            const ext = language === 'python' ? 'py' : language === 'java' ? 'java' : 'cpp'
            const resp = await axios.post(`/api/problems/${problem.id}/submit`, {
                code,
                ext
            })
            toast({
                title: resp.data.message,
            })
            setOutput(resp.data.verdict)
            // console.log(output)

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data.message || "Unexpected Issue. Try Again"
            setOutput(axiosError.response?.data.verdict || "Unexpected Issue. Try Again")
            toast({
                title: errorMessage,
                variant: "destructive"
            })
        } finally {
            setIsCompilingOrSubmitting(false)
        }
    }

    const handleCompile = async (event: React.MouseEvent<HTMLButtonElement>) => {
        try {
            setIsCompilingOrSubmitting(true)
            setSubmitted(false)
            const ext = language === 'python' ? 'py' : language === 'java' ? 'java' : 'cpp'
            const resp = await axios.post(`/api/problems/${problem.id}/run`, {
                input,
                code,
                ext
            })

            setOutput(resp.data.output)
            console.log(output)

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data.message
            setOutput(axiosError.response?.data.output || 'Unexpected Issue. Try Again.')
            if (axiosError.response?.data.output === 'Internal Server Error') toast({
                title: "Failed to execute",
                description: errorMessage,
                variant: "destructive"
            })
        } finally {
            setIsCompilingOrSubmitting(false)
        }
    }

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

    const handleEditorMount = (editor: any, monaco: Monaco) => {
        // Add custom keybinding for increasing font size
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.UpArrow, () => {
            setFontSize((prevFontSize) => Math.min(prevFontSize + 1, 40)); // Increase font size up to a max of 40
        });

        // Add custom keybinding for decreasing font size
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.DownArrow, () => {
            setFontSize((prevFontSize) => Math.max(prevFontSize - 1, 8)); // Decrease font size down to a min of 8
        });
    };

    const handleCodeChange = (newValue: string | undefined) => {
        if (newValue !== undefined) setCode(newValue)
    }

    const ratingCol = problem.rating <= 1000 ? "#03fc07" : problem.rating <= 1200 ? "#a9fc03" : problem.rating <= 1400 ? "#f0ff4a" : problem.rating <= 1600 ? "#fc6203" : "#fc0303";
    return (
        <main className='flex w-full h-[81vh] text-white px-4'>
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel minSize={50}>
                    {/* <div className="overflow-y-auto w-full h-full px-3"> */}
                    <ScrollArea className=" w-full h-full rounded-md border p-4">
                        <Tabs defaultValue={tab ||"problem"} className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="problem">Problem Description</TabsTrigger>
                                <TabsTrigger onClick={handleSubmissionClick} value="submissions">Submissions</TabsTrigger>
                                <TabsTrigger value="editorial">Editorial</TabsTrigger>
                            </TabsList>
                            <TabsContent value="problem">
                                <div className='h-full px-3 flex flex-col items-left justify-start gap-7 pb-2 overflow-y-auto'>
                                    <div className='flex flex-col items-left justify-center gap-2'>
                                        <h2 className='text-3xl underline '>{problem.id + ". " + problem.title}</h2>
                                        <div className='text-base' style={{ color: ratingCol }}>
                                            Difficulty Level: <span>{problem.rating}</span>
                                        </div>
                                        <div className='text-base'>
                                            Users Accepted: <span className='bg-blue-400 px-[8px] py-[3px] rounded-lg'>{problem.usersAccepted.length}</span>
                                        </div>
                                    </div>
                                    <div className='flex flex-col items-left justify-center gap-2'>
                                        <h2 className='text-2xl font-semibold'>Problem Statement: </h2>
                                        <div className='text-sm flex flex-col items-left justify-center gap-3'>
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
                </ResizablePanel>
                <ResizableHandle className="w-1 rounded-full h-full my-auto mx-4" />
                <ResizablePanel className="w-1/2" minSize={50}>
                    <div className='w-full h-full flex flex-col items-left justify-center'>
                        <ScrollArea className=" w-full h-full rounded-md border p-4">
                            {/* <div className='w-full h-[90%] flex flex-col items-left jutify-start gap-2 pb-2'> */}

                                <div className='relative w-full h-full rounded-xl px-3 flex flex-col items-left justify-center gap-1'>

                                    <div className='pl-1 pt-1'>
                                        <Select disabled={isCompilingOrSubmitting} onValueChange={(value: Language) => setLanguage(value)} value={language}>
                                            <SelectTrigger className="w-[130px] mb-2">
                                                <SelectValue placeholder="Select a Language" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Language</SelectLabel>
                                                    <SelectItem value="python">Python</SelectItem>
                                                    <SelectItem value="cpp">C++</SelectItem>
                                                    <SelectItem value="java">Java</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="h-[45vh] overflow-y-auto">

                                        <MonacoEditor
                                            value={code}
                                            language={language}
                                            onChange={handleCodeChange}
                                            fontSize={fontSize}
                                            onMount={handleEditorMount}
                                            />
                                    </div>
                                </div>
                                <div className='flex flex-col items-left justify-center gap-2 w-full p-3'>
                                    <div className='text-lg'>
                                        Input:
                                    </div>
                                    <textarea
                                        title='Insert Input'
                                        className='text-xl py-2 px-3 bg-black-300 border-[2px] border-black-200 text-slate-500 rounded-lg leading-8 w-full h-36 resize-none overflow-x-auto'
                                        value={input}
                                        onChange={(event) => setInput(event.target.value)}
                                        disabled={isCompilingOrSubmitting}
                                    />
                                </div>
                                <div className='flex flex-col items-left justify-start gap-2 w-full p-3'>
                                    <div className='text-lg' id='output'>
                                        Output:
                                    </div>

                                    {isCompilingOrSubmitting ? <Loader2 className='mx-auto w-10 h-10 animate-spin' /> :
                                        <>
                                            {<div
                                                title='Insert Input'
                                                className={`text-xl overflow-y-auto overflow-x-auto py-2 px-3 bg-black-300 border-[2px] border-black-200 rounded-lg max-h-60 min-h-12 ${submitted && (output === "Compilation Error" ? " text-yellow-400 font-semibold" : output === "Accepted" ? " text-green-600 font-semibold" : output === "Not Accepted" || output === "Internal Server Error" ? "text-rose-600" : "text-white")}`}
                                            >{output?.split('\n').map((line, idx) => (
                                                <div key={idx}>
                                                    {`${line}`}
                                                </div>
                                            ))}</div>}
                                        </>}
                                </div>
                            {/* </div> */}
                        </ScrollArea>
                        <div className='w-full h-[10%] flex items-center justify-evenly'>
                            <Link href="#output"><button className="p-[3px] relative" onClick={handleCompile} disabled={isCompilingOrSubmitting}>
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                                <div className="px-8 py-2 bg-black-200 rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
                                    Compile and Run
                                </div>
                            </button></Link>
                            <Link href="#output"><button className="p-[3px] relative" onClick={handleSubmit} disabled={isCompilingOrSubmitting}>
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                                <div className="px-8 py-2  bg-black-200 rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                                    Submit
                                </div>
                            </button></Link>
                        </div>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </main >
    )
}

export default ProblemDes
