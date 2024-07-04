
export function generateMetadata({ params: { id } }: { params: { id: string } }) {
    return {
        title: `Problem ${id}`
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