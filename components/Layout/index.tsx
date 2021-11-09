import React, { ReactNode } from "react";

import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/client";
import Link from "next/link";

import { Button, Layout, Menu} from 'antd';

const {Header,Content, Sider, Footer } = Layout;
import get from 'lodash/get';
import styles from './Layout.module.scss';
import Logo from "../Logo";
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
  UploadOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
type Props = {
  children: ReactNode;
};

const AppLayout: React.FC<Props> = (props) => {
  const router = useRouter();
  const [session, loading] = useSession();

  const getMenu = () => {
    const role = get(session, "user.role");
    if(role === 'creator') {
      return  ( 
      <Menu  mode="inline" defaultSelectedKeys={['1']}>
      <Menu.Item key="1" icon={<UserOutlined />}>
        Create Events
      </Menu.Item>
      <Menu.Item key="2" icon={<UserOutlined />}>
        Events
      </Menu.Item>
      <Menu.Item key="3" icon={<VideoCameraOutlined />}>
        Subscription
      </Menu.Item>
      <Menu.Item key="4" icon={<UserOutlined />} className={styles.logoutItem}>
         Profile
        </Menu.Item>
    </Menu>) 
    } else {
      return (
        <Menu  mode="inline" defaultSelectedKeys={['1']}>
        <Menu.Item key="1" icon={<UserOutlined />}>
          Ongoing Events
        </Menu.Item>
        <Menu.Item key="4" icon={<UserOutlined />} className={styles.logoutItem}>
         Profile
        </Menu.Item>
      </Menu>)
    }
  }
  if(!session && !loading) { 
    router.push('/');
  }
  const handleSignOut = async () => { 
    await signOut();
    router.push('/');
  }
  return (
  <Layout className={styles.layoutContainer}>
    <Header className={styles.header}>
        <Link href='/'>
      <div className={styles.logoContainer}>
        <div className={styles.title}>CampFire</div>
      </div>
     </Link>
      <div className={styles.right}>
        <Button type='text' className={styles.logoutBtn} onClick={() => handleSignOut()}>
          Log out
        </Button>
      </div>
      </Header>
    <Layout>
    <Sider className={styles.layoutSider}>
      {getMenu()}
    </Sider>
    <Content className={styles.layoutContent}>
      {props.children}
      <Footer></Footer>
    </Content>
    </Layout>
  </Layout>
  )
};

export default AppLayout;


