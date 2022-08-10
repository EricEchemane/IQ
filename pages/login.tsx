import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";

export default function Login() {
    const { data: session } = useSession();
    const router = useRouter();
    if (session) {
        router.replace('/');
    }
    return (
        <>
            Not signed in <br />
            <button onClick={() => signIn()}>Sign in</button>
        </>
    );
}