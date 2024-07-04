import { exec } from "child_process"
import { Worker, isMainThread, parentPort, workerData } from "worker_threads"
import { normalizeString } from "./normalizeString";
import fs from 'fs/promises'

const TIME_LIMIT_MS = 1000; // time limit in ms
const MEMORY_LIMIT_MB = 10; // memory limit in MB

export async function compileCpp(codeFilePath: string, outputFilePath: string) {
    return new Promise((resolve) => {
        exec(`g++ ${codeFilePath} -o ${outputFilePath}`, (error, stdout, stderr) => {
            if(error) {
                // console.log(stderr)
                resolve({error: true, result: stderr})
            }
            else resolve({error: false, result: stdout});
            fs.unlink(codeFilePath)
        })
    })
}

export async function compileJava(codeFilePath: string) {
    return new Promise((resolve) => {
        exec(`javac ${codeFilePath}`, (error, stdout, stderr) => {
            if(error) {
                // console.log(stderr)
                resolve({error: true, result: stderr})
            }
            else resolve({error: false, result: stdout});
        })
    })
}

// export async function runTestcase(expectedOutput: string, outputFilePath: string, inputFilePath: string) {
//     return new Promise((resolve) => {
//         const worker = new Worker(__filename, {
//             workerData: {outputFilePath, inputFilePath},
//             // execArgv: ['--max-old-space-size='+MEMORY_LIMIT_MB]
//         })

//         console.log(path.resolve(__dirname, "../../../../../executeCpp.ts"))

//         let testExecutionTime
//         let testMemoryUsage
//         const startTime = performance.now()
//         const startMemory = process.memoryUsage().heapUsed

//         const timeout = setTimeout(() => {
//             worker.terminate()
//             testMemoryUsage = process.memoryUsage().heapUsed - startMemory
//             resolve({
//                 verdict: false,
//                 executionTime: TIME_LIMIT_MS,
//                 memoryUsage: testMemoryUsage,
//                 status: 'TLE'
//             })
//         }, TIME_LIMIT_MS)

//         worker.on('message', (result) => {
//             clearTimeout(timeout)
//             testExecutionTime = performance.now() - startTime
//             testMemoryUsage = process.memoryUsage().heapUsed - startMemory
//             let verdict = false
//             let status = 'WA'
//             if(!result) {
//                 status = 'RE'
//             }
//             else if(normalizeString(expectedOutput) == normalizeString(result)){
//                 verdict = true
//                 status = 'AC'
//             }
//             resolve({
//                 verdict,
//                 executionTime: testExecutionTime,
//                 memoryUsage: testMemoryUsage,
//                 status
//             })
//         })

//         worker.on('error', (e) => {
//             console.log(e)
//             clearTimeout(timeout)
//             resolve({
//                 verdict: false,
//                 executionTime: performance.now() - startTime,
//                 memoryUsage: process.memoryUsage().heapUsed - startMemory,
//                 status: 'Internal Server Error'
//             })
//         })

//         worker.on('exit', (code) => {
//             if(code !== 0) {
//                 clearTimeout(timeout)
//                 resolve({
//                     verdict: false,
//                     executionTime: performance.now() - startTime,
//                     memoryUsage: MEMORY_LIMIT_MB*1024,
//                     status: 'MLE'
//                 })
//             }
//         })

//     })
// }

// if(!isMainThread) {
//     const {outputFilePath, inputFilePath} = workerData

//     (async () => {
//         try {
//             // Execute user code here (e.g., using a function that executes the code)
//             const result = await executeUserCode(inputFilePath, outputFilePath);
//             if(parentPort) parentPort.postMessage(result);
//         } catch (e) {
//             if(parentPort) parentPort.postMessage(null);
//         }
//     })();

// }

// export async function executeUserCode(inputFilePath:string, outputFilePath: string) {
//     //TODO: handle different programming languages
//     try {
//         const result = await runCpp(inputFilePath, outputFilePath)
//         return result
//     } catch (error) {
//         return null
//     }
// }

// export async function runCpp(inputFilePath: string, outputFilePath: string) {
//     return new Promise((resolve, reject) => {
//         exec(`${outputFilePath} < ${inputFilePath}`, (error, stdout, stderr) => {
//             if(error) {
//                 reject(stderr)
//             }
//             resolve(stdout)
//         })
//     })

// }

export async function runCpp(inputFilePath: string, outputFilePath: string, expectedOutput: string) {
    return new Promise((resolve) => {
        const startTime = performance.now()
        const startMemory = process.memoryUsage().heapUsed

        exec(`${outputFilePath} < ${inputFilePath}`,
            {
                maxBuffer: MEMORY_LIMIT_MB * 1024 * 1024 , // Set memory limit
                timeout: TIME_LIMIT_MS,
            },
            (error, stdout, stderr) => {
            if(error) {
                if (error.killed) {
                    resolve({result: stderr, verdict: false, executionTime: TIME_LIMIT_MS, memoryUsage: process.memoryUsage().heapUsed - startMemory, status: 'TLE' });
                } else if (stderr.includes('ENOMEM')) {
                    resolve({ result: stderr, verdict: false, executionTime: performance.now() - startTime, memoryUsage: MEMORY_LIMIT_MB*1024*1024, status: 'MLE' });
                } else {
                    resolve({ result: stderr, verdict: false, executionTime: performance.now() - startTime, memoryUsage: process.memoryUsage().heapUsed - startMemory, status: 'RE' });
                }
            }
            if(normalizeString(expectedOutput || "") == normalizeString(stdout || "")) {
                resolve({ result: stdout, verdict: true, executionTime: performance.now() - startTime, memoryUsage: process.memoryUsage().heapUsed - startMemory, status: 'AC' })
            }
            else{
                resolve({ result: stdout, verdict: false, executionTime: performance.now() - startTime, memoryUsage: process.memoryUsage().heapUsed - startMemory, status: 'WA' })
            }
            setTimeout(() => {
                fs.unlink(inputFilePath)
            }, 10000)
        })
    })

}

