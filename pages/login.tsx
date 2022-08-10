import { useSession, signIn, signOut } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Login() {
    const { data: session } = useSession();
    const router = useRouter();
    if (session) {
        router.replace('/');
    }
    return (
        <>
            <Head>
                <title> Login - DfCAM IQ </title>
            </Head>
            Not signed in <br />
            <button onClick={() => signIn()}>Sign in</button>
        </>
    );
}