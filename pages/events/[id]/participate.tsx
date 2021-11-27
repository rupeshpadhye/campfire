import { ArrowLeftOutlined, BackwardOutlined } from "@ant-design/icons";
import React from "react";
import Router from "next/router";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/client";
import safeJsonStringify from "safe-json-stringify";
import prisma from "../../../lib/prisma";

import { Button, Card, Layout, PageHeader, Tabs } from "antd";
import { Carousel } from 'antd';
import { QuestionCard } from "../../../components/QuestionCards";
import get from 'lodash/get';
const { Header, Content } = Layout;

import styles from "./event.module.scss";
import { EventInformation } from ".";

const { TabPane } = Tabs;
export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}) => {
  const session = await getSession({ req });
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
        eventId: Number(params?.id) || -1,
      },
      include: {
        question: true,
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
  
  const handleParticipate = () => {

  }
  return (
    <Layout className={styles.participatePage}>
      {/* <Header theme>      
        <Button
        onClick={() => Router.back()}
        className={styles.backButton}
        size="large"
        shape="circle"
        icon={<ArrowLeftOutlined />}
      ></Button>
     

</Header> */}
    <PageHeader
          className={styles.pageHeader}
          onBack={() => Router.back()}
          title={event.title}
          subTitle=""
       />

      <Content>
          <Tabs defaultActiveKey="1">
          <TabPane tab="Tasks" key="1">
            <div className={styles.participateCarousel}>
              <Carousel swipeToSlide draggable>
                {questions.map((question, index) => {
                  return ( <QuestionCard index={index} question={question}  key={index} hideActionButton={true}/>)
                })}
              </Carousel>  
              </div>
        </TabPane>
        <TabPane tab="Details" key="2">
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
