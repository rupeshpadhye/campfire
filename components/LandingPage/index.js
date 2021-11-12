
import React from "react"
import animationData from "./../../lotties/snow.json";
import Lottie from "react-lottie";
import { Button, Card, Modal } from 'antd';
import styles from './LandingPage.module.scss'
import Link from 'next/link';
import { signIn, signOut, useSession } from "next-auth/client";

import Logo from "../Logo";
import RegisterCreator from "../../containers/RegisterCreator";
const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  


  
  const LandingPage = () => { 
    const [visible, setVisible] = React.useState(false);
    const handleJoinAsOrganizer = () => {
      setVisible(true);
    }
    return(
      <div>
         <RegisterCreator visible={visible} setVisible={setVisible}/>
         <div className={styles.container}>
            <h1>CampFire</h1>
            <p>Virtual Employee Engagement, helps to create unique shared memories, good vibes</p>
            <Link href="/api/auth/signin">
            <Button className={styles.joinButton}>
               Join As Participant
            </Button>
           </Link>
          <Button onClick={handleJoinAsOrganizer}>
            Join As Organizer
          </Button>
        
         </div>
         <div className={styles.background}>
         <Lottie options={defaultOptions} />
      </div>
      </div>
    )
  }

export default LandingPage;
  