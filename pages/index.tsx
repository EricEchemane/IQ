import type { NextPage } from 'next';
import Head from 'next/head';
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Home: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.replace('/login');
    }
  }, [router, session]);

  console.log(session);


  return (
    <>
      <Head> <title>IQ</title> </Head>
      <h1> {session?.user?.email} </h1>
      <button onClick={() => signOut()}> Sign out </button>
    </>
  );
};

export default Home;
