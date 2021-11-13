import React from "react";
import animationData from "./../../lotties/snow.json";
import { Button, Col, Row } from "antd";
import styles from "./LandingPage.module.scss";
import Link from "next/link";

import Logo from "../Logo";
import RegisterCreator from "../../containers/RegisterCreator";
import Plans from "../Plans";
import Features from "./Features";
import Footer from "./Footer";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export const Header = ({ hideSignInBtn }) => {
  return (
    <Row
    className={styles.header}
    align="middle"
    justify="space-between"
    gutter={[16, 16]}
  >
    <Col className={styles.logo}>
      <Logo />
      <h1>CampFire</h1>
    </Col>
    <Col>
    { 
      hideSignInBtn ?<Link href="/">
          <Button className={styles.signInButton}>Home</Button>
    </Link> : 
  <Link href="/signin">
        <Button className={styles.signInButton}>Sign In</Button>
      </Link> 
    }
    </Col>
  </Row>
  )
}

export const Banner = ({ setPlan, 
  title='Create unique memories & good vibes at work' ,
 desc=`CampFire allows you to build human connection in your remote team
with engaging & fun activities.`}) => {
  return (
    <Row className={styles.container_holder}>
    <div className={styles.container}>
    <div className={styles.banner}>
      <h1>
       {title}
      </h1>
      <p>
        {desc}
      </p>
      { setPlan ? <Button className={styles.joinButton} onClick={()=> {setPlan('basic')}}>Try Basic Plan</Button> : null }
    </div> 
  </div>
    </Row>
  )
};

const LandingPage = () => {
  const [visible, setVisible] = React.useState(false);
  const [plan, setPlan] = React.useState(null);
  const handleJoinAsOrganizer = (plan) => {
    setPlan(plan);
    setVisible(true);
  };
  const handleSelectedPlan = (plan) => {
    setPlan(plan);
    setVisible(true);
  }
  return (
    <div className={styles.background}>
      <RegisterCreator visible={visible} setVisible={setVisible} plan={plan}/>
      <Header/>
      <Banner setPlan={handleJoinAsOrganizer}/>
      <Row className={styles.feature_holder}>
        <div className={styles.container}>
          <Features />
        </div>
      </Row>
      <Row className={styles.container_holder}>
        <div className={styles.container}>
          <Plans selectedPlan={handleSelectedPlan}/>
        </div>
      </Row>
      <Row className={styles.footer_holder}>
        <div className={styles.container}>
          <Footer/>
        </div>
      </Row>
      </div>
  );
};

export default LandingPage;
