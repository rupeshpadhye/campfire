import React from "react";
import { Card, notification, Switch } from "antd";
import get from "lodash/get";


const EventPublishContainer = ({ event }) => {
  const id = event?.id;
  const [isPublished, setIsPublished] = React.useState(get(event, "published"));
  const publishEvent = async () => {
    setIsPublished(!isPublished);

    fetch(`/api/event/${id}/publish`, {
      method: "PUT",
    })
      .then((res) => res.json())
      .then((res) => {
        notification.info({
          message: isPublished ?  'Event Unpublished.' :"Event Published Successfully.",
        });
        setIsPublished(!isPublished);
      })
      .catch((err) => {
        setIsPublished(!isPublished);
        notification.error({
          message: "Error Publishing Event.",
        });
      });
  };
  return id ? (
    <Card
      loading={false}
      title={
        get(event, "published")
          ? `UnPublish ${event.title}`
          : `Publish ${event.title}`
      }
    >
        <div style={{
            display: "flex",
            justifyContent: "space-between",
        }}>
        {isPublished ? ('Are you sure you want to un publish this event?') : ('Toggle on the publish this event')}  
        <Switch
          checked={isPublished}
          onChange={() => {
            publishEvent();
          }}
        />
        </div>
    </Card>
  ) : null;
};

export default EventPublishContainer;
