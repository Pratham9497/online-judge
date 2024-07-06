"use client"

// import { Problem } from "@/index"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { FaTableList } from "react-icons/fa6"
import Image from "next/image"
import { getIndianTime } from "@/utils/getIndianTime"
import { ArrowUpDown, SortAsc } from "lucide-react"
import { Button } from "./Button"
import { Submission, User } from "@/models/User"
import { Problem } from "@/models/Problem"

export const problemsColumns: ColumnDef<Problem>[] = [
    //we can set normal fields like this
    {
        accessorKey: "id",
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Problem Id
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
        cell: ({row}) => {
            const id = row.getValue("id")
            return <div className="ml-5">{id+"."}</div>
        }
    },
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Problem Title
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
        cell: ({ row }) => {
            const title = row.getValue("title") as string
            const id = row.getValue("id")
            return <div className="ml-4"><Link href={`/problem/${id}`} className="hover:text-[blue] hover:underline">{title}</Link></div>
        }, 
    },
    {
        accessorKey: "editorial",
        header: "Editorial",
        cell: ({ row }) => {
            const pid = row.getValue("id")
            return <Link href={`/problem/${pid}?tab=editorial`}><FaTableList className="text-[blue] text-base" /></Link>
        }, 
    },
    {
        accessorKey: "rating",
        header: ({ column }) => {
            return (
                <div className="flex justify-center">
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Difficulty Level
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
              </div>
            )
          },
        cell: ({ row }) => {
            const rating = row.getValue("rating") as number
            if(rating <= 1000) {
                return <div className={`text-[#03fc07] font-bold text-center`}>{rating}</div>
            }
            else if(rating <= 1200){
                return <div className={`text-[#a9fc03] font-bold text-center`}>{rating}</div>
            }
            else if(rating <=1400){
                return <div className={`text-[#f0ff4a] font-bold text-center`}>{rating}</div>
            }
            else if(rating <= 1600){
                return <div className={`text-[#fc6203] font-bold text-center`}>{rating}</div>
            }
            return <div className={`text-[#fc0303] font-bold text-center`}>{rating}</div>
        },
    },
]

export const submissionsColumns: ColumnDef<Submission>[] = [
    //we can set normal fields like this
    {
        accessorKey: "id",
        header: "Submission Id",
        cell: ({ row }) => {
            const id = row.getValue("id") as string
            return <div className="hover:text-[blue] hover:underline cursor-pointer">{id}</div>
        },
    },
    {
        accessorKey: "language",
        header: "Language",
        cell: ({ row }) => {
            const ext = row.getValue("language") as string
            // const language = ext === 'py' ? 'Python' : ext === 'java' ? 'Java' : ext === 'cpp' ? 'C++' : ext === 'js' ? 'JavaScript' : 'TypeScript'
            return( 
                <div className="pl-3">
                    <Image 
                        alt="language"
                        src={`/${ext}.svg`}
                        width={30}
                        height={30}
                    />
                </div>  
            )
        }, 
    },
    {
        accessorKey: "verdict",
        header: "Verdict",
        cell: ({ row }) => {
            const verdict: string = row.getValue("verdict")
            return <div className={`px-2 py-1 max-w-40 text-center font-semibold rounded-lg ${verdict==="Compilation Error"?" bg-yellow-600":verdict==="Accepted"?" bg-green-600":" bg-red-600"}`}>{verdict}</div>
        },
    },
    {
        accessorKey: "submissionTime",
        header: "Submitted At",
        cell: ({ row }) => {
            const submissionTime: string = getIndianTime(row.getValue("submissionTime"))
            return <div className="text-gray-600">{submissionTime}</div>
        },
    },
]

export const allSubmissionsColumns: ColumnDef<Submission>[] = [
    //we can set normal fields like this
    {
        accessorKey: "id",
        header: "Submission Id",
        cell: ({ row }) => {
            const id = row.getValue("id") as string
            return <div className="hover:text-[blue] hover:underline cursor-pointer">{id}</div>
        },
    },
    {
        accessorKey: "problemId",
        header: ({ column }) => {
            return (
                <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                Problem Id
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
        },
        cell: ({row}) => {
            const id = row.getValue("problemId")
            return <div className="ml-5">{id+"."}</div>
        }
    },
    {
        accessorKey: "problemTitle",
        header: ({ column }) => {
            return (
                <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                Problem Title
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
        },
        cell: ({ row }) => {
            const title = row.getValue("problemTitle") as string
            const id = row.getValue("problemId")
            return <div className="ml-4"><Link href={`/problem/${id}`} className="hover:text-[blue] hover:underline">{title}</Link></div>
        }, 
    },
    {
        accessorKey: "language",
        header: "Language",
        cell: ({ row }) => {
            const ext = row.getValue("language") as string
            // const language = ext === 'py' ? 'Python' : ext === 'java' ? 'Java' : ext === 'cpp' ? 'C++' : ext === 'js' ? 'JavaScript' : 'TypeScript'
            return( 
                <div className="pl-3">
                    <Image 
                        alt="language"
                        src={`/${ext}.svg`}
                        width={30}
                        height={30}
                    />
                </div>  
            )
        }, 
    },
    {
        accessorKey: "verdict",
        header: "Verdict",
        cell: ({ row }) => {
            const verdict: string = row.getValue("verdict")
            return <div className={`px-2 py-1 max-w-40 text-center font-semibold rounded-lg ${verdict==="Compilation Error"?" bg-yellow-600":verdict==="Accepted"?" bg-green-600":" bg-red-600"}`}>{verdict}</div>
        },
    },
    {
        accessorKey: "submissionTime",
        header: "Submitted At",
        cell: ({ row }) => {
            const submissionTime: string = getIndianTime(row.getValue("submissionTime"))
            return <div className="text-gray-600">{submissionTime}</div>
        },
    },
]

export const adminColumns: ColumnDef<User>[] = [
    //we can set normal fields like this
    {
        accessorKey: "firstname",
        header: "S.No.",
        cell: ({ row }) => {
            const id = row.index + 1
            return <div className="hover:text-[blue] hover:underline cursor-pointer">{id}</div>
        },
    },
    {
        accessorKey: "lastname",
        header: "Name",
        cell: ({row}) => {
            const fname = row.getValue("firstname")
            const lname = row.getValue("lastname")
            return <div>{fname + " " + lname}</div>
        }
    },
    {
        accessorKey: "username",
        header: "Username",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
]