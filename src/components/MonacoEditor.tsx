import React, { useEffect } from 'react'
import { Editor, Monaco } from '@monaco-editor/react'

type Props = {
    value: string;
    onChange: (newValue: string | undefined) => void;
    language: string
    onMount: (editor: any, monaco: Monaco) => void
    fontSize: number
}

const MonacoEditor = ({ value, onChange, language, onMount, fontSize }: Props) => {

    return (
        <Editor
            language={language}
            value={value}
            onChange={onChange}
            options={{
                fontSize: fontSize,
            }}
            onMount={onMount}
            theme='vs-dark'
            className='overflow-y-auto scroll-auto'

        />
    )
}

export default MonacoEditor
