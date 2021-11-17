import React, { useEffect } from "react";

import { Card, Tabs } from "antd";
import DeleteEvent from "./DeleteEvent";
import EventInformationForm from "./EventInformationForm";
import QuestionFormContainer from "./QuestionFormContainer";
import get from 'lodash/get';
import map from 'lodash/map';
import styles from "./EventContainer.module.scss";
import CopyEventTemplate from "./CopyEvenetTemplate";
import InviteParticipants from "./InviteParticipants";

const { TabPane } = Tabs;

const EventContainer = ({ event, setEventData }) => {
  const id = get(event, "id");
  const isPreview = get(event, "type") === 'template';
  const invitedUsers = map(get(event,'invites', []), e => {
    return e.user;
  });
  return (
    <div className={styles.container}>
      <div style={{ width: "800px" }}>
      {isPreview ? <CopyEventTemplate event={event}/> : null }
      </div>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Information" key="1">
          <Card style={{ width: "800px" }}>
            <EventInformationForm event={event} isPreview={isPreview} />
          </Card>
          {!isPreview ? <DeleteEvent event={event} /> : null}
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
        {!isPreview && <TabPane tab="Participants" key="3">
          <div style={{ width: "800px" }}>
            <InviteParticipants invites={invitedUsers} eventId={get(event,'id')} />
          </div>
        </TabPane>}
      </Tabs>
    </div>
  );
};

export default EventContainer;
