import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/client";
import safeJsonStringify from "safe-json-stringify";
import prisma from "../../../lib/prisma";

import EventContainer from "../../../containers/EventContainer";
import { Button, Card, Layout } from "antd";

import styles from "./event.module.scss";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Router from "next/router";
import AppLayout from "../../../components/AppLayout";
import get from "lodash/get";
import Link from "next/link";

const { Content, Header } = Layout;
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

export const EventInformation = ({ event, handleEdit, role, hideActions }) => {
  return (
    <div className={styles.eventInfo}>
      <Card
        cover={
          <img
            alt="example"
            src={event.headerImage}
            style={{ height: "400px" }}
          />
        }
        actions={
          hideActions
            ? null
            : [
                role === "creator" ? (
                  <Button
                    key="edit"
                    type="primary"
                    onClick={() => {
                      handleEdit(event.id);
                    }}
                  >
                    {" "}
                    Edit{" "}
                  </Button>
                ) : (
                  role === "member" && (
                    <Link href={`/events/${event.id}/participate`}>
                      <Button key="participate" type="primary">
                        {" "}
                        Participate{" "}
                      </Button>
                    </Link>
                  )
                ),
              ]
        }
      >
        <h1>{event.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: event.content }}></div>
      </Card>
    </div>
  );
};

const Event: React.FC<{ event; auth }> = (props) => {
  const [session, loading] = useSession();
  const [eventData, setEventData] = React.useState(props.event);
  const [showEdit, setShowEdit] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const role = get(session, "user.role", "member");
  useEffect(() => {
    setEventData(props.event);
  }, [props.event]);
  return (
    <AppLayout hideSider={true}>
      <Button
        onClick={() => Router.back()}
        className={styles.backButton}
        size="large"
        shape="circle"
        icon={<ArrowLeftOutlined />}
      ></Button>
      <Content>
        <div className={styles.eventInformationHolder}>
          {showInfo && (
            <EventInformation
              event={eventData}
              role={role}
              handleEdit={
                role === "creator"
                  ? () => {
                      setShowEdit(true);
                      setShowInfo(false);
                    }
                  : null
              }
              hideActions={false}
            />
          )}
          {showEdit ? (
            <EventContainer
              event={eventData}
              setEventData={(d) => setEventData(d)}
            />
          ) : null}
        </div>
      </Content>
    </AppLayout>
  );
};

export default Event;

Event.defaultProps = {
  auth: {
    isPublic: false,
    redirect: "/",
    role: ["creator", "member"],
  },
};
