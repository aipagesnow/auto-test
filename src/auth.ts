import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            authorization: {
                params: {
                    scope: "openid email profile https://www.googleapis.com/auth/gmail.modify",
                    access_type: "offline",
                    prompt: "consent",
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            // Upon first login, account is available
            if (account) {
                token.accessToken = account.access_token
                token.refreshToken = account.refresh_token
                // TODO: Save refresh token to Supabase users table
                console.log("Got refresh token:", account.refresh_token ? "YES" : "NO")
            }
            return token
        },
        async session({ session, token }) {
            return session
        }
    }
})
