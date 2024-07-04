
export function generateMetadata({ params: { username } }: { params: { username: string } }) {
    return {
        title: username,
        description: `Welcome to ${username} profile`
    }
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