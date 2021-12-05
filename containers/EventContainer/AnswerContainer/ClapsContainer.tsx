import { Card, notification } from "antd";
import React, { useEffect, useState } from "react";
import ClapEmoji from "../../../components/ClapEmoji";
import get from "lodash/get";
import { Avatar, Divider, Tooltip } from "antd";
import { UserOutlined, AntDesignOutlined } from "@ant-design/icons";
import styles from "./ClapsContainer.module.scss";

const ClapsContainer = ({ question, canClap }) => {
  const [claps, setClaps] = useState(0);
  const [clappedBy, setClappedBy] = useState([]);

  useEffect(() => {
    setClaps(get(question, "answer.totalClaps", 0));
    clapsGivenBy();
  }, [question]);

  const clapsGivenBy = async () => {
    const answer = get(question, "answer", null);
    try {
      const resp = await fetch(`/api/answer/${answer.id}/appreciate`);
      const result = await resp.json();
      const { appreciatedBy } = result;
      setClappedBy(appreciatedBy);
    } catch (e) {
      console.log(e);
    }
  };
  const handleClap = async (question) => {
    const answer = get(question, "answer", null);
    try {
      setClaps(claps + 1);
      const response = await fetch(`/api/answer/clap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answerId: answer.id }),
      });
      const data = await response.json();
      if (!response.ok) {
        const message = get(data, "message");
        console.log(message);
        notification.error({
          message: message,
        });
        return;
      }
    } catch (error) {
      console.log(error);
      setClaps(claps - 1);
    }
  };

  return (
    <Card
      title={
        canClap
          ? "Appreciate Your Team Members"
          : `Awesome!! Received ${claps} 👏 Claps`
      }
      extra={
        canClap ? (
          <ClapEmoji count={claps} onClick={() => handleClap(question)} />
        ) : null
      }
      className={styles.clapsContainer}
    >
      <div></div>
      <div>
        <h4> Claps Received From </h4>
        <Avatar.Group>
          <Tooltip title="Participation Claps" placement="top">
            <Avatar
              style={{ backgroundColor: "#87d068" }}
              icon={<UserOutlined />}
            />
          </Tooltip>
          {clappedBy.map((c) =>
            c ? <Avatar src={c} /> : <Avatar icon={<UserOutlined />} />
          )}
        </Avatar.Group>
      </div>
    </Card>
  );
};

export default ClapsContainer;
