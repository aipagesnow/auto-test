import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { supabaseAdmin } from "@/lib/supabase"

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

                if (account.refresh_token && token.email) {
                    console.log("Saving refresh token for", token.email);
                    try {
                        const { error } = await supabaseAdmin.from('users').upsert({
                            email: token.email,
                            refresh_token: account.refresh_token,
                            updated_at: new Date().toISOString()
                        }, { onConflict: 'email' })

                        if (error) console.error("Error saving refresh token:", error)
                    } catch (e) {
                        console.error("Failed to save refresh token to DB", e)
                    }
                }
            }
            return token
        },
        async session({ session, token }) {
            // We don't necessarily need to pass sensitive tokens to client session
            // unless we want to use them in client-side components (not recommended for refresh tokens)
            return session
        }
    }
})
