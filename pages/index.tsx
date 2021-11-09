import React from "react"
import { GetStaticProps } from "next"
import { useRouter } from "next/router";
import { getSession, signOut, useSession } from "next-auth/client";
import Router from 'next/router';
import Link from "next/link";
import { Card, Spin } from "antd";
import FullScreenLoading from "../components/FullScreenLoading";
import LandingPage from '../components/LandingPage';
import get from 'lodash/get';
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  const role = get(session, 'user.role');
  if(role === 'participant') {
    return {
      redirect: {
        destination: '/home',
        permanent: false,
      },
    }
  } else if(role === 'creator') {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
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
