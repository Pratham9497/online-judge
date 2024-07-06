import { Problem } from "@/models/Problem"
import { Submission, User } from "@/models/User"

export interface ApiResponse {
    success: boolean
    message: string
    problems?: Array<Problem>
    submissions?: Array<Submission>
    output?: string
    verdict?: string
    executionTime?: number
    memoryUsage?: number
    user?: User
    admins?: Array<User>
}