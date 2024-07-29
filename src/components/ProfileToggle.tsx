import { signOut } from 'next-auth/react';
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';

const ProfileToggle = ({username}: {username: string | undefined}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative flex items-center justify-center w-10 h-10" ref={dropdownRef}>
            <span className={`w-10 h-10 flex items-center justify-center rounded-full border-[2px] cursor-pointer inset-x-0 ${isOpen ? " border-blue-500 text-purple" : "border-slate-300"}`} onClick={toggleDropdown}>
                <span className='text-lg'>
                    {username ? username[0].toUpperCase() : ""}
                </span>
            </span>
            <ul className={`absolute top-10 min-w-32 bg-black-200 -right-[50%] mt-2 border border-gray-200 rounded-md shadow-lg z-10 ${isOpen ? 'animate-slide-down' : 'animate-slide-up'}`}>
                <li className='px-4 py-2 flex flex-col'>
                    <div className=' italic'>Hey</div>
                    <div className='text-purple'>{username}</div>
                </li>
                <div className="border-t border-gray-200 my-1"></div>
                <li className="px-4 py-2 hover:text-white-200 cursor-pointer">
                    <Link href={`/u/${username}`}>My Profile</Link>
                </li>
                <li className="px-4 py-2 hover:text-white-200 cursor-pointer">
                    <button onClick={() => {signOut()}}>Logout</button>
                </li>
            </ul>
        </div>
    );
};

export default ProfileToggle;