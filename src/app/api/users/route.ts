import { NextRequest } from "next/server"
import { z } from "zod"
import { jsonResponse } from "~/lib/utils"
import { authService } from "~/services/auth"

// runtime edge on dev environment crashes because of bcrypt
export const runtime = "edge"

const registrationBodySchema = z
    .object({
        user: z.object({
            email: z.string().email(),
            password: z.string(),
            username: z.string(),
        }),
    })
    .strict()

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const registration = registrationBodySchema.parse(body)

        const { email, password, username } = registration.user

        const user = await authService.registerUser(email, password, username)

        const safeUser = {
            email: user.email,
            username: user.username,
            bio: user.bio,
            image: user.image,
        }

        const token = await authService.createToken(safeUser)

        //@ts-ignore
        safeUser.token = token

        return jsonResponse(200, {
            user: safeUser,
        })
    } catch (error) {
        return jsonResponse(400, { message: (error as Error).message })
    }
}
