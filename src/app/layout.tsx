import '~/styles/globals.css'
import { RefreshTokenComponent } from '~/components/auth/refresh-token'
import { Toaster } from '~/components/ui/toaster'
import { UserContextProvider } from '~/components/auth/user-context'
import { Nav } from '~/components/nav'
import { cookies } from 'next/headers'
import { USER_TOKEN } from '~/config/constants'
import { authService } from '~/modules/auth/auth.service'
import { ArticlePageLayout } from '~/components/articles/article-page-layout'

export const runtime = 'edge'

export const metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const token = cookies().get(USER_TOKEN)?.value
    const user = token ? await authService.getPayloadFromToken(token) : null

    return (
        <html lang="en">
            <body>
                <UserContextProvider initial={user}>
                    <RefreshTokenComponent />
                    <Nav />
                    <main>
                        <ArticlePageLayout currentUser={user?.username}>
                            {children}
                        </ArticlePageLayout>
                    </main>
                </UserContextProvider>
                <Toaster />
            </body>
        </html>
    )
}
