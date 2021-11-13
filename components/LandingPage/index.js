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

const LandingPage = () => {
  const [visible, setVisible] = React.useState(false);
  const [plan, setPlan] = React.useState(null);
  const handleJoinAsOrganizer = () => {
    setVisible(true);
  };
  const handleSelectedPlan = (plan) => {
    setPlan(plan);
  }
  return (
    <div className={styles.background}>
      <RegisterCreator visible={visible} setVisible={setVisible} plan={plan}/>
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
          <Link href="/api/auth/signin">
            <Button className={styles.signInButton}>Sign In</Button>
          </Link>
        </Col>
      </Row>
      <Row className={styles.container_holder}>
      <div className={styles.container}>
      <div className={styles.banner}>
        <h1>
          Create unique memories & good vibes at work
        </h1>
        <p>
          CampFire allows you to build human connection in your remote team
          with engaging & fun activities.
        </p>
        <Button className={styles.joinButton} onClick={handleJoinAsOrganizer}>Try Basic Plan</Button>
      </div> 
    </div>
      </Row>
      <Row className={styles.feature_holder}>
        <div className={styles.container}>
          <Features />
        </div>
      </Row>
      <Row className={styles.container_holder}>
        <div className={styles.container}>
          <Plans onSelectedPlan={handleSelectedPlan}/>
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
