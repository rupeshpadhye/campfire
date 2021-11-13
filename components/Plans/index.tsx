

import { CheckCircleTwoTone } from '@ant-design/icons';
import { Row, Col, Card, Button } from 'antd';
import styles from './Plans.module.scss';
import React from 'react';

const Plans = ({selectedPlan}) => {
    return (
        <div>
        <Row gutter={16} className={styles.pricing}>
        <Col md={6}  xs={24}>
          <Card title="Free" bordered={false} className={styles.pricingCard}
          actions={[
            <Button 
                className={styles.joinPlanBtn} 
                onClick={() => { selectedPlan('free')}} 
                >Join Now
                </Button>
            ]}
          >
            <h2>0$ <p className={styles.perYear}>/year</p></h2>
            <ul>
              <li>  <CheckCircleTwoTone twoToneColor="#52c41a" /> One Team Activity </li>
              <li>  <CheckCircleTwoTone twoToneColor="#52c41a" /> 10 team member profiles</li>
            </ul>
          </Card>
        </Col>
        <Col md={6} xs={24}>
          <Card title="Basic" bordered={false} className={styles.pricingCard}
            actions={[
                <Button 
                    className={styles.joinPlanBtn} 
                    onClick={() => { selectedPlan('basic')}} 
                    >
                            Join Now
                    </Button>
                ]}>
            <h2>499$<p className={styles.perYear}>/year</p></h2>
            <ul>
            <li>  <CheckCircleTwoTone twoToneColor="#52c41a" /> Unlimited Team Activities </li>
            <li> <CheckCircleTwoTone twoToneColor="#52c41a" />  Integrations</li>
            <li>  <CheckCircleTwoTone twoToneColor="#52c41a" /> 50 team members profiles</li>
            </ul>
          </Card>
        </Col>
        <Col md={6} xs={24}>
          <Card title="Pro" bordered={false} className={styles.pricingCard}
            actions={[
                <Button 
                    className={styles.joinPlanBtn} 
                    onClick={() => { selectedPlan('pro')}} 
                    >
                        Join Now
                    </Button>
                ]}
          >
            <h2>999$ <p className={styles.perYear}>/year</p> </h2>
            <ul>
            <li> <CheckCircleTwoTone twoToneColor="#52c41a" /> Basic Plan Features </li>
            <li> <CheckCircleTwoTone twoToneColor="#52c41a" /> Bespoke Integrations</li>
            <li> <CheckCircleTwoTone twoToneColor="#52c41a" /> 500+ team member profiles </li>
            </ul>
          </Card>
        </Col>
      </Row>
     </div>
    )
}

export default Plans;