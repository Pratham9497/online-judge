import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up Page",
    description: "User can sign up to CodeMonks"
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