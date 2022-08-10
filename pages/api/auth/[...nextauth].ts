import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
    ],
    // session: {
    //     maxAge: 1000 * 60 * 60 * 24,
    // },
    callbacks: {
        session({ session, token, user }) {
            return session;
        },
    },
}); 