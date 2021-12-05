import React, { useState  }  from "react";
import EventsList from "./EventList";
import OnlineParty from './../../public/online_party.svg';

import styles from './MemberView.module.scss';
import { Row, Card, Col, Image, Button } from "antd";

const { Meta } = Card;
import Link from "next/link";

const MemberView = ({ events = [] }) => {
   const [showEvents, setShowEvents] = useState(false);
    if(!events.length) {
       return <div className={styles.emptyState}> 
       <OnlineParty/> 
       <h1 className={styles.emptyStateText}>Hold on the excitement, Team will be creating new activities</h1>
       </div> 
    }
    return (
      <>
      { !showEvents ? <Row className={styles.memberEventsView}>
        <Col md={12} className={styles.memberViewSvg}>
          <OnlineParty/>
        </Col>
        <Col md={12} className={styles.eventsView}>
            <h2>Events</h2>
            <p>
              Participate in engaging and fun activities
            </p>
            <Button className={styles.eventBtn} onClick={()=> { setShowEvents(true)}}> View </Button>
        </Col>
      </Row> : null }
      {showEvents ?  <EventsList title="Events" desc=""  events={events} isPreview={false} /> : null    }
      </>
    );
  };

export default MemberView;