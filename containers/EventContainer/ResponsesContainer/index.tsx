import { Col, Row, List, Avatar, Button, Carousel } from "antd";
import React, { useEffect } from "react";
import useSWR, { useSWRConfig } from "swr";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

import styles from "./ResponseContainer.module.scss";
import { QuestionAnswerCard } from "../AnswerContainer";
import { ArrowRightOutlined } from "@ant-design/icons";
import Responses from './../../../public/response.svg';
import NoData from './../../../public/no_data.svg';

import CampFire from "../../../components/Loading/CampFire";
import ClapsContainer from "../AnswerContainer/ClapsContainer";

const ResponsesContainer = ({ eventId }) => {
  const { fetcher } = useSWRConfig();
  const { data, error } = useSWR(`/api/event/responses/${eventId}`, fetcher);
  const responses = get(data, "responses", []);
  const [userResponses, setUserResponses] = React.useState([]);
  if(!data) {
    return <CampFire/>
  }
  else if(!responses.length){ 
      return <div className={styles.noDataSvg} ><NoData/><h3>No Responses </h3></div>
  }

  return (
    <div className={styles.container}>
      <Row>
        <Col md={8}>
          <List
            loading={isEmpty(responses)}
            itemLayout="horizontal"
            dataSource={responses}
            renderItem={(item) => {
              const user = get(item, "user");
              return (
                <List.Item
                  onClick={() => {
                    setUserResponses(get(item, "responses"));
                  }}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={user.image} />}
                    title={user.name}
                  />
                  <Button
                    type="text"
                    icon={<ArrowRightOutlined />}
                    size="small"
                  />
                </List.Item>
              );
            }}
          />
        </Col>
        <Col md={16} className={styles.responseContainer}>
            {!isEmpty(userResponses) ? (
              <>
               <Carousel className={styles.responseCarousel} swipeToSlide draggable>
                {userResponses.map((question, index) => {
                  return (
                    <QuestionAnswerCard
                      index={index}
                      question={question}
                      key={index}
                      handleAnswer={() => {}}
                      handleDelete={() => {}}
                      preview={true}
                      clapsContainer={<ClapsContainer question={question} canClap={true} />}
                    />
                  );
                })}
              </Carousel>
              </>
            ) :<>
                <Responses/>
             </>}
        </Col>
      </Row>
    </div>
  );
};

export default ResponsesContainer;
