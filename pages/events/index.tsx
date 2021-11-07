import React, { useEffect } from "react";
import { GetStaticProps } from "next";
import Layout from "./../../components/Layout";
import prisma from "../../lib/prisma";
import { Card, Typography, Row, Col, Button, Image } from "antd";
import CreateEvent from "./../../public/create_event.svg";
import styles from "./events.module.scss";
import { getSession, useSession } from "next-auth/client";
import FullScreenLoading from "../../components/FullScreenLoading";
import animationData from "./../../lotties/snow.json";
import Lottie from "react-lottie";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import safeJsonStringify from 'safe-json-stringify';

const { Meta } = Card;

export type EventProp = {
  id: number;
  title: string;
  author: {
    name: string;
    email: string;
  } | null;
  content: string;
  published: boolean;
  headerImage?: string;
  backgroundImage?: string
  uniqueLink?: string;
  expiresAt?: Date;
};

export type EventsProps = { events:Array<EventProp> };

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

type CreateEventCardProps = {
  session: Session;
};

const CreateEventCard: React.FC<CreateEventCardProps> = ({ session }) => {
  return (
    <div className={styles.createEventCard}>
      <div>
        <div className={styles.createEventLottie}>
          <Lottie options={defaultOptions} />
        </div>
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
              Hi {session && session.user.name}!
            </Typography.Title>
            <Typography.Title level={5}>Lets Create Fun Event</Typography.Title>
            <Link href="/events/create">
              <Button type="primary" size="large">
                Create Event
              </Button>
            </Link>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { events: [] } };
  }

  let events = await prisma.event.findMany({
    where: {
      author: { email: session.user.email },
    },
  });
  events= JSON.parse(safeJsonStringify(events));
  return { props: { events } };
};

const Events: React.FC<EventsProps> = (props) => {
  const [session, loading] = useSession();
  const { events = [] } = props;
  console.log(events)
  return loading ? (
    <FullScreenLoading />
  ) : (
    <Layout>
      <CreateEventCard session={session} />
      <div className="page">
        <h1>Events</h1>
        <Row gutter={[16, 16]}>
        {events.map((event) => {
          return (
            <Col span={4} key={event.id}>
            <Link href={`/events/${event.id}`}>
              <Card
                hoverable
                style={{ width: 240 }}
                key={event.id}
                title={event.title}
                cover={
                  event.headerImage ? <Image src={event.headerImage} preview={false}/>: null
                }
              >
               <div>
                 <p>Published : <b>{event.published ? "Yes" : "No"}</b></p>
                 <p>Expired : <b>{new Date(event.expiresAt) >= new Date() ? 'Yes' : 'No'}</b></p>
               </div>
              </Card>
            </Link>
            </Col>
          );
        })}
        </Row>
      </div>
    </Layout>
  );
};
export default Events;
