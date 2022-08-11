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
      }).then();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (login.error) {
    router.replace('/register');
  }
  else if (login.data) {
    return <>
      <h1> {JSON.stringify(login.data, null, 4)} </h1>
    </>;
  }
};

export default Home;