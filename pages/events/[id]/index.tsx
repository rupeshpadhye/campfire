import React, { useEffect } from "react";
import { GetServerSideProps } from "next";
import Layout from "../../../components/Layout";
import { useSession } from "next-auth/client";
import safeJsonStringify from 'safe-json-stringify';
import prisma from "../../../lib/prisma";

import EventContainer from "../../../containers/EventContainer";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  let event = null;
  if(Number(params?.id)) { 
     event = await prisma.event.findUnique({
      where: {
        id: Number(params?.id) || -1,
      },
     include:{
       questions: true,
       invites : true,
     }
    });
    event= JSON.parse(safeJsonStringify(event));
    if(!event) {
      return {
        props: { event: { questions:[]} } ,
      };
    }
    return {
      props: { event } ,
    };
  }

  return { props: { event: { questions:[] } , type: event ? 'edit': 'create'} };

};


const EditEvent: React.FC<{event}> = (props) => {
  const [session, loading] = useSession();
  const [eventData, setEventData] = React.useState(props.event);
  useEffect(() => {
    setEventData(props.event);
  }, [props.event])
  return (
    <Layout>
      <EventContainer event={eventData} setEventData={setEventData}/>
    </Layout>
  );
};

export default EditEvent;
