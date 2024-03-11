import { redirect } from 'next/navigation'

import { getSession, login, logout } from '@/lib/auth'

function Login() {
    return (
        <form
            action={async formData => {
                'use server'
                await login(formData)
                redirect('/')
            }}>
            <input type="email" name="email" placeholder="Email" />
            <button type="submit">Login</button>
        </form>
    )
}

function Logout() {
    return (
        <form
            action={async () => {
                'use server'
                await logout()
                redirect('/')
            }}>
            <button type="submit">Logout</button>
        </form>
    )
}

export default async function Home() {
    const session = await getSession()
    return (
        <>
            {!session ? <Login /> : <Logout />}
            <pre>{JSON.stringify(session, null, 2)}</pre>
        </>
    )
}
