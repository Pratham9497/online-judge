import { ScrollArea} from "@/components/ui/scroll-area"
import React, { useState } from 'react'
import MonacoEditor from './MonacoEditor';
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
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Language = 'javascript' | 'typescript' | 'java' | 'cpp' | 'python'

type Props = {
    probId: number
    initInput: string
}

const ProblemSubmit = ({probId, initInput}: Props) => {

    const [code, setCode] = useState('/*For java, write class name as Hello. \nUse Ctrl + Up Arrow key to increase font size. \nUse Ctrl + Down Arrow key to decrease font size*/')

    const [language, setLanguage] = useState<Language>('cpp');
    const [fontSize, setFontSize] = useState(14);
    const [output, setOutput] = useState<string | undefined>(undefined)
    const [isCompilingOrSubmitting, setIsCompilingOrSubmitting] = useState(false)
    const [input, setInput] = useState(initInput)
    const [submitted, setSubmitted] = useState(false)
    const {data: session} = useSession()
    const router = useRouter()

    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        if(!session || !session.user){
            router.push('/login')
            return;
        }
        router.push('#output')
        try {
            setIsCompilingOrSubmitting(true)
            setSubmitted(true)
            const ext = language === 'python' ? 'py' : language === 'java' ? 'java' : 'cpp'
            const resp = await axios.post(`/api/problems/${probId}/submit`, {
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
        if(!session || !session.user){
            router.push('/login')
            return;
        }
        router.push('#output')
        try {
            setIsCompilingOrSubmitting(true)
            setSubmitted(false)
            const ext = language === 'python' ? 'py' : language === 'java' ? 'java' : 'cpp'
            const resp = await axios.post(`/api/problems/${probId}/run`, {
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

    return (
        <div className='w-full h-full flex flex-col justify-center'>
            <ScrollArea className="shadcn-scrollbar h-full rounded-md border p-4">

                <div className='h-full rounded-xl flex flex-col items-left justify-center gap-1'>

                    <div className='pl-1 pt-1'>
                        <Select disabled={isCompilingOrSubmitting} onValueChange={(value: Language) => setLanguage(value)} value={language}>
                            <SelectTrigger className="w-24 h-8 mb-2">
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
                    <div className="h-[50vh] w-full">

                        <MonacoEditor
                            value={code}
                            language={language}
                            onChange={handleCodeChange}
                            fontSize={fontSize}
                            onMount={handleEditorMount}
                        />
                    </div>
                </div>
                <div className='flex flex-col items-left justify-center gap-2 py-3'>
                    <div className='text-lg'>
                        Input:
                    </div>
                    <textarea
                        title='Insert Input'
                        className='text-xl py-2 px-3 bg-black-300 border-[2px] border-black-200 text-slate-500 rounded-lg leading-8 w-full h-36 resize-none'
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        disabled={isCompilingOrSubmitting}
                    />
                </div>
                <div className='flex flex-col items-left justify-start gap-2 w-full py-3'>
                    <div className='text-lg' id='output'>
                        Output:
                    </div>

                    {isCompilingOrSubmitting ? <Loader2 className='mx-auto w-10 h-10 animate-spin' /> :
                        <>
                            {<div
                                title='Check output'
                                className={`text-xl overflow-y-auto py-2 px-3 bg-black-300 border-[2px] border-black-200 rounded-lg max-h-60 min-h-12 ${submitted && (output === "Compilation Error" ? " text-yellow-400 font-semibold" : output === "Accepted" ? " text-green-600 font-semibold" : output === "Not Accepted" || output === "Internal Server Error" ? "text-rose-600" : "text-white")}`}
                            >{output?.split('\n').map((line, idx) => (
                                <div key={idx}>
                                    {`${line}`}
                                </div>
                            ))}</div>}
                        </>}
                </div>
            </ScrollArea>

            <div className='w-full md:h-[10%] py-3 flex items-center justify-evenly'>
                <button className="p-[3px] relative" onClick={handleCompile} disabled={isCompilingOrSubmitting}>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-700 rounded-lg" />
                    <div className="sm:px-8 px-6 py-1 bg-black-200 rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
                        Run Code
                    </div>
                </button>
                <button className="p-[3px] relative" onClick={handleSubmit} disabled={isCompilingOrSubmitting}>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-700 rounded-lg" />
                    <div className="sm:px-8 px-6 py-1  bg-black-200 rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                        Submit
                    </div>
                </button>
            </div>
        </div>
    )
}

export default ProblemSubmit
