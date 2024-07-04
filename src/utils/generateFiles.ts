import path from "path";
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

const dirTests = path.resolve(__dirname, '../../../../../tmp/tests')
// console.log(dirTests)
if (!fs.existsSync(dirTests)) {
    fs.mkdirSync(dirTests, { recursive: true })
}
export function generateFiles(ext: string, code: string) {
    const dirTest = path.join(dirTests, uuidv4())
    fs.mkdirSync(dirTest, { recursive: true })
    const codeFileName = `Hello.${ext}`
    const outputFileName = "output"
    const codeFilePath = path.join(dirTest, codeFileName)
    const outputFilePath = path.join(dirTest, outputFileName)
    // console.log("here it is")
    fs.writeFileSync(codeFilePath, code)
    return { codeFilePath, outputFilePath, dirTest }
}


export function generateInput(input: string, dirTest: string) {
    const inputFileName = `${Date.now()}.txt`
    const inputFilePath = path.join(dirTest, inputFileName)
    fs.writeFileSync(inputFilePath, input)
    return { inputFilePath }
}



// export async function removeFiles(dirTest: string) {
//     try {
//         const files = 
//         await Promise.all(files.map(file => fs.unlink(path.join(TMP_DIR, file))));
//     } catch (e) {
//         console.error('Failed to clean tmp directory', e);
//     }
//     // fs.rm(dirTest, {recursive: true, force: true})
// }