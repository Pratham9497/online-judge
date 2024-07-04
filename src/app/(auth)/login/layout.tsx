import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login Page",
    description: "User can login to CodeMonks"
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