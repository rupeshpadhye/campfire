import React, { useEffect, useState } from "react";
import { Card, Typography, Row, Col, Button, Image } from "antd";
import { getSession, useSession } from "next-auth/client";
import Link from "next/link";
import { GetServerSideProps } from "next";
import safeJsonStringify from "safe-json-stringify";
import AppLayout from "../../components/AppLayout";
import prisma from "../../lib/prisma";

import FullScreenLoading from "../../components/FullScreenLoading";

import { EventProp } from "./../../types";

import EventsList from "../../components/Event/EventList";
import CreateEventCard from "../../components/Event/CreateEventCard";
import { templates } from "../api/data";
import CompleteProfileModal from "../../containers/ProfileContainer/CompleteProfileModal";

import get from "lodash/get";
import MemberView from "../../components/Event/MemberView";

type EventType = "celebration";


export type EventsProps = {
  events?: Array<EventProp>;
  templateEvents?: Array<EventProp>;
  auth: any;
  invitedEvents?: Array<EventProp>;
  userRole: string;
};

const eventType: EventType = "celebration";

export const getServerSideProps: GetServerSideProps = async ({ req, res, }) => {

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
        eventType: eventType,
      },
      include: {
        author: true,
      },
    });
    events = JSON.parse(safeJsonStringify(events));
    return { props: { events, templateEvents: templates } };
  } else {
    const invitedEvents = await prisma.eventInvite.findMany({
      where: {
        user: { email: session.user.email },
        event: { is: { eventType: eventType, published: true } },
      },
      include: {
        event: true,
      },
    });
    events = invitedEvents.map((invitedEvent) => invitedEvent.event);
    events = JSON.parse(safeJsonStringify(events));

    return { props: { invitedEvents: events } };
  }
};

const CreatorView = ({ events, templateEvents }) => {
  return (
    <>
      <CreateEventCard />
      <EventsList
        title="Celebration Templates"
        desc="Ready to use templates!"
        isPreview={true}
        events={templateEvents}
      />
      <EventsList title={"Events"} desc="" isPreview={false} events={events} />
    </>
  );
};



const Events: React.FC<EventsProps> = (props) => {
  const { events = [], templateEvents = [], invitedEvents } = props;
  const [ session , loading ] =  useSession();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if(session && !loading) {
      const showComplete = !get(session, "user.name") || !get(session, "user.image")
      setVisible(showComplete);
    }
  }, [session, loading]);
  return (
    <AppLayout>
      <CompleteProfileModal visible={visible} setVisible={setVisible}/>
      {templateEvents.length ? (
        <CreatorView events={events} templateEvents={templateEvents} />
      ) : <MemberView events={invitedEvents} />
      }
    </AppLayout>
  );
};
export default Events;

Events.defaultProps = {
  auth: {
    isPublic: false,
    redirect: "/",
    role: ["creator", "member"],
  },
};
