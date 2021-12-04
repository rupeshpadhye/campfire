import React, { useState } from "react";
import { Card, Checkbox, DatePicker, notification, Switch } from "antd";
import get from "lodash/get";
import moment from 'moment';

const DatesContainer = ({ event }) => {
  const id = event?.id;
  const [expiresAt, setExpiredAt] = React.useState(get(event, "expiresAt"));
  const [votingStartsAt, setVotingAt] = React.useState(get(event, "votingStartsAt"));
  const [votingEndsAt, setVotingEndsAt] = React.useState(get(event, "votingEndsAt"));
  const [ saving ,setSaving ] = useState(false);
  const { RangePicker } = DatePicker;
  const isForeverActive = get(event, "isForeverActive");

  const handleExpireAt = (date, dateString) => {
    setExpiredAt(dateString);
    updateEvent({ expiresAt: date });
  };

  const handleRange = (date, dateString) => {
    setVotingAt(dateString[0]);
    setVotingEndsAt(dateString[1]);
    updateEvent({ votingStartsAt: date[0], votingEndsAt: date[1] });
  };

  const updateEvent = async (data) => {
    try {
    setSaving(true);
    const response = await fetch(
      `/api/event/${id}`, {
      method: "PUT" ,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(response => response.json()); 
    notification.success({
      message: "Event Updated",
      description: "Event published successfully",
    });
   }
    catch (error) {
      notification.error({
        message: "Event Update Failed",
        description: "Event update failed",
      });
    } finally {
      setSaving(false);
    }
  };
  return id && !isForeverActive ? (
    <Card
      title= "Event Schedule"
      loading={saving}
    >
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px"
        }}>
        This event will be active till:
        <DatePicker defaultValue={moment()} onChange={handleExpireAt} value={expiresAt && moment(expiresAt) } />
        </div>
        <div style={{
            display: "flex",
            justifyContent: "space-between",
        }}>
        The Voting window will be active between:
        <RangePicker onChange={handleRange}
         defaultValue={[moment(), moment().add(2, 'days')]} 
         value={votingStartsAt ? [moment(votingStartsAt), moment(votingEndsAt)]: undefined} />
        </div>
    </Card>
  ) : null;
};

export default DatesContainer;
