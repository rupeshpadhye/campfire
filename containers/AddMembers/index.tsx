import React, { useRef, useState } from "react";
import {
  Avatar,
  List,
  Tag,
  Button,
  Card,
  notification,
  Modal,
  Form,
  Input,
} from "antd";
import { useRouter } from "next/router";
import { User } from "../../types";

type memberProps = {
  members: User[];
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
}) => {
  const [form] = Form.useForm();
  const saveInputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [invites, setInvites] = useState([]);

  const handleSubmit = () => {
    console.log("handleSubmit", invites);
    onSubmit(invites);
    form.resetFields();
    setInputValue("");
  };
  const removeInvite = (email) => {
    const newInvites = invites.filter((invite) => invite !== email);
    setInvites(newInvites);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    let inviteTemp = [...invites];
    if (inputValue && invites.indexOf(inputValue) === -1) {
      inviteTemp = [...invites, inputValue];
    }
    setInvites(inviteTemp);
    setInputValue("");
  };

  return (
    <Modal
      visible={showInviteModal}
      title="Add Members"
      footer={
        <div>
          <Button type="primary" htmlType="submit" loading={saving} onClick={handleSubmit}>
            {saving ? "Sending Invites" : `Send(${invites.length}) Invite`}
          </Button>
        </div>
      }
      onCancel={() => setShowInviteModal(false)}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          name="title"
          label="Type Email Address And Press Enter"
          rules={[
            {
              required: false,
              message: "Please type email address e.g. abc@gmail.com",
              whitespace: true,
            },
            { type: "email", message: "The input is not valid E-mail!" },
          ]}
        >
          <Input
            ref={saveInputRef}
            type="text"
            size="small"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
          />
        </Form.Item>
        {invites.map((i) => (
          <InviteItemTag key={i} email={i} handleClose={removeInvite} />
        ))}
      </Form>
    </Modal>
  );
};

const AddMembers: React.FC<memberProps> = ({ members }) => {
  const [showInviteModal, setShowInviteModal] = React.useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const [ inviteData, setInviteData ] = useState(members);


  const handleRemoveInvite = async (invite) => {
    const { id } = invite;
    try {
      await fetch(`/api/members/${id}`, {
        method: "DELETE",
      }).then((res) => res.json());
      notification.info({
        message: "Members Removed From The Platform",
      });
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Error Removing Member.",
      });
    }
  };

  const handleAddInvites = async (invites) =>  {
    try {

    setSaving(true);
    const resp = await fetch(
        `/api/members`,{
        method: "POST", 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ members:invites}),
      }).then(res => res.json());  
      setSaving(false);
      setShowInviteModal(false);
      console.log(resp);
      setInviteData(resp);
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
      />
      <div>
        <Button
          onClick={() => {
            setShowInviteModal(true);
          }}
          type="primary"
          style={{ marginBottom: "10px" }}
        >
          Add Members
        </Button>
      </div>
      <Card>
        <List
          itemLayout="horizontal"
          dataSource={inviteData}
          locale={{ emptyText: "Add Members" }}
          renderItem={(i) => {
            return (
              <List.Item key={i.id}>
                <List.Item.Meta
                  avatar={<Avatar>{i.email.charAt(0).toUpperCase()}</Avatar>}
                  title={i.email}
                />
                <Tag color={i.emailVerified ?  "green": "magenta" }>
                  {i.emailVerified ? "Email Verified" : "Not Verified"}
                </Tag>
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

export default AddMembers;
