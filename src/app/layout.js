// layout.js
export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="bg-background text-foreground font-sans">
                <div className="min-h-screen flex flex-col items-center justify-center">
                    {children}
                </div>
            </body>
        </html>
    );
}
