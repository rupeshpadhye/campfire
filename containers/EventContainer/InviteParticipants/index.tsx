import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  List,
  Tag,
  Button,
  Card,
  notification,
  Modal,
  Form,
  Select,
  Alert,
  Spin,
} from "antd";
import { Router, useRouter } from "next/router";
import { User } from "../../../types";

import differenceBy from 'lodash/differenceBy';
const { Option } = Select;

type inviteProps = {
    invites: User[];
    eventId: number;
};

const InviteItemTag = ({ email, handleClose }) => {
  return (
    <span key={email} style={{ display: "inline-block" }}>
      <Tag
        closable
        onClose={(e) => {
          e.preventDefault();
          handleClose(email);
        }}
      >
        {email}
      </Tag>
    </span>
  );
};

const InviteForm = ({
  onSubmit,
  saving,
  setShowInviteModal,
  showInviteModal,
  invites,
}) => {
  const [form] = Form.useForm();
  const [ members, setMembers ] = useState([]);
  const [ loading , setLoading ] = useState(false);
  const [ error, setError ] = useState(null);
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/members");
      const members = await res.json();
      const inviteMembers = differenceBy(members,invites,'email');
      if(inviteMembers.length){
        setMembers(inviteMembers);
        setLoading(false);
      } else {
        setError('All members are invited.')
      }

    } catch(e) {
      console.log(e);
      setLoading(false);
    }
 
  }
 useEffect(() => {
   if(setShowInviteModal && members.length <= 0) {
     fetchMembers();
   }
  
 }, [setShowInviteModal])

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      form.resetFields();
    })
  };


  return (
    <Modal
      visible={showInviteModal}
      title="Invite Members"
      footer={
        <div>
          <Button 
            type="primary" 
            htmlType="submit"
            loading={saving} 
            onClick={handleSubmit} 
            disabled={loading}>
            {saving ? "Sending Invites" : `Send Invite`}
          </Button>
        </div>
      }
      onCancel={() => setShowInviteModal(false)}
    >
      { error && <Alert type="info" showIcon message={error} style={{ marginBottom: '16px'}} /> }
      { loading && !error ? <Spin/> :<Form layout="vertical" form={form} >
      <Form.Item name="invites" label="Add Team Member" rules={[{ required: true }]}>
          <Select
            placeholder="Add team members."
            allowClear
            mode="multiple"
            disabled={loading}
          >
           { members.map((member) => (<Option key={member.id} value={member.id}>
             <div>
                <Avatar src={member.avatar}/>
                <span style={{ marginLeft: "10px" }}>{member.name || member.email}</span>    
             </div>
            </Option>))}
          </Select>
        </Form.Item>
      </Form>}
    </Modal>
  );
};

const InviteParticipants: React.FC<inviteProps> = ({ invites, eventId }) => {
  const [showInviteModal, setShowInviteModal] = React.useState(false);
  const [saving, setSaving] = useState(false);
  const [ inviteData, setInviteData ] = useState(invites);


  const handleRemoveInvite = async (invite) => {
    const { id } = invite;
    try {
      await fetch(`/api/members/${id}`, {
        method: "DELETE",
      }).then((res) => res.json());
      notification.info({
        message: "Members Removed From The Platform",
      });
      setInviteData(inviteData.filter((i) => i.id !== id));
    
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Error Deleting Member.",
      });
    }
  };

  const handleAddInvites = async (values) =>  {
    try {
    setSaving(true);
    const resp = await fetch(
        `/api/event/invites`,{
        method: "POST", 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, eventId}),
      }).then(res => res.json());  
      setSaving(false);
      setShowInviteModal(false);
      const { invites } = values;
      setInviteData([...inviteData, ...invites]);
   }
    catch(e) {
      console.log(e);
    }
    finally{
      setSaving(false);
    }
  }

  const removeInvite = (invite) => {
    handleRemoveInvite(invite);
  };

  const handleSubmit = (invite) => {
    console.log(invite);
    handleAddInvites(invite);
  };

  return (
    <div>
      <InviteForm
        showInviteModal={showInviteModal}
        onSubmit={handleSubmit}
        saving={saving}
        setShowInviteModal={setShowInviteModal}
        invites={inviteData}
      />
      <div>
        <Button
          onClick={() => {
            setShowInviteModal(true);
          }}
          type="primary"
          style={{ marginBottom: "10px" }}
        >
          Add Participants
        </Button>
      </div>
      <Card>
        <List
          itemLayout="horizontal"
          dataSource={inviteData}
          locale={{ emptyText: "participants are not added in this activity" }}
          renderItem={(i) => {
            return (
              <List.Item key={i.id}>
                <List.Item.Meta
                  avatar={<Avatar>{i.email.charAt(0).toUpperCase()}</Avatar>}
                  title={i.email}
                />
                <Button danger type="link" onClick={() => removeInvite(i)}>
                  Remove
                </Button>
              </List.Item>
            );
          }}
        />
      </Card>
    </div>
  );
};

export default InviteParticipants;
