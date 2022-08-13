import Head from 'next/head';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useFetch from 'hooks/useFetch';
import Student from 'components/student';
import Professor from 'components/professor';
import { UserStateProvider } from 'state_providers/student';
import { ProfessorStateProvider } from 'state_providers/professor';

const Home = () => {
  const router = useRouter();
  const { data } = useSession({
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
    if (login.data.data.type === 'student')
      return <>
        <Head> <title> Ayq | Student </title> </Head>
        <UserStateProvider>
          <Student data={login.data.data} />
        </UserStateProvider>;
      </>;
    else return <>
      <Head> <title> Ayq  | admin </title> </Head>
      <ProfessorStateProvider>
        <Professor data={login.data.data} />
      </ProfessorStateProvider>
    </>;
  }
};

export default Home;