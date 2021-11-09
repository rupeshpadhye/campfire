import React from "react";
import { Card, notification} from "antd";
import { Button } from "antd";
import styles from "./DeleteEventCard.module.scss";
import Router from "next/router";

const DeleteEvent = ({ event }) => {

   
  const handleDeleteEvent = async () => {
    const { id } = event;
    try {
      await fetch(`/api/event/${id}`, {
            method: "DELETE",
          }).then(res => res.json());
          notification.info({
            message: 'Event Deleted Successfully.',
          });
      Router.push(`/events`);
      } catch (error) {
          console.log(error);
          notification.error({
            message: 'Error Deleting Event.',
          });
      }
  
  }
    const { id } = event;
    return (
      id ? <Card
        loading={false}
        className={styles.deleteEventCard}
        title={`Delete ${event.title}`  }
        extra={
          <Button
            type="dashed"
            danger
            onClick={handleDeleteEvent}
          >
            Delete
          </Button>
        }>
          This will delete the event and all associated data.
        </Card> : null)
  }

  export default DeleteEvent;