import React, { useEffect } from "react";
import Router from "next/router";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/client";
import safeJsonStringify from "safe-json-stringify";
import prisma from "../../../lib/prisma";

import { Button, Card, Layout, notification, PageHeader, Tabs } from "antd";
import get from 'lodash/get';
const { Header, Content } = Layout;
import styles from "./../kyt.module.scss";
import LeaderBoard from "../../../containers/EventContainer/ResponsesContainer/LeaderBoard";
import AppLayout from "../../../components/AppLayout";
export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}) => {
  const session = await getSession({ req });
  if(!session) {
    return {
      props: { redirect: "/" },
    };
  }

  let [event] = await Promise.all([
    prisma.event.findUnique({
      where: {
        id: Number(params?.id) || -1,
      },
      include: {
        questions: true,
      }
    }),
  ]);

  event = JSON.parse(safeJsonStringify(event));
  return {
    props: { event },
  };
};



const Participate = ({ event }) => {
  return (
    <AppLayout>
      <LeaderBoard event={event}/>
    </AppLayout>
  );
};

export default Participate;

Participate.defaultProps = {
  auth: {
    isPublic: false,
    redirect: "/",
    role: ["creator", "member"],
  },
};
