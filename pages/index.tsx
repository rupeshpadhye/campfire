import React from "react"
import { getSession, signOut, useSession } from "next-auth/client";
import LandingPage from '../components/LandingPage';
import get from 'lodash/get';
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  
  if(session && session.user) {
    const role = get(session, 'user.role');
  if(role === 'member') {
    return {
      redirect: {
        destination: '/home',
        permanent: false,
      },
    }
  } else if(role === 'creator') {
    return {
      redirect: {
        destination: '/events',
        permanent: true,
      },
    }
    } 
  }

  return {
    props: {},
  }
}

const IndexPage: React.FC<{}> = (Props) => {
  return <LandingPage/>
}

export default IndexPage
