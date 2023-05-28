import { getServerSession } from "next-auth"
import { Source_Serif_Pro } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArticleActionsButton } from "~/components/articles/article-actions-button"
import { ArticleBody } from "~/components/articles/article-body"
import { DEFAULT_USER_IMAGE, HEADER_HEIGHT } from "~/config/constants"
import { articlesService } from "~/modules/articles/articles.service"
import { authOptions } from "~/modules/auth/auth.options"
import { usersService } from "~/modules/users/users.service"
import { Button } from "~/components/ui/button"
import { format } from "date-fns"

const sourceSerifPro = Source_Serif_Pro({
    weight: ["400", "600", "700"],
    subsets: ["latin"],
    fallback: ["serif"],
})

export default async function ArticlePage({
    params,
}: {
    params: { slug: string }
}) {
    const session = await getServerSession(authOptions)

    const article = await articlesService.getBySlug(
        params.slug,
        session?.user?.id,
    )

    if (!article) return notFound()

    const authorProfile = await usersService.getUserProfile(
        article.author.username,
        session?.user?.id,
    )

    if (!authorProfile) return notFound()

    return (
        <div style={{ height: `calc(100vh - ${HEADER_HEIGHT})` }}>
            <div className="flex h-1/4 w-full justify-center bg-neutral-800/95 text-white">
                <div className="flex h-full w-full max-w-5xl flex-col justify-center gap-8">
                    <h1 className="text-5xl font-semibold">{article.title}</h1>
                    <div>
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-2">
                                <Image
                                    src={
                                        article.author.image ??
                                        DEFAULT_USER_IMAGE
                                    }
                                    alt={article.author.username}
                                    width={32}
                                    height={32}
                                    className="rounded-full"
                                />
                                <div className="flex flex-col">
                                    <Button
                                        asChild
                                        variant={"link"}
                                        className="h-fit w-fit p-0 text-white"
                                    >
                                        <Link
                                            href={`/profile/${article.author.username}`}
                                        >
                                            {article.author.username}
                                        </Link>
                                    </Button>
                                    <span className="text-xs text-neutral-400">
                                        {format(
                                            article.createdAt,
                                            "MMM dd, yyyy",
                                        )}
                                    </span>
                                </div>
                            </div>
                            <ArticleActionsButton
                                isAuthor={
                                    authorProfile.id === session?.user?.id
                                }
                                article={{
                                    favorited: article.favorited,
                                    favoritesCount: article.favoritesCount,
                                    slug: article.slug,
                                    author: authorProfile,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto max-w-5xl divide-y">
                <ArticleBody
                    body={article.body}
                    className={sourceSerifPro.className}
                />
                <div className="pt-8">TODO: CommentSection</div>
            </div>
        </div>
    )
}
