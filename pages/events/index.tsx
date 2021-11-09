import React, { useEffect } from "react";
import { Card, Typography, Row, Col, Button, Image } from "antd";
import { getSession, useSession } from "next-auth/client";
import Link from "next/link";
import { GetServerSideProps } from "next";
import safeJsonStringify from "safe-json-stringify";
import Layout from "./../../components/Layout";
import prisma from "../../lib/prisma";

import FullScreenLoading from "../../components/FullScreenLoading";

import { EventProp } from './../../types';

import styles from "./events.module.scss";
import EventsList from "../../components/Event/EventList";

const { Meta } = Card;

export type EventsProps = { events: Array<EventProp> };

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { events: [] } };
  } else {
     const { user } = session;
     if(!user.name) {
        return { props: { events: [], completeProfileModal: true } };
     }
  }

  let events = await prisma.event.findMany({
    where: {
      author: { email: session.user.email },
    },
  });
  events = JSON.parse(safeJsonStringify(events));
  return { props: { events } };
};

const Events: React.FC<EventsProps> = (props) => {
  const [session, loading] = useSession();
  const { events = [] } = props;
  console.log(events);
  return loading ? (
    <FullScreenLoading />
  ) : (
    <Layout>
      <EventsList title ={'Events'} desc='' isPreview={false} events={events} />
    </Layout>
  );
};
export default Events;
