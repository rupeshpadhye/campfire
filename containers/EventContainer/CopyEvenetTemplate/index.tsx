import React from "react";
import { Card, notification} from "antd";
import { Button } from "antd";
import Router from "next/router";

const CopyEventTemplate = ({ event }) => {

 const [saving, setSaving] = React.useState(false);
  const handleCopyTemplate = async () => {
    
    try {
        setSaving(true);
        const response = await fetch(
            '/api/template', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event}),
          }).then(response => response.json());
          notification.success({
            message: 'Event Created Successfully',
            description: 'Now you can add participants!'
          });
        Router.push("/events/[id]", `/events/${response.id}`);
      } catch (error) {
          console.log(error);
          notification.error({
            message: 'Error Creating Personalize Event.',
          });
      } finally {
        setSaving(false);
      }
  
  }
    const { id } = event;
    return (
      id ? <Card
        loading={false}
        title={`Use ${event.title} Template`}
        style={{marginTop: "16px"}}
        extra={
          <Button
            type="dashed"
            danger
            onClick={handleCopyTemplate}
            loading={saving}
          >
            Copy Template
          </Button>
        }>
           You can edit the event after it is created. The description and all associated data will be copied to the new event.
        </Card> : null)
  }

  export default CopyEventTemplate;