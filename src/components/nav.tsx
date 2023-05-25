"use client"

import Link from "next/link"
import { Button } from "~/components/ui/button"
import { useAuth } from "./auth/user-context"
import { Edit, Home } from "lucide-react"
import UserButton from "./auth/user-button"
import { HEADER_HEIGHT } from "~/config/constants"

export const Nav = () => {
    const { user } = useAuth()
    return (
        <nav
            className="flex w-full items-center justify-end bg-background px-4"
            style={{ height: HEADER_HEIGHT }}
        >
            <Button asChild variant="link">
                <Link href="/" className="flex items-center gap-1">
                    <Home size={16} />
                    Home
                </Link>
            </Button>
            {user && (
                <div className="flex items-center">
                    <Button asChild variant="link">
                        <Link
                            href="/editor"
                            className="flex items-center gap-1"
                        >
                            <Edit size={16} />
                            New Article
                        </Link>
                    </Button>
                    <UserButton />
                </div>
            )}
            {!user && (
                <div>
                    <Button asChild variant="link">
                        <Link href="/login">Sign in</Link>
                    </Button>
                    <Button asChild variant="link">
                        <Link href="/register">Sign up</Link>
                    </Button>
                </div>
            )}
        </nav>
    )
}
