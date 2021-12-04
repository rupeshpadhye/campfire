import React, { useEffect } from "react";
import { GetServerSideProps } from "next";
import Layout from "../../../components/AppLayout";

import { kycTemplates } from "../../api/data";
import EventContainer from "../../../containers/EventContainer";
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params;
  const event = kycTemplates.find(template => template.id === id);
  if(!event) {
    return {
      props: { event: { questions:[]} } ,
    };
  }
  return {
    props: { event } ,
  };
};


const PreviewTemplate: React.FC<{event, auth}> = (props) => {
 
  const [eventData, setEventData] = React.useState(props.event);

  return (
    <Layout>
      <EventContainer event={eventData} setEventData={setEventData}/>
    </Layout>
  );
};

export default PreviewTemplate;


PreviewTemplate.defaultProps = {
  auth: {
    isPublic: false,
    redirect: '/',
    role: ['creator'],
  }
};
