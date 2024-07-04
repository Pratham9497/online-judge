import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Verify Email",
    description: "User must verify email to register"
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