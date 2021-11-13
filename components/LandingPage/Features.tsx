import { Row, Col } from 'antd';
import React from 'react';
import VideoFeature from "./../../public/video_feature.svg";
import { SmileTwoTone, HeartTwoTone, IdcardTwoTone } from '@ant-design/icons';

import styles from './LandingPage.module.scss';
const Features = () => { 
    return <Row className={styles.features} justify='space-around'>
        <Col md={16} xs={24} className={styles.videoFeatureSvg}> <VideoFeature/> </Col>
        <Col md={8} xs={24} className= {styles.featureCards}>
            <div className={styles.featureCard}>
                <h2> <SmileTwoTone/> Fun Activities  </h2>
                <p>Asynchronous Team building activities </p>
            </div>
            <div className={styles.featureCard}>
                <h2> <HeartTwoTone twoToneColor="#eb2f96" /> Know Your Co-Workers </h2>
                <p> Easily learn about coworkers on other teams </p>
            </div>
            <div className={styles.featureCard}>
                <h2><IdcardTwoTone/> New Hire</h2>
                <p> Make them feel more at home even before joining </p>
            </div>
        </Col>
    </Row>

}

export default Features;