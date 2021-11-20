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
import { kycTemplates } from "../api/data";


const { Meta } = Card;

export type EventsProps = { events: Array<EventProp>, templateEvents: Array<EventProp> , auth: any };



type EventType =  'celebration' | 'icebreaker' | 'culture';

const eventTypes: EventType[] = [ 'icebreaker', 'culture'];

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
      author: { email: session.user.email  },
      eventType: { in: eventTypes}
    },
  });
  events = JSON.parse(safeJsonStringify(events));
  return { props: { events, templateEvents: kycTemplates } };
};

const KnowYourTeam: React.FC<EventsProps> = (props) => {
  const [session, loading] = useSession();
  const { events = [], templateEvents= [] } = props;
  return loading ? (
    <FullScreenLoading />
  ) : (
    <AppLayout>
      <EventsList title='Know Your Templates' desc='Ready to use templates!' isPreview={true} events={templateEvents}/>
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
