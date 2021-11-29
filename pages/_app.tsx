import React, { useEffect } from 'react'
import { Provider, useSession } from "next-auth/client";
import { AppProps } from "next/app";

import AppStateProvider from "../context/AppStateProvider";
import FullScreenLoading from '../components/FullScreenLoading';
import Router from "next/router";
import get from 'lodash/get';
import { signOut } from 'next-auth/client';

import 'antd/dist/antd.css';
import './app.scss';
import { SWRConfig } from 'swr';

const App = ({ Component, pageProps }: AppProps) => {
  const auth = get(Component,'defaultProps.auth', {
    isPublic: false,
  });
  return (
    <Provider session={pageProps.session}>
    <SWRConfig value={{
      fetcher: (url, config) => fetch(url, config).then(res => res.json())
    }}>
      <AppStateProvider>
      {get(auth, 'isPublic') ?
        <Component {...pageProps} /> 
      :(
        <Auth auth={auth}>
          <Component {...pageProps} />
        </Auth>
      )}
      </AppStateProvider>
      </SWRConfig>
    </Provider>
  );
};

export default App;


function Auth({ children , auth}) {
  const [session, loading] = useSession();
  const isUser = !!session?.user
  const role = get(session, 'user.role');
  const allowedRoles = get(auth, 'role',[]);
  useEffect(() => {
    if (loading) return 
    if (!isUser) {
      Router.push('/');
    } 
  }, [isUser, loading])
  if (isUser ) {
    if(allowedRoles.includes(role)) {
      return children
    } 
    else {
      console.log('access denied');
      // signOut().then(() => {
      // }).catch(err => { 
      //   console.log(err);
      // }).finally(() => {
      //   Router.push('/');
      // });
      return Router.push('/404');
    }
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <FullScreenLoading/>
}