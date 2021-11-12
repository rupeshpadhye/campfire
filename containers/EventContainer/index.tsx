import React, { useEffect } from "react";

import { Card, Tabs } from "antd";
import DeleteEvent from "./DeleteEvent";
import EventInformationForm from "./EventInformationForm";
import QuestionFormContainer from "./QuestionFormContainer";
import get from "lodash/get";

import styles from "./EventContainer.module.scss";
import CopyEventTemplate from "./CopyEvenetTemplate";

const { TabPane } = Tabs;

const EventContainer = ({ event, setEventData }) => {
  const id = get(event, "id");
  const isPreview = get(event, "type") === 'template';
  return (
    <div className={styles.container}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Information" key="1">
          <Card style={{ width: "800px" }}>
            <EventInformationForm event={event} isPreview={isPreview} />
          </Card>
          {isPreview ? <CopyEventTemplate event={event}/> : <DeleteEvent event={event} /> }
        </TabPane>
        {id && (
          <TabPane tab="Questions" key="2">
            <div style={{ width: "800px" }}>
              <QuestionFormContainer
                event={event}
                setEventData={setEventData}
                isPreview={isPreview}
              />
            </div>
          </TabPane>
        )}
        {/* {!isPreview && <TabPane tab="Participants" key="3">
          <div style={{ width: "800px" }}>
            <InviteParticipants invites={get(event, "invites", [])} />
          </div>
        </TabPane>} */}
      </Tabs>
    </div>
  );
};

export default EventContainer;
