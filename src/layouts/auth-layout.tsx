export type AuthLayoutProps = {
    children: React.ReactNode,
}

export const AuthLayout = ({ children}: AuthLayoutProps) => {
    return (
        <>
            {
                <div className="min-h-screen">
                    {children}
                </div>
            }
        </>
    )
} 