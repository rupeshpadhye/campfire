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

import styles from "../kyt.module.scss";
import AnswerContainer from "../../../containers/EventContainer/AnswerContainer";

import moment from 'moment';

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



const KytSubmission = ({ event, userAnswers }) => {
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
        <div className={styles.participateCarousel}>  
             <AnswerContainer questions={questions} userAnswers={userAnswers} />
        </div>
      </Content>
  </Layout>
  );
};

export default KytSubmission;

KytSubmission.defaultProps = {
  auth: {
    isPublic: false,
    redirect: "/",
    role: ["creator", "member"],
  },
};
