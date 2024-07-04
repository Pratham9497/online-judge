import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Submissions",
    description: "List of all user submissions"
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