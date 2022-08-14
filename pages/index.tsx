import Head from 'next/head';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Student from 'components/student';
import Professor from 'components/professor';
import { UserStateProvider } from 'state_providers/student';
import { ProfessorStateProvider } from 'state_providers/professor';
import useHttpAdapter from 'http_adapters/useHttpAdapter';
import UserAdapter, { LoginPayload } from 'http_adapters/user.adapter';

const Home = () => {
  const router = useRouter();
  const { data } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/signin');
    }
  });
  const userLoginAdapter = useHttpAdapter<LoginPayload>(UserAdapter.login);

  useEffect(() => {
    if (data && data.user?.email) {
      userLoginAdapter.execute({ email: data.user.email });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  console.log(userLoginAdapter);


  if (userLoginAdapter.error) {
    router.replace('/register');
  }
  else if (userLoginAdapter.data) {
    if (userLoginAdapter.data.type === 'student')
      return <>
        <Head> <title> Ayq | Student </title> </Head>
        <UserStateProvider>
          <Student data={userLoginAdapter.data} />
        </UserStateProvider>;
      </>;
    else return <>
      <Head> <title> Ayq  | admin </title> </Head>
      <ProfessorStateProvider>
        <Professor data={userLoginAdapter.data} />
      </ProfessorStateProvider>
    </>;
  }
};

export default Home;