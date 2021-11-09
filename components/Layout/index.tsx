import React, { ReactNode, useState } from "react";

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
  BankOutlined
} from '@ant-design/icons';
type Props = {
  children: ReactNode;
};

const creatorMenu = [
  {
    id: '1',
    title: 'Dashboard',
    icon: <BarChartOutlined />,
    link: '/dashboard',
  },
  { id: '2',
    title: 'Events',
    icon: <VideoCameraOutlined />,
    link: '/events',
  },
  {
    id: '3',
    title: 'Subscription',
    icon: <BankOutlined />,
    link: '/subscription',
  },
  { id: '4',
    title: 'Profile',
    icon: <UserOutlined />,
    link: '/profile',
  }
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


