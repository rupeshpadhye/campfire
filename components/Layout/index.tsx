import React, { ReactNode } from "react";

import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/client";
import Link from "next/link";

import { Button, Layout, Menu} from 'antd';

const {Header,Content } = Layout;

import styles from './Layout.module.scss';
import Logo from "../Logo";

type Props = {
  children: ReactNode;
};

const AppLayout: React.FC<Props> = (props) => {
  const router = useRouter();

  const [session, loading] = useSession();
  if(!session && !loading) { 
    router.push('/');
  }
  const handleSignOut = async () => { 
    await signOut();
    router.push('/');
  }
  return (
  <Layout>
     <Header className={styles.header} style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
      <Link href='/events'>
      <div className={styles.logoContainer}>
        <Logo/>
        <div className={styles.title}>CampFire</div>
      </div>
     </Link> 
      <Button type='text' className={styles.logoutBtn} onClick={() => handleSignOut()}>
          Log out
      </Button>
    </Header>
    <Content className={styles.siteLayout} style={{ padding: '0 50px', marginTop: 64 }}>
      {props.children}
    </Content>
  </Layout>
  )
};

export default AppLayout;


