import React, { useEffect } from "react";
import { Card, Typography, Row, Col, Button, Image } from "antd";
import { getSession, useSession } from "next-auth/client";
import Link from "next/link";
import { GetServerSideProps } from "next";
import safeJsonStringify from "safe-json-stringify";
import AppLayout from "../../components/AppLayout";
import prisma from "../../lib/prisma";

import FullScreenLoading from "../../components/FullScreenLoading";

import { EventProp } from './../../types';

import EventsList from "../../components/Event/EventList";
import CreateEventCard from "../../components/Event/CreateEventCard";
import { templates } from "../api/data";
import CompleteProfileModal from "../../containers/ProfileContainer/CompleteProfileModal";

type EventType =  'celebration';

const eventType: EventType =  'celebration';

export type EventsProps = { events: Array<EventProp>, templateEvents: Array<EventProp> , auth: any };

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if(!session) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    }
  }

  let events = await prisma.event.findMany({
    where: {
      author: { email: session.user.email },
      eventType: eventType
    },
  });
  events = JSON.parse(safeJsonStringify(events));
  return { props: { events, templateEvents: templates } };
};

const Events: React.FC<EventsProps> = (props) => {
  const [session, loading] = useSession();
  const { events = [], templateEvents= [] } = props;
  return loading ? (
    <FullScreenLoading />
  ) : (
    <AppLayout>
      <CompleteProfileModal/>
      <CreateEventCard session={session}  />
      <EventsList title='Celebration Templates' desc='Ready to use templates!' isPreview={true} events={templateEvents}/>
      <EventsList title ={'Events'} desc='' isPreview={false} events={events} />
    </AppLayout>
  );
};
export default Events;


Events.defaultProps = {
  auth: {
    isPublic: false,
    redirect: '/',
    role: ['creator', 'member'],
  }
};
