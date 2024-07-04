'use client'
import ProblemDes from '@/components/ProblemDes'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { title } from 'process'
import React, { useEffect, useState } from 'react'

type Props = {
  params: {
    id: string
  }
}

const ProblemDesc = ({ params: { id } }: Props) => {
  const [isLoading, setIsLoading] = useState(true)
  const [problem, setProblem] = useState({
    id: 0,
    title: '',
    statement: ``,
    rating: 100,
    author: '',
    constraints: ``,
    sampleTestcases: [],
    judgeTestcases: [],
    editorial: ``,
    usersAccepted: [],
    createdAt: new Date()
  })
  const [author, setAuthor] = useState('')
  const [problemFound, setProblemFound] = useState(true)
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab')
  const tabValue = tab==="editorial"||tab==="problem"||tab==="submissions"?tab:null
  useEffect(() => {
    const fetchProblem = async () => {
      setIsLoading(true)
      try {
        const resp = await axios.get(`/api/problems/${id}`)
        // console.log("Here is my error")
        const prob = resp.data.problem
        const authorUsername = resp.data.authorUsername
        setProblem({
          id: prob.id,
          title: prob.title,
          statement: prob.statement,
          rating: prob.rating,
          author: prob.author,
          constraints: prob.constraints,
          sampleTestcases: prob.sampleTestcases,
          judgeTestcases: prob.judgeTestcases,
          editorial: prob.editorial,
          usersAccepted: prob.usersAccepted,
          createdAt: prob.createdAt
        })
        setAuthor(authorUsername)
      } catch (error) {
        setProblemFound(false)
      } finally {
        setIsLoading(false)
      }
    }
    // console.log("Here is my error")
    fetchProblem()
  }, [])
  
  // console.log("Here is my error")
  if(!problemFound){
    notFound()
  }
  return (
    <>
      {isLoading || !problemFound?
        <div className='w-[100vw] h-[80vh] flex items-center justify-center'>
          <Loader2 className='w-20 h-20 animate-spin' />
        </div>
        : <ProblemDes tab={tabValue} problem={problem} author={author} />}
    </>
  )
}

export default ProblemDesc

