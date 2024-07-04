import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Page",
    description: "This page allows admin to add problems to problems list"
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