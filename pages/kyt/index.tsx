import React, { useEffect } from "react";
import { Card, Typography, Row, Col, Button, Image } from "antd";
import { getSession, useSession } from "next-auth/client";
import Link from "next/link";
import { GetServerSideProps } from "next";
import safeJsonStringify from "safe-json-stringify";
import AppLayout from "../../components/AppLayout";
import prisma from "../../lib/prisma";
import get from "lodash/get";
import FullScreenLoading from "../../components/FullScreenLoading";

import { EventProp } from './../../types';

import EventsList from "../../components/Event/EventList";
import { kycTemplates } from "../api/data";
import MeetTheTeam from './../../public/meet_the_team.svg';

export type EventsProps = { events: Array<EventProp>, templateEvents: Array<EventProp> , auth: any };

type EventType =  'celebration' | 'icebreaker' | 'culture';

const eventTypes: EventType[] = [ 'icebreaker', 'culture'];

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
        author: { email: session.user.email  },
        eventType: { in: eventTypes}
      },
    });
    events = JSON.parse(safeJsonStringify(events));
    return { props: { events, templateEvents: kycTemplates } };

  } else {
    const invitedEvents = await prisma.eventInvite.findMany({
      where: {
        user: { email: session.user.email },
        event: { is: { eventType: { in: eventTypes } } },
      },
      include: {
        event: true,
      },
    });
    events = invitedEvents.map((invitedEvent) => invitedEvent.event);
    return { props: { invitedEvents: events } };
  }
};

const EmptyState = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "800px" ,width: "800px" }}>
      <MeetTheTeam/>
    </div>
  );
}
const KnowYourTeam: React.FC<EventsProps> = (props) => {
  const [session, loading] = useSession();
  const { events = [], templateEvents= [] } = props;
  return loading ? (
    <FullScreenLoading />
  ) : (
    <AppLayout>
      { events.length ?  <EventsList title='Know Your Templates' desc='Ready to use templates!' isPreview={true} events={templateEvents}/> 
      : <EmptyState /> }
    </AppLayout>
  );
};
export default KnowYourTeam;


KnowYourTeam.defaultProps = {
  auth: {
    isPublic: false,
    redirect: '/',
    role: ['creator','member'],
  }
};
