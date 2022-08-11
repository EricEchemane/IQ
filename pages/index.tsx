import Head from 'next/head';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useFetch from 'lib/hooks/useFetch';

const Home = () => {
  const router = useRouter();
  const { status, data } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/signin');
    }
  });
  const login = useFetch('/api/user/login');

  useEffect(() => {
    if (data) {
      login.doFetch({
        method: "POST",
        body: JSON.stringify({ email: data.user?.email })
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (login.error) {
    router.replace('/register');
  }
  else {
    return <>
      <h1> {data?.user?.name} </h1>
    </>;
  }
};

export default Home;