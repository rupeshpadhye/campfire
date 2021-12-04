import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/client";
import safeJsonStringify from "safe-json-stringify";
import prisma from "../../../lib/prisma";
import EventContainer from "../../../containers/EventContainer";
import AppLayout from "../../../components/AppLayout";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  let event = null;
  if (Number(params?.id)) {
    event = await prisma.event.findUnique({
      where: {
        id: Number(params?.id) || -1,
      },
      include: {
        questions: true,
        invites: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });
    event = JSON.parse(safeJsonStringify(event));
    if (!event) {
      return {
        props: { event: { questions: [] } },
      };
    }
    return {
      props: { event },
    };
  }

  return {
    props: { event: { questions: [] }, type: event ? "edit" : "create" },
  };
};

const Event: React.FC<{ event; auth }> = (props) => {
  const [eventData, setEventData] = React.useState(props.event);
  useEffect(() => {
    setEventData(props.event);
  }, [props.event]);
  return (
    <AppLayout >
      <EventContainer
              event={eventData}
              setEventData={(d) => setEventData(d)}
            />
    </AppLayout>
  );
};

export default Event;

Event.defaultProps = {
  auth: {
    isPublic: false,
    redirect: "/",
    role: ["creator"],
  },
};
