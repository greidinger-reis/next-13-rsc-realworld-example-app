import { NextRequest } from 'next/server'
import { loginInputSchema } from '~/app/login/validation'
import { jsonResponse } from '~/lib/utils'
import { authService } from '~/services/auth'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const credentials = loginInputSchema.parse(body)

        const { email, password } = credentials.user

        const user = await authService.verifyCredentials(email, password)

        const safeUser = {
            email: user.email,
            username: user.username,
            bio: user.bio,
            image: user.image,
        }

        const token = await authService.createToken(safeUser)

        //@ts-ignore
        safeUser.token = token

        return jsonResponse(200, { user: safeUser })
    } catch (error) {
        return jsonResponse(400, {
            errors: { body: [(error as Error).message] },
        })
    }
}
