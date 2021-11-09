import React, { useEffect } from "react";
import { GetServerSideProps } from "next";
import Layout from "../../../components/Layout";
import { useSession } from "next-auth/client";
import safeJsonStringify from 'safe-json-stringify';
import prisma from "../../../lib/prisma";
import styles from './../events.module.scss';
import { Card, notification, Tabs } from "antd";
import DeleteEvent from "../../../containers/DeleteEvent";
import EventInformationForm from "../../../containers/EventInformationForm";
import QuestionFormContainer from "../../../containers/QuestionFormContainer";
import InviteContainer from '../../../containers/InviteContainer';
import get from 'lodash/get';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params;
  let event = null;
  if(parseInt(id)) { 
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

  return { props: { event: null , type: event ? 'edit': 'create'} };

};

const { TabPane } = Tabs;

const EditEvent: React.FC<{event}> = (props) => {
  const [session, loading] = useSession();
  const [eventData, setEventData] = React.useState(props.event);
  const { id } = props.event;
  console.log(props.event);
  if (loading) {
    return <div>Authenticating ...</div>;
  }

  return (
    <Layout>
     <div className={styles.container}>
     <Tabs defaultActiveKey="1">
      <TabPane tab="Information" key="1">
        <Card style={{ width: "800px" }}>
          <EventInformationForm event={eventData} />
        </Card>
        <DeleteEvent event={eventData}/>
      </TabPane>
      { id && <TabPane tab="Questions" key="2">
        <div style={{ width: "800px" }}>
          <QuestionFormContainer event={eventData} setEventData={setEventData}/>
        </div>
      </TabPane> 
      }
      <TabPane tab="Participants" key="3">
        <div style={{ width: "800px" }}>
          <InviteContainer invites={get(eventData,'invites')}/>
        </div>
      </TabPane>
        </Tabs>
     </div>
    </Layout>
  );
};

export default EditEvent;
