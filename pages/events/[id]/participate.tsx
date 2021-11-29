import { ArrowLeftOutlined, BackwardOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import Router from "next/router";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/client";
import safeJsonStringify from "safe-json-stringify";
import prisma from "../../../lib/prisma";

import { Button, Card, Layout, notification, PageHeader, Tabs } from "antd";
import { Carousel } from 'antd';
import get from 'lodash/get';
const { Header, Content } = Layout;

import styles from "./event.module.scss";
import { EventInformation } from ".";
import AnswerContainer from "../../../containers/EventContainer/AnswerContainer";
import LeaderBoard from "../../../containers/EventContainer/ResponsesContainer/LeaderBoard";

const { TabPane } = Tabs;
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
  const { user } = session;

  let [event, userAnswers] = await Promise.all([
    prisma.event.findUnique({
      where: {
        id: Number(params?.id) || -1,
      },
      include: {
        questions: true,
      }
    }),
    // prisma.question.findMany({
    //   where: {
    //     eventId: Number(params?.id) || -1,
    //   },
    // }),
    prisma.userQuestionAnswers.findMany({
      where: {
        user: {
          is: {
            email: user.email,
          },
        },
        question: { 
          is: {
            eventId: Number(params?.id) || -1,
          }
        }
      },
    }),
  ]);

  event = JSON.parse(safeJsonStringify(event));
  userAnswers = JSON.parse(safeJsonStringify(userAnswers));
  return {
    props: { event, userAnswers },
  };
};



const Participate = ({ event, userAnswers }) => {
  const questions = get(event, "questions", []);
  return (
    <Layout className={styles.participatePage}>
    <PageHeader
          className={styles.pageHeader}
          onBack={() => Router.back()}
          title={event.title}
          subTitle=""
       />

      <Content   className={styles.participatePageContent}>
          <Tabs defaultActiveKey="1">
        <TabPane tab="Tasks" key="1">
            <div className={styles.participateCarousel}>  
                <AnswerContainer questions={questions} userAnswers={userAnswers} />
              </div>
        </TabPane>
        <TabPane tab="All Responses" key="2">
          <LeaderBoard event={event}/>
        </TabPane>
        <TabPane tab="Details" key="3">
          <EventInformation event={event} role='member' hideActions={true} handleEdit={null} />
        </TabPane>
       
  </Tabs>
      <div className={styles.eventInformationHolder}>
        {/* <Event event={event} handleParticipate={handleParticipate}/> */}
      </div>


      </Content>
  </Layout>
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
