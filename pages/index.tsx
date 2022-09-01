import Head from 'next/head';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Student from 'components/student';
import Professor from 'components/professor';
import { UserStateProvider } from 'state_providers/student';
import { ProfessorStateProvider } from 'state_providers/professor';
import useHttpAdapter from 'http_adapters/useHttpAdapter';
import UserAdapter, { LoginPayload } from 'http_adapters/adapters/user.adapter';
// all code above is just imports from other folders

// this is the Home page
const Home = () => {
  const router = useRouter(); // uses the router for URL navigation
  const { data } = useSession({ // requires user session
    required: true,
    onUnauthenticated() { // if there is no user session, redirect to /signin page
      router.replace('/signin'); // go to /signin route
    }
  });
  // uses the login adapter module
  const userLoginAdapter = useHttpAdapter<LoginPayload>(UserAdapter.login);

  useEffect(() => { // run this function after the initial page load
    if (data && data.user?.email && !userLoginAdapter.data) {
      // userLoginAdapter.execute executes the login given the email from the data session
      userLoginAdapter.execute({ email: data.user.email });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // is may error sa login request, got the /register
  if (userLoginAdapter.error) {
    router.replace('/register');
  }
  // pag successful may data na kaya irerender na yung pages depende sa type ng user
  else if (userLoginAdapter.data) {
    // if yung user is student render yun Student component, else render yung Professor
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

export default Home; // export the home component so it can be imported in _app.tsx