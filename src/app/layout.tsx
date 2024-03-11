export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <head>
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/sakura.css/css/sakura.css"
                    type="text/css"
                />
            </head>
            <body>{children}</body>
        </html>
    )
}
