import React from "react";
import {  useSession } from "next-auth/client";
import Layout from "../../components/Layout";
import FullScreenLoading from "../../components/FullScreenLoading";
import { EventProp } from '../../types';
import EventsList from "../../components/Event/EventList";
import CreateEventCard from "../../components/Event/CreateEventCard";
import { templates } from "./data";

export type EventsProps = { events: Array<EventProp> };

export async function getStaticProps(context) {
  return {
    props: { events: templates }, 
  }
}

const Events: React.FC<EventsProps> = (props) => {
  const [session, loading] = useSession();
  const { events = [] } = props;
  console.log(events);
  return loading ? (
    <FullScreenLoading />
  ) : (
    <Layout>
      <CreateEventCard session={session} />
      <EventsList title='Templates' desc='Ready to use templates!' isPreview={true} events={events}/>
    </Layout>
  );
};
export default Events;
