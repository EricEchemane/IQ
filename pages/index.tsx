import type { NextPage } from 'next';
import Head from 'next/head';
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    router.replace('/login');
  }

  console.log(session);


  return (
    <>
      <Head> <title>IQ</title> </Head>
      <h1> {session?.user?.email} </h1>
    </>
  );
};

export default Home;
