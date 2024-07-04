import React from 'react'
import { TypewriterEffectSmooth } from './ui/TypewriterEffect';

const Hero = () => {
    const words = [
        {
          text: "Welcome",
          className: "text-[green]",
        },
        {
          text: "To",
          className: "text-white",
        },
        {
          text: "Codemonks.",
          className: "text-[orange]",
        },
      ];
  return (
    <div className='p-5 w-full flex items-center justify-center'>

    <div className='flex flex-col items-center justify-center lg:h-[40rem] md:h-[35rem] sm:h-[30rem] h-[25rem] relative w-full'>
        <img
            src={`/code.jpg`}
            alt='hero image'
            title='Welcome To Codemonks: An Online Judge Web App'
            className="image absolute h-full w-full object-cover object-center rounded-xl blur-[2px]"
            />
        <TypewriterEffectSmooth words={words} className='absolute' />
    </div>
    </div>
  )
}

export default Hero
