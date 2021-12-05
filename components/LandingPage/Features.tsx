import { Row, Col } from 'antd';
import React from 'react';
import VideoFeature from "./../../public/video_feature.svg";
import MeetTheTeam from './../../public/meet_the_team.svg';
import LightHouse from './../../public/lighthouse.svg';

import { SmileTwoTone, HeartTwoTone, IdcardTwoTone } from '@ant-design/icons';

import styles from './LandingPage.module.scss';
const Features = () => { 
    return <>
    <Row className={styles.features} justify='space-around'>
        <Col md={16} xs={24} className={styles.videoFeatureSvg}> <VideoFeature/> </Col>
        <Col md={8} xs={24} className= {styles.featureCards}>
            <div className={styles.featureCard}>
                <h2> <SmileTwoTone/> Fun Activities  </h2>
                <ul>
                    <li> Asynchronous team building activities</li>
                    <li> Earn and redeem participation points </li>
                    <li> Appreciate others team members </li>
                </ul> 
            </div>
        </Col>
    </Row>
    <Row className={styles.features} justify='space-around'>
        <Col md={8} xs={24} className= {styles.featureCards}>
            <div className={styles.featureCard}>
                <h2> <HeartTwoTone twoToneColor="#eb2f96" /> Know Your Co-Workers </h2>
                <p> </p>
                <p>  </p>
                <ul>
                    <li> Easily learn about coworkers on other teams </li>
                    <li> Connect with people having common interests beyond work  </li>
                    <li> Must have tool for remote first fast growing companies</li>
                </ul> 
            </div>
        </Col>
        <Col md={16} xs={24} className={styles.videoFeatureSvg}> <MeetTheTeam/> </Col>
    </Row>
    <Row className={styles.features} justify='space-around'>
        <Col md={16} xs={24} className={styles.videoFeatureSvg}> <LightHouse/> </Col>
        <Col md={8} xs={24} className= {styles.featureCards}>
            <div className={styles.featureCard}>
                <h2><IdcardTwoTone/> New Hire</h2>
                <ul>
                    <li> Help to take async cultural interviews </li>
                    <li> Make them feel more at home even before joining  </li>
                    <li> Reduce the no show at joining date  </li>
                </ul> 
            </div>
        </Col>
    </Row>
    </>
}

export default Features;