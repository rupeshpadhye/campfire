import React, { useEffect, useState } from "react";
import { Card, Modal, notification, Tabs } from "antd";
import { Form, Button, Input } from "antd";
import Router from "next/router";
import UploadButton from "../../../components/UploadButton";


const EventInformationForm = ({ event, isPreview }) => {
    console.log(event);
    const [form] = Form.useForm();
    const [headerImage, setHeaderImage] = React.useState(null);
    const [saving, setSaving] = useState(false);
    useEffect(() => {
      if(event.headerImage) {
        setHeaderImage(event.headerImage);
      }  
    }, [ event ]);

    const handSaveEventInfo = async (event) => { 
        const { id } = event;
        setSaving(true);
       const response = await fetch(
          id ? `/api/event/${id}`: `/api/event`, {
          method: id ? "PUT" : "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...event , eventType: event.eventType || 'celebration' }),
        }).then(response => response.json());  
        if(!id) {
          notification.success({
            message: 'New Draft Created.',
            description: 'You can add questions now.',
          });
          Router.push(`/events/${response.id}`);
        } else {
          notification.success({ message: 'Event Info Updated.'});
        }
        setSaving(false);
      }
  
    const handleFinish =(values) => {
      const newEvent = {...values, headerImage, id: event.id};
      handSaveEventInfo(newEvent);
    };
  
    const handleHeaderImage = (res) => {
      const { url } = res.filesUploaded[0];
      setHeaderImage(url);
    };
  
    return (
      <div>
        <Form
          onFinish={handleFinish}
          layout="vertical"
          form={form}
          initialValues={event}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[
              {
                required: true,
                message: "Please input event name",
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="Description"
            rules={[
              { required: true, message: "Please input event description" },
            ]}
          >
            <Input.TextArea showCount maxLength={100} />
          </Form.Item>
          <Form.Item name="headerImage" label="Header Image ">

            <UploadButton
              handleUpload={handleHeaderImage}
              label={"Upload Header Image"}
              removeFile={() => setHeaderImage(null)}
              fileURL={headerImage}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 21 }}>
            <Button type="primary" htmlType="submit" loading={saving} disabled={isPreview}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };

  export default EventInformationForm;