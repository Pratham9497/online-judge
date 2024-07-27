"use client"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import React from 'react'
import mongoose from 'mongoose';
import useWindowSize from "@/hooks/useWindowSize"
import ProblemDetails from "./ProblemDetails";
import ProblemSubmit from "./ProblemSubmit";

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

const ProblemDes = ({ problem, author, tab }: Props) => {
    
    const windowSize = useWindowSize();

    return (
        <main className='flex md:flex-row gap-4 flex-col w-full md:h-[81vh] h-full text-white px-4'>
            {windowSize.width && windowSize.width >= 768 && <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={40} minSize={35} className="h-full">
                    <ProblemDetails author={author} problem={problem} tab={tab} />
                </ResizablePanel>
                <ResizableHandle withHandle className="m-[5px] w-1 rounded-full text-blue-400" />
                <ResizablePanel defaultSize={60} minSize={35}>
                    <ProblemSubmit probId={problem.id} initInput={problem.sampleTestcases[0]?.input || ''} />
                </ResizablePanel>
            </ResizablePanelGroup>}

            {windowSize.width && windowSize.width < 768 &&
                <>
                    <ProblemDetails author={author} problem={problem} tab={tab} />
                    <ProblemSubmit probId={problem.id} initInput={problem.sampleTestcases[0]?.input || ''} />
                </>
            }
        </main >
    )
}

export default ProblemDes
