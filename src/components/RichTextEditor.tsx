import { BubbleMenu, useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
// import Heading from '@tiptap/extension-heading';
import OrderedList from '@tiptap/extension-ordered-list';
import BulletList from '@tiptap/extension-bullet-list';
import { common, createLowlight } from 'lowlight';
import 'highlight.js/styles/github.css';
import React, { useEffect } from 'react';

import { Highlight } from '@tiptap/extension-highlight';
// import { OrderedList, BulletList } from '@tiptap/extension-list';
import { TextAlign } from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { Underline } from '@tiptap/extension-underline';
import { Heading } from '@tiptap/extension-heading';
// import { LineNumbers } from '@tiptap/extension-line-numbers';
import { useState } from 'react';
import { Fa1, Fa2, Fa3, FaBold, FaCode, FaHeading, FaItalic, FaLaptopCode, FaListOl, FaListUl, FaStrikethrough, FaUnderline } from 'react-icons/fa6';

import 'highlight.js/styles/github-dark.css'; // You can choose a style that matches your theme

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';

// Import the languages you want to support
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import cpp from 'highlight.js/lib/languages/cpp';


type Props = {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

const RichTextEditor = ({ value, onChange, disabled }: Props) => {

    const lowlight = createLowlight(common)

    lowlight.register('javascript', javascript);
    lowlight.register('python', python);
    lowlight.register('cpp', cpp);

    const editor = useEditor({
        editorProps: {
            attributes: {
                class: 'text-sm mx-auto focus:outline-none p-6 min-h-48',
            }
        },
        extensions: [
            StarterKit,
            CodeBlockLowlight.configure({ lowlight }),
            Highlight,
            OrderedList,
            BulletList,
            TextAlign.configure({ types: ['heading'] }),
            Color,
            Underline,
            Heading.configure({ levels: [1, 2, 3] }),
            //   LineNumbers,
        ],
        content: "<p></p>",
        editable: !disabled,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        injectCSS: false,
    });
    // const editor = useEditor({
    //     extensions: [
    //         StarterKit,
    //         CodeBlockLowlight.configure({ lowlight }),
    //         Bold,
    //         Italic,
    //         Code,
    //         Heading.configure({
    //             levels: [1, 2, 3], // Limit to certain heading levels
    //         }),
    //         ListItem,
    //         OrderedList,
    //         BulletList,
    //     ],
    //     content: value || "\n\n\n\n\n",
    //     editable: !disabled,
    //     onUpdate: ({ editor }) => {
    //         onChange(editor.getHTML());
    //     },

    // });

    const [lineNumbers, setLineNumbers] = useState('1');
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
        setLineNumbers(getLineNumbers())
        console.log(lineNumbers)
    }, [value, editor]);


    const getLineNumbers = () => {
        console.log(value);
        const val1 = value || '<p></p>';
        const lines = val1.split(/<\/p>/i).length - 1;
        console.log(lines)
        return Array.from({ length: lines }, (_, i) => i + 1).join('\n');
    };

    const languages = [
        { label: 'JavaScript', value: 'javascript' },
        { label: 'Python', value: 'python' },
        { label: 'C++', value: 'cpp' },
        // Add other languages as needed
    ]

    // const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //     const language = event.target.value
    //     editor?.chain().focus().setCodeBlockLowlight(language).run()
    // }

    return (
        // <div className='relative flex'>

        <div className='w-full h-full flex flex-col gap-2'>
            {editor && (
                <div className="toolbar flex gap-1 flex-wrap">
                    <button title='bold' type='button' onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}><FaBold /></button>
                    <button title='italic' type='button' onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}><FaItalic /></button>
                    <button title='underline' type='button' onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'is-active' : ''}><FaUnderline /></button>
                    <button
                        type='button'
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={editor.isActive('strike') ? 'is-active' : ''}
                        title='strike'
                    ><FaStrikethrough /></button>
                    <button title='code-inline' type='button' onClick={() => editor.chain().focus().toggleCode().run()} className={editor.isActive('code') ? 'is-active' : ''}><FaCode /></button>
                    <button title='code-block' type='button' onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editor.isActive('codeBlock') ? 'is-active' : ''}><FaLaptopCode /></button>
                    <button title='head1' type='button' onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}><FaHeading className=' inline' /><Fa1 className='inline' /></button>
                    <button title='head2' type='button' onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}><FaHeading className=' inline' /><Fa2 className='inline' /></button>
                    <button title='head3' type='button' onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}><FaHeading className=' inline' /><Fa3 className='inline' /></button>
                    <button title='ordered-list' type='button' onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''}><FaListOl /></button>
                    <button title='unordered-list' type='button' onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}><FaListUl /></button>
                </div>
            )}
            <div className='relative w-full h-full'>
                {/* <pre className="absolute -left-6 top-0 px-2 text-right text-gray-600">{lineNumbers}</pre> */}
                {editor && <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                    <div className="bubble-menu">
                        <button
                            type='button'
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={editor.isActive('bold') ? 'is-active' : ''}
                            title='bold'
                        >
                            <FaBold />
                        </button>
                        <button
                            type='button'
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={editor.isActive('italic') ? 'is-active' : ''}
                            title='italic'
                        >
                            <FaItalic />
                        </button>
                        <button
                            type='button'
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            className={editor.isActive('underline') ? 'is-active' : ''}
                            title='underline'
                        >
                            <FaUnderline />
                        </button>
                        <button
                            type='button'
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            className={editor.isActive('strike') ? 'is-active' : ''}
                            title='strike'
                        >
                            <FaStrikethrough />
                        </button>
                        <button
                            title='code-inline'
                            type='button'
                            onClick={() => editor.chain().focus().toggleCode().run()}
                            className={editor.isActive('code') ? 'is-active' : ''}
                        >
                            <FaCode />
                        </button>
                    </div>
                </BubbleMenu>}
                <EditorContent spellCheck={false} editor={editor} className="w-full rounded-md disabled:opacity-50 dark:border-[#2d2d2d] border-[3px] dark:bg-[#1b1a1a] dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300" />
            </div>
        </div>
        // </div>
    );
};

export default RichTextEditor;
