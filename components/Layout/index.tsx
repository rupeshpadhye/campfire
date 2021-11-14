import React, { ReactNode, useState, useEffect } from "react";

import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/client";
import Link from "next/link";

import { Button, Layout, Menu} from 'antd';

const {Header,Content, Sider, Footer } = Layout;
import get from 'lodash/get';
import flatten from 'lodash/flatten';
import styles from './Layout.module.scss';
import Logo from "../Logo";
import {
  BarChartOutlined,
  UserOutlined,
  VideoCameraOutlined,
  BankOutlined,
  SettingOutlined
} from '@ant-design/icons';
type Props = {
  children: ReactNode;
};

const creatorMenu = [
  { id: '1',
    title: 'Team Activities',
    icon: <VideoCameraOutlined />,
    link: '/events',
    subMenu: []
  },
  {
    id: '2',
    title: 'Setting',
    icon: <SettingOutlined />,
    link: '/settings', 
    subMenu: [
      {
      id: '2.1',
      title: 'Members',
      link: '/settings/members',
    },
    {
      id: '2.2',
      title: 'Subscription',
      link: '/settings/subscription',
    }]
  },
  { id: '3',
    title: 'Profile',
    icon: <UserOutlined />,
    link: '/profile',
    subMenu: []
  },

]


const AppLayout: React.FC<Props> = (props) => {
  const router = useRouter();
  const [session, loading] = useSession();
  const [ key, setKey ] = useState('1');
  const handleMenuClick = ({item, key}) => {
    setKey(key);
    const menu = creatorMenu.find(item => item.id === key);
    router.push(menu.link);
  }

  useEffect(() => {
    console.log(router.pathname);
    const menuItems = flatten(creatorMenu);
    const menu = menuItems.find(item => router.pathname.includes(item.link));
    if(menu) {
      setKey(menu.id);
    }
  }, [router.pathname])

  const getSider = () => {
    const role = get(session, "user.role");
    if(role === 'creator') {
      return  ( 
      <Sider className={styles.layoutSider}>
          <Menu  mode="inline" selectedKeys={[key]} onClick={handleMenuClick}>
            {creatorMenu.map(item => (
              <Menu.Item key={item.id} icon={item.icon}>
                {item.title}
                </Menu.Item>
            ))}
        </Menu>
    </Sider>
      )
    }
    return null;
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
    <Layout className={styles.layoutInnerContainer}>
      {getSider()}
    <Content className={styles.layoutContent}>
      {props.children}
      <Footer></Footer>
    </Content>
    </Layout>
  </Layout>
  )
};

export default AppLayout;


