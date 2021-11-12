import React, { useEffect } from "react";
import {  Typography, Row, Col, Button } from "antd";
import Link from "next/link";
import { Session } from "next-auth";

import CreateEvent from "./../../public/create_event.svg";
import styles from './Event.module.scss';


type CreateEventCardProps = {
    session: Session;
  };
  
const CreateEventCard: React.FC<CreateEventCardProps> = ({ session }) => {
    return (
      <div className={styles.createEventCard}>
        <div>
          <Row
            justify="center"
            align="middle"
            className={styles.createEventContent}
          >
            <Col span={16}>
              <div className={styles.createEventSvg}>
                <CreateEvent />
              </div>
            </Col>
            <Col span={8}>
              <Typography.Title level={1}>
                {" "}
                Hi {session && session.user?.name}!
              </Typography.Title>
              <Typography.Title level={5}>Lets Create From Scratch!</Typography.Title>
              <Link href="/events/create">
                <Button type="default" size="large">
                  Create Event
                </Button>
              </Link>
            </Col>
          </Row>
        </div>
      </div>
    );
  };

export default CreateEventCard; 