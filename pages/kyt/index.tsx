import React, { useEffect, useState } from "react";
import { Card, Typography, Row, Col, Button, Image } from "antd";
import { getSession, useSession } from "next-auth/client";
import Link from "next/link";
import { GetServerSideProps } from "next";
import safeJsonStringify from "safe-json-stringify";
import AppLayout from "../../components/AppLayout";
import prisma from "../../lib/prisma";
import get from "lodash/get";
import FullScreenLoading from "../../components/FullScreenLoading";
import  flatten from 'lodash/flatten';
import { EventProp } from "./../../types";
import { has } from 'lodash';
import EventsList from "../../components/Event/EventList";
import MeetTheTeam from "./../../public/meet_the_team.svg";
import CreateEvent from "./../../public/create_event.svg";

import styles from "./kyt.module.scss";

export type EventsProps = {
  events: Array<EventProp>;
  templateEvents: Array<EventProp>;
  invitedEvents: Array<EventProp>;
  auth: any;
};

type EventType = "icebreaker";
const eventType: EventType = "icebreaker";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  const userRole = get(session, "user.role");

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }
  let events = [];
  if (userRole === "creator") {
    let events = await prisma.event.findMany({
      where: {
        author: { email: session.user.email },
        eventType,
      },
    });
    events = JSON.parse(safeJsonStringify(events));
    return { props: { events} };
  } else {
    const invitedEvents = await Promise.all([
      prisma.eventInvite.findMany({
        where: {
          user: { email: session.user.email },
          event: { is: { eventType } },
        },
        include: {
          event: true,
        },
      }),
    ]);
    return { props: { invitedEvents: flatten(invitedEvents) } };
  }
};

const EmptyState = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "800px",
        width: "800px",
      }}
    >
      <MeetTheTeam />
    </div>
  );
};


const KytCreatorView = ({  events }) => {
  const kytEvent = events.find(e => e.eventType === 'icebreaker');
  const { id, title, content } = kytEvent || {};
  return (
    <div>
    <Row>
      <Col md={12} className={styles.kytMemberSvg}>
      <EmptyState />
      </Col>
      <Col md={12} className={styles.kytMember}>
        <div>
          <div className={styles.kytMemberContent}>
           <h1>{ 'Meet The Team'}</h1>
           <p>
              Ice Breaker Questions for building long lasting bonds!
           </p>
           </div>
           <div className={styles.kytMemberButtons}>
           { events.length === 0 ? <Link href={`/kyt/template/know-the-team`}>
                <Button className={styles.submitYours}>View Template</Button>
             </Link> :
             <>
              <Link href={`/kyt/${id}`}>
                  <Button className={styles.submitYours}> {`Edit ${title}`}</Button>
               </Link> 
               <Link href={`/kyt/${id}/responses`}>
               <Button className={styles.viewOthers}>View Responses</Button>
              </Link>
              </>
            }
             
           </div>
        </div>
      </Col>
    </Row>
  </div>
  );
};

const KytMemberView = ({ invitedEvents = [] }) => {
  if(!invitedEvents.length) {
    return <EmptyState/>
  } 
  const kytEvent = invitedEvents.find(e => e.event.eventType === 'icebreaker') || {};
  const { event, status } = kytEvent;
  //@ts-ignore
  const { title , content, id } = event; 
  return (
    <div>
      <Row>
        <Col md={12} className={styles.kytMemberSvg}>
        <EmptyState />
        </Col>
        <Col md={12} className={styles.kytMember}>
          <div>
            <div className={styles.kytMemberContent}>
             <h1>{title}</h1>
             <p dangerouslySetInnerHTML={{__html: content}}></p>
             </div>
             <div className={styles.kytMemberButtons}>
               <Link href={`/kyt/${id}/submission`}>
                  <Button className={styles.submitYours}>{status ==='completed' ? 'View Your Response' : 'Complete Your Responses'}</Button>
               </Link>
               <Link href={`/kyt/${id}/responses`}>
                <Button className={styles.viewOthers}>Meet The Team</Button>
               </Link>
             </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

const KnowYourTeam: React.FC<EventsProps> = (props) => {
  const [session, loading] = useSession();
  const { events = [], invitedEvents = [] } = props;
  return loading ? (
    <FullScreenLoading />
  ) : (
    <AppLayout>
      {has(props,'events')? (
        <KytCreatorView  events={events} />
      ) : (
        <KytMemberView invitedEvents={invitedEvents} />
      )}
    </AppLayout>
  );
};
export default KnowYourTeam;

KnowYourTeam.defaultProps = {
  auth: {
    isPublic: false,
    redirect: "/",
    role: ["creator", "member"],
  },
};
