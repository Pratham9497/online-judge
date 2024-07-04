import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Problems List",
    description: "List of all problems user can solve"
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {children}
        </>
    );
}