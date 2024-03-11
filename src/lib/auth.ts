import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'UNSAFE_SECRET'
const secret = new TextEncoder().encode(JWT_SECRET_KEY)

const hehe = new Date(Date.now() + 10 * 1000)

export async function signToken(payload: any) {
    const token = new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('10 seconds')
        .sign(secret)

    return token
}

export async function verifyToken(token: string): Promise<any> {
    const { payload } = await jwtVerify(token, secret, {
        algorithms: ['HS256'],
    })
    return payload
}

export async function login(formData: FormData) {
    // TODO: verify credentials
    const user = {
        email: formData.get('email'),
        name: 'User',
    }
    const expires = new Date(Date.now() + 10 * 1000) // 10 seconds
    const session = await signToken({ user, expires })

    cookies().set('session', session, {
        expires,
        httpOnly: true,
        sameSite: 'strict',
    })
}

export async function logout() {
    cookies().set('session', '', { expires: new Date(0) })
}

export async function getSession() {
    const session = cookies().get('session')?.value
    if (!session) return null

    const tokenPayload = await verifyToken(session)
    return tokenPayload
}

export async function refreshSession(request: NextRequest) {
    const session = request.cookies.get('session')?.value
    if (!session) return

    const tokenPayload = await verifyToken(session)
    tokenPayload.expires = new Date(Date.now() + 10 * 1000) // 10 seconds

    const refreshedToken = await signToken(tokenPayload)

    const res = NextResponse.next()
    res.cookies.set({
        name: 'session',
        value: refreshedToken,
        httpOnly: true,
        sameSite: 'strict',
        expires: tokenPayload.expires,
    })

    return res
}
