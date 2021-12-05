import React from "react";
import { Card, Row, Col, Image, Badge, Tag } from "antd";

import Link from "next/link";

import styles from "./Event.module.scss";
import { CheckCircleOutlined, ClockCircleTwoTone } from "@ant-design/icons";
import moment from "moment";

const { Meta } = Card;

const EventsList = ({ events, isPreview, title, desc, module = "events" }) => {
  const getRibbonProps = (event) => {
    if (event.type === "template") {
      return {
        color: "blue",
        text: "Template",
      };
    }
    else if(!event.published) {
      return {
         text: 'Unpublished',
         color: 'orange'
      }
    }
    if (
      event.votingStartsAt &&
      moment().isBetween(
        moment(event.votingStartsAt),
        moment(event.votingEndsAt),
        "days",
        "[]"
      )
    ) {
      return {
        color: "cyan",
        text: "Vote Now!",
      };
    }
  
    return event.published
      ? {
          color: "#52c41a",
          text: "Active",
        }
      : null;
  };
  const getDatesInfo = (event) => {
    if (
      moment().isBetween(
        moment(event.votingStartsAt),
        moment(event.votingEndsAt),
        "days",
        "[]"
      )
    ) {
      return `Voting   ${moment(event.votingStartsAt).format("DD.MM.YYYY")}`;
    }
      return (
        <div>
          Event Ending At:
          <div style={{ margin: "4px 0px" }}>
          { event.expiresAt ? <Tag color="processing" icon={<ClockCircleTwoTone />}>{`${moment(
              event.expiresAt
            ).format("DD MMM YYYY")}`}</Tag> : 'N/A' }
          </div>
        </div>
      );
  };
  return (
    <div className={styles.eventsContainer}>
      <h1>{title}</h1>
      <p>{desc}</p>
      <Row gutter={[16, 16]}>
        {events.map((event) => {

          return (
            <Col md={4} xs={24}  key={event.id}>
              <Badge.Ribbon {...getRibbonProps(event)}>
                <Link
                  href={
                    isPreview
                      ? `${module}/template/${event.id}`
                      : `/events/${event.id}`
                  }
                >
                  <Card
                    hoverable
                    className={styles.eventCard}
                    key={event.id}
                    cover={
                      <Image
                        className={styles.antImage}
                        src={
                          event.headerImage ||
                          "https://cdn.pixabay.com/photo/2017/07/21/23/57/concert-2527495__340.jpg"
                        }
                        preview={false}
                      />
                    }
                  >
                    <Meta
                      title={event.title}
                      description={
                        isPreview ? (
                          <div>Click on card preview template</div>
                        ) : (
                          <div>{getDatesInfo(event)}</div>
                        )
                      }
                    />
                  </Card>
                </Link>
              </Badge.Ribbon>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default EventsList;
