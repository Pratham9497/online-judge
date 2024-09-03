import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  item,
  href
}: {
  item: string;
  href: string;
}) => {
  return (
    <div className="relative ">
      <motion.p
        transition={{ duration: 0.3 }}
        className="text-black dark:text-white"
      >
        <Link href={href} className="cursor-pointer hover:opacity-[0.8] lg:text-lg md:text-base text-sm">{item}</Link>
      </motion.p>
    </div>
  );
};

export const Menu = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <nav
      className="relative h-[9vh] w-full bg-[#1b1919] shadow-input flex justify-between space-x-4 md:px-6 md:py-3 px-4 py-2 items-center"
    >
      <div className="text-purple xl:text-2xl lg:text-xl md:text-lg text-base drop-shadow-lg max-w-1/4 font-bold">
        <Link href="/">CODEMONKS</Link>
      </div>
      <div className="flex flex-wrap justify-end xl:gap-6 md:gap-3 gap-2 items-center w-3/4 font-semibold">
        {children}
      </div>
      
    </nav>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  return (
    <Link href={href} className="flex space-x-2">
      <Image
        src={src}
        width={140}
        height={70}
        alt={title}
        className="flex-shrink-0 rounded-md shadow-2xl"
      />
      <div>
        <h4 className="text-xl font-bold mb-1 text-black dark:text-white">
          {title}
        </h4>
        <p className="text-neutral-700 text-sm max-w-[10rem] dark:text-neutral-300">
          {description}
        </p>
      </div>
    </Link>
  );
};

export const HoveredLink = ({ children, ...rest }: any) => {
  return (
    <Link
      {...rest}
      className="text-neutral-700 dark:text-neutral-200 hover:text-black "
    >
      {children}
    </Link>
  );
};
