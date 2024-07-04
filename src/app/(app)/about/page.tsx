import { Metadata } from 'next';
import Image from 'next/image'
import React from 'react'

// export async function generateMetadata({ params: { postId } }: Props) {

//     const posts = getSortedPostsData()

//     const post:BlogPost | undefined = posts.find(post => post.id===postId)

//     if(!post){
//         return {
//             title: 'Post Not Found'
//         }
//     }

//     return {
//         title: post.title
//     }

// }

export const metadata: Metadata = {
    title: "About CodeMonks",
    description: "This is the about page of CodeMonks",
};

const About = () => {
    return (
        <div className='px-[5%] pb-[4%] w-full h-full text-xl'>
            <div className='bg-black-200 w-full h-full flex flex-col gap-10 justify-center items-center p-[5%] rounded-lg'>
                <h1 className='heading text-purple'>
                    About Us
                </h1>
                <div className='flex flex-col gap-10'>
                    <p className='text-justify'>Welcome to <span className='text-purple font-bold'>CodeMonks</span>, your ultimate destination for honing your programming skills and preparing for competitive programming contests. Our mission is to provide a comprehensive and interactive platform for coders of all levels to practice, learn, and excel in their coding journey.</p>
                    <div className='flex flex-col gap-6'>
                        <h2 className='text-3xl text-blue-400 font-bold text-center'>Our Mission</h2>
                        <div>
                            <p className='text-justify'>At <span className='text-purple font-bold'>CodeMonks</span>, we believe that programming is an essential skill in today&apos;s technology-driven world. Our mission is to:</p>
                            <ul className='p-5 flex flex-col gap-3'>
                                <li className='text-justify'><span className='font-semibold text-blue-700'>1. Empower Coders:</span> Provide a diverse range of programming problems that challenge and inspire coders to improve their skills.</li>
                                <li className='text-justify'><span className='font-semibold text-blue-700'>2. Foster Learning:</span> Offer detailed editorial explanations and discussions to help users understand different approaches to solving problems.</li>
                                <li className='text-justify'><span className='font-semibold text-blue-700'>3. Build Community:</span> Create a supportive and engaging community where programmers can share knowledge, collaborate, and grow together.</li>
                            </ul>
                        </div>
                    </div>

                    <div className='flex flex-col gap-6'>
                        <h2 className='text-3xl text-blue-400 font-bold text-center'>What We Offer</h2>
                        <div>
                            <ul className='p-5 flex flex-col gap-3'>
                                <li className='text-justify'><span className='font-semibold text-blue-700'>1. Extensive Problem Set:</span> Our platform features a vast collection of problems across various difficulty levels and domains, including algorithms, data structures, mathematics, and more.</li>
                                <li className='text-justify'><span className='font-semibold text-blue-700 text-justify'>2. Real-Time Code Execution:</span> Write, compile, and run your code directly in our built-in Monaco Editor with support for multiple programming languages.</li>
                                <li className='text-justify'><span className='font-semibold text-blue-700 text-justify'>3. Detailed Editorials:</span> Access comprehensive solutions and explanations for each problem, helping you to learn different techniques and approaches.</li>
                                <li className='text-justify'><span className='font-semibold text-blue-700 text-justify'>3. Test Cases:</span> Evaluate your solutions against a variety of test cases to ensure correctness and efficiency.</li>
                            </ul>
                        </div>
                    </div>
                    <div className='flex flex-col gap-6'>
                        <h2 className='text-3xl text-blue-400 font-bold text-center'>Our Story</h2>
                        <p className='text-justify'>
                            <span className='text-purple font-bold'>CodeMonks</span> was founded by a group of passionate programmers who wanted to create a platform that not only provides challenging problems but also fosters a deep understanding of coding concepts. Our team is dedicated to continuously improving the platform and adding new features to enhance the user experience.
                        </p>
                    </div>
                    <div className='flex flex-col gap-6'>
                        <h2 className='text-3xl text-blue-400 font-bold text-center'>Join Us</h2>
                        <p className='text-justify'>
                            Whether you are a beginner looking to learn the basics or an experienced programmer preparing for coding competitions, <span className='text-purple font-bold'>CodeMonks</span> has something for you. Sign up today and start your coding journey with us!
                        </p>
                    </div>
                    <div className='flex flex-col gap-12'>
                        <h2 className='text-3xl text-blue-400 font-bold text-center'>Founders</h2>
                        <div className='w-full flex justify-evenly items-center'>
                            <div className='flex flex-col justify-center items-center gap-2'>
                                <Image
                                    src="/my_img.jpg"
                                    width={150}
                                    height={150}
                                    alt='CEO'
                                    className='rounded-full'
                                />
                                <div className='flex flex-col justify-center items-center'>
                                    <p className='italic text-2xl'>Pratham Shalya</p>
                                    <p className='text-purple font-bold'>CEO</p>
                                </div>
                            </div>

                            <div className='flex flex-col justify-center items-center gap-2'>
                                <Image
                                    src="/Papa.jpg"
                                    width={150}
                                    height={150}
                                    alt='CEO'
                                    className='rounded-full'
                                />
                                <div className='flex flex-col justify-center items-center'>
                                    <p className='text-2xl italic'>Vikas Shalya</p>
                                    <p className='text-purple font-bold'>CMO</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default About
