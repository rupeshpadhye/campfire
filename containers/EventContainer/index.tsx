import React, { useEffect } from "react";

import { Card, Tabs, Switch } from "antd";
import DeleteEvent from "./DeleteEvent";
import EventInformationForm from "./EventInformationForm";
import QuestionFormContainer from "./QuestionFormContainer";
import get from 'lodash/get';
import map from 'lodash/map';
import CopyEventTemplate from "./CopyEvenetTemplate";
import InviteParticipants from "./InviteParticipants";
import ResponsesContainer from "./ResponsesContainer";
import EventPublishContainer from "./EventPublishContainer";
import DatesContainer from "./EventPublishContainer/DatesContainer";

import styles from "./EventContainer.module.scss";

const { TabPane } = Tabs;

type Props = {
  event : any,
  setEventData?: (any) => void
}

const EventContainer: React.FC<Props> = ({ event, setEventData }) => {
  const id = get(event, "id");
  const isPreview = get(event, "type") === 'template';
  const invitedUsers = map(get(event,'invites', []), e => {
    return e.user;
  });
  return (
    <div className={styles.container}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Information" key="1">
          <div className={styles.centerPane}>
          <Card >
            <EventInformationForm event={event} isPreview={isPreview} />
          </Card>
          </div>
        </TabPane>
        {id && (
          <TabPane tab="Tasks" key="2">
            <div className={styles.centerPane}>
              <QuestionFormContainer
                event={event}
                setEventData={setEventData}
                isPreview={isPreview}
              />
            </div>
          </TabPane>
        )}
        <TabPane tab="Participants" key="3">
          <div className={styles.centerPane}>
            <InviteParticipants invites={invitedUsers} eventId={get(event,'id')} isPreview={isPreview}  />
          </div>
        </TabPane>
        <TabPane tab="Responses" key="4" >
          <div> 
           <ResponsesContainer  eventId={get(event,'id')} />
          </div>
        </TabPane>
        <TabPane tab="Settings" key="5">
          <div className={styles.centerPane}> 
          {!isPreview ? (
            <>
              <div className={styles.marginBottom}>
                <DatesContainer event={event}/>
              </div>
              <div className={styles.marginBottom}>
                <EventPublishContainer event={event}/>
              </div>
              <div>
                <DeleteEvent event={event} />
              </div>
            </>
          ) : null}
          {isPreview ? <CopyEventTemplate event={event}/> : null }
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default EventContainer;
