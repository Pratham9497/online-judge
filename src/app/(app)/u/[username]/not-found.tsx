import Link from 'next/link'
 
export default function NotFound() {

  return (
    <div className='w-full h-[80vh] flex flex-col justify-center items-center text-2xl gap-5'>
      <h2>User Not Found</h2>
      <p>
        <Link href="/"><button className='px-4 py-2 hover:bg-black-200 rounded-lg border-[2px] border-slate-300 text-lg'>👈Back to Home Page</button></Link>
      </p>
    </div>
  )
}