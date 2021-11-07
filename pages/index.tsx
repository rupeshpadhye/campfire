import React from "react"
import { GetStaticProps } from "next"
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/client";
import Router from 'next/router';
import Link from "next/link";
import { Card, Spin } from "antd";
import FullScreenLoading from "../components/FullScreenLoading";
import LandingPage from '../components/LandingPage';


const IndexPage: React.FC<Props> = (Props) => {
  const router = useRouter();
   const [session, loading] = useSession();
  if(loading) {
    return  <FullScreenLoading/>;
  }
  if(!session) {
    return <LandingPage/>
  } else {
    router.push('/events')
  }
}

export default IndexPage
