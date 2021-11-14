import React, { useEffect } from "react";
import { GetServerSideProps } from "next";
import Layout from "../../../components/Layout";
import styles from './../events.module.scss';
import { Card, notification, Tabs } from "antd";

import get from 'lodash/get';
import { templates } from "../../api/data";
import EventContainer from "../../../containers/EventContainer";
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params;
  const event = templates.find(template => template.id === id);
  if(!event) {
    return {
      props: { event: { questions:[]} } ,
    };
  }
  return {
    props: { event } ,
  };
};

const { TabPane } = Tabs;

const PreviewTemplate: React.FC<{event}> = (props) => {
 
  const [eventData, setEventData] = React.useState(props.event);

  return (
    <Layout>
      <EventContainer event={eventData} setEventData={setEventData}/>
    </Layout>
  );
};

export default PreviewTemplate;
