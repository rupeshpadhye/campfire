import React from "react";
import { Form, Input, InputNumber, Button, Modal } from "antd";
import { signIn } from "next-auth/client";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const UserRegister = ({ onSubmit, saving }) => {
  const [form] = Form.useForm();
  return (
    <Form onFinish={onSubmit} layout="vertical" form={form}>
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: "Please Add Your Name" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[{ type: "email", message: "Please Input Valid Email" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="company"
        label="Company Name"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      {/* <Form.Item name={['user', 'website']} label="Company Size">
        <Input />
      </Form.Item>
       */}
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type="primary" htmlType="submit" loading={saving}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};



const RegisterCreator = ({ visible, setVisible }) => {
  const [saving , setSaving] = React.useState(false);
  const registerUser =  async (values) => { 
   
    try {
    const resp = await fetch(
        `/api/register`,{
        method: "POST", 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({info : values}),
      }).then(res => res.json());
      console.log(resp);  
      await signIn('email', { email: values.email });
      setVisible(false);
      setSaving(false);
   }
    catch(e) {
      console.log(e);
    }

  };
  const handleSubmit = (values) => {
    setSaving(true);
    registerUser(values);
    console.log(values);
    setVisible(false);
  };
  return (
    <Modal visible={visible} onCancel={() => setVisible(false)} footer={null}>
      <UserRegister onSubmit={handleSubmit}  saving={saving}/>
    </Modal>
  );
};

export default RegisterCreator;