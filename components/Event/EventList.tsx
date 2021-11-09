import React from "react";
import { Card, Row, Col, Image } from "antd";

import Link from "next/link";

import styles from "./Event.module.scss";

const { Meta } = Card;

const EventsList = ({ events, isPreview, title, desc }) => {
  return (
    <div className={styles.eventsContainer}>
      <h1>{title}</h1>
      <p>{desc}</p>
      <Row gutter={[16, 16]}>
        {events.map((event) => {
          return (
            <Col span={4} key={event.id}>
              <Link href={isPreview ? `/dashboard/template/${event.id}` : `/events/${event.id}`}>
                <Card
                  hoverable
                  className={styles.eventCard}
                  style={{ width: 240 }}
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
                        <div>
                          <p>
                            Published : <b>{event.published ? "Yes" : "No"}</b>
                          </p>
                          <p>
                            Expired :{" "}
                            <b>
                              {new Date(event.expiresAt) >= new Date()
                                ? "Yes"
                                : "No"}
                            </b>
                          </p>
                        </div>
                      )
                    }
                  />
                </Card>
              </Link>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default EventsList;