export async function runJS(inputFilePath: string, codeFilePath: string, expectedOutput: string) {
    return new Promise((resolve) => {
        const startTime = performance.now()
        const startMemory = process.memoryUsage().heapUsed

        exec(`node ${codeFilePath} < ${inputFilePath}`,
            {
                maxBuffer: MEMORY_LIMIT_MB * 1024 * 1024 , // Set memory limit
                timeout: TIME_LIMIT_MS,
            },
            (error, stdout, stderr) => {
            if(error) {
                if (error.killed) {
                    resolve({result: stderr, verdict: false, executionTime: TIME_LIMIT_MS, memoryUsage: process.memoryUsage().heapUsed - startMemory, status: 'TLE' });
                } else if (stderr.includes('ENOMEM')) {
                    resolve({ result: stderr, verdict: false, executionTime: performance.now() - startTime, memoryUsage: MEMORY_LIMIT_MB*1024*1024, status: 'MLE' });
                } else {
                    resolve({ result: stderr, verdict: false, executionTime: performance.now() - startTime, memoryUsage: process.memoryUsage().heapUsed - startMemory, status: 'RE' });
                }
            }
            if(normalizeString(expectedOutput || "") == normalizeString(stdout || "")) {
                resolve({ result: stdout, verdict: true, executionTime: performance.now() - startTime, memoryUsage: process.memoryUsage().heapUsed - startMemory, status: 'AC' })
            }
            else{
                resolve({ result: stdout, verdict: false, executionTime: performance.now() - startTime, memoryUsage: process.memoryUsage().heapUsed - startMemory, status: 'WA' })
            }
            setTimeout(() => {
                fs.unlink(inputFilePath)
                fs.unlink(codeFilePath)
            }, 10000)
        })
    })

}

export async function runPy(inputFilePath: string, codeFilePath: string, expectedOutput: string) {
    return new Promise((resolve) => {
        const startTime = performance.now()
        const startMemory = process.memoryUsage().heapUsed

        exec(`python3 ${codeFilePath} < ${inputFilePath}`,
            {
                maxBuffer: MEMORY_LIMIT_MB * 1024 * 1024 , // Set memory limit
                timeout: TIME_LIMIT_MS*2,
            },
            (error, stdout, stderr) => {
            if(error) {
                console.log(error)
                if (error.killed) {
                    resolve({result: stderr, verdict: false, executionTime: TIME_LIMIT_MS, memoryUsage: process.memoryUsage().heapUsed - startMemory, status: 'TLE' });
                } else if (stderr.includes('ENOMEM')) {
                    resolve({ result: stderr, verdict: false, executionTime: performance.now() - startTime, memoryUsage: MEMORY_LIMIT_MB*1024*1024, status: 'MLE' });
                } else {
                    resolve({ result: stderr, verdict: false, executionTime: performance.now() - startTime, memoryUsage: process.memoryUsage().heapUsed - startMemory, status: 'RE' });
                }
            }
            if(normalizeString(expectedOutput || "") == normalizeString(stdout || "")) {
                resolve({ result: stdout, verdict: true, executionTime: performance.now() - startTime, memoryUsage: process.memoryUsage().heapUsed - startMemory, status: 'AC' })
            }
            else{
                resolve({ result: stdout, verdict: false, executionTime: performance.now() - startTime, memoryUsage: process.memoryUsage().heapUsed - startMemory, status: 'WA' })
            }
            setTimeout(() => {
                fs.unlink(inputFilePath)
                fs.unlink(codeFilePath)
            }, 10000)
        })
    })

}

export async function runJava(inputFilePath: string, expectedOutput: string, dirTest: string) {
    return new Promise((resolve) => {
        const startTime = performance.now()
        const startMemory = process.memoryUsage().heapUsed

        exec(`java -cp ${dirTest} Hello < ${inputFilePath}`,
            {
                maxBuffer: MEMORY_LIMIT_MB * 1024 * 1024 , // Set memory limit
                timeout: TIME_LIMIT_MS*2,
            },
            (error, stdout, stderr) => {
            if(error) {
                if (error.killed) {
                    resolve({result: stderr, verdict: false, executionTime: TIME_LIMIT_MS, memoryUsage: process.memoryUsage().heapUsed - startMemory, status: 'TLE' });
                } else if (stderr.includes('ENOMEM')) {
                    resolve({ result: stderr, verdict: false, executionTime: performance.now() - startTime, memoryUsage: MEMORY_LIMIT_MB*1024*1024, status: 'MLE' });
                } else {
                    resolve({ result: stderr, verdict: false, executionTime: performance.now() - startTime, memoryUsage: process.memoryUsage().heapUsed - startMemory, status: 'RE' });
                }
            }
            if(normalizeString(expectedOutput || "") == normalizeString(stdout || "")) {
                resolve({ result: stdout, verdict: true, executionTime: performance.now() - startTime, memoryUsage: process.memoryUsage().heapUsed - startMemory, status: 'AC' })
            }
            else{
                resolve({ result: stdout, verdict: false, executionTime: performance.now() - startTime, memoryUsage: process.memoryUsage().heapUsed - startMemory, status: 'WA' })
            }
            setTimeout(() => {
                fs.unlink(inputFilePath)
            }, 10000)
        })
    })

}

