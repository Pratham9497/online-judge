import Image from 'next/image'
import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Contact CodeMonks",
    description: "This is the contact page of CodeMonks",
};

const Contact = () => {
    return (
        <div className='px-[5%] pb-[4%] w-full h-full text-xl'>
            <div className='w-full h-full flex flex-col gap-10 justify-center items-center p-[5%] rounded-lg'>
                <h1 className='heading text-purple'>
                    Contact Us
                </h1>
                <div className='flex flex-col gap-10'>
                    <p className='text-justify'>We&apos;d love to hear from you! Whether you have questions, feedback, or suggestions, feel free to get in touch with us. Your input is invaluable in helping us improve and grow our platform.</p>

                    <div className='flex flex-col gap-6'>
                        <h2 className='text-3xl text-blue-400 font-bold text-center'>FAQs</h2>
                        <div>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger><div>1. What is <span className='text-purple font-bold w-fit'>CodeMonks</span>?</div></AccordionTrigger>
                                    <AccordionContent className='text-lg'>
                                        <span className='text-purple font-bold'>CodeMonks</span> is an online platform for coders of all levels to practice and improve their programming skills. We offer a wide range of problems, real-time code execution, detailed editorial explanations, and an interactive community.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>2. How do I submit a solution to a problem?</AccordionTrigger>
                                    <AccordionContent className='text-lg'>
                                        To submit a solution, navigate to the problem page, write your code in the provided editor, and click the &quot;Submit&quot; button. Your code will be evaluated against predefined test cases, and you will receive immediate feedback.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>3. Can I view the solutions of other users?</AccordionTrigger>
                                    <AccordionContent className='text-lg'>
                                        Yes, you can view all submissions submitted by other users by navigating to the user&apos;s profile.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-4">
                                    <AccordionTrigger>4. What programming languages are supported?</AccordionTrigger>
                                    <AccordionContent className='text-lg'>
                                        We support a variety of programming languages including C++, Java, Python, JavaScript.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-5">
                                    <AccordionTrigger>5. How do I change the programming language in the code editor?</AccordionTrigger>
                                    <AccordionContent className='text-lg'>
                                        In the code editor, you can select your preferred programming language from the dropdown menu located at the top of the editor.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                    <div className='flex flex-col gap-6'>
                        <h2 className='text-3xl text-blue-400 font-bold text-center'>Get In Touch</h2>
                        <div>
                            <p className='text-justify'>For general inquiries, support, or feedback, you can reach us at:</p>
                            <ul className='p-5 flex flex-col gap-3'>
                                <li className='text-justify'><span className='font-semibold text-blue-700'>Support:</span> support@codemonks.com</li>
                                <li className='text-justify'><span className='font-semibold text-blue-700'>Feedback:</span> feedback@codemonks.com</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact
