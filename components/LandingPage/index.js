
import React from "react"
import animationData from "./../../lotties/snow.json";
import Lottie from "react-lottie";
import { Button, Card } from 'antd';
import styles from './LandingPage.module.scss'
import Link from 'next/link';
import Logo from "../Logo";
const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  


  
  const LandingPage = () => { 
    return(
      <div>
         <div className={styles.container}>
            <h1>CampFire</h1>
            <p>Virtual Employee Engagement, helps to create unique shared memories, good vibes</p>
            <Link href="/api/auth/signin">
            <Button className={styles.joinButton}>
                Join The Party
            </Button>
          </Link>
        
         </div>
         <div className={styles.background}>
         <Lottie options={defaultOptions} />
      </div>
      </div>
    )
  }

export default LandingPage;
  