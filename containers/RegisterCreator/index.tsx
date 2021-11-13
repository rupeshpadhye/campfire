import React from "react";
import { Form, Input, InputNumber, Button, Modal, notification } from "antd";
import { signIn } from "next-auth/client";
import Logo from "../../components/Logo";
import get from 'lodash/get';
import styles from './RegisterCreator.module.scss';
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const UserRegister = ({ onSubmit, saving }) => {
  const [form] = Form.useForm();

  const handleFormSubmit = (event) => {
    event.preventDefault();
		form.validateFields()
			.then((values) => {
				onSubmit(values);
			})
			.catch((errorInfo) => {
        console.log(errorInfo);
      });
	}

  return (
    <Form layout="vertical" form={form}>
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
        rules={[{ required: true, type: "email", message: "Please Input Valid Email" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="company"
        label="Company Name"
        rules={[{ required: true, message: "Please Add Your Company Name" }]}
      >
        <Input />
      </Form.Item>
      {/* <Form.Item name={['user', 'website']} label="Company Size">
        <Input />
      </Form.Item>
       */}
      <Form.Item>
        <Button type="primary" onClick={handleFormSubmit} loading={saving} className={styles.registerBtn}>
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};



const RegisterCreator = ({ visible, setVisible, plan }) => {
  const [saving , setSaving] = React.useState(false);
  const registerUser =  async (values) => { 
   
    try {
    await fetch(
        `/api/register`,{
        method: "POST", 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({info : values, plan}),
      }).then(res => {
        if(res.status === 200){
          setSaving(false);
          notification.success({
            message: "You have successfully registered",
            description: "Please check your email to verify the account ",
          });
          signIn('email', { email: values.email }).then(() => {
            setVisible(false);
            setSaving(false);
    
          });
        } else {
          setSaving(false);
          notification.error({
            message: "Error",
            description: get(res, 'data.message', 'Something went wrong'),
          });
        }
        return  res.json();
      });
   }
    catch(e) {
      console.log(e);
      notification.error({
        message: "Failed to register.",
      });
      setSaving(false);
    }
  
  };
  const handleSubmit = (values) => {
    setSaving(true);
    registerUser(values);
    console.log(values);
  };
  return (
    <Modal 
      visible={visible} 
      onCancel={() => setVisible(false)} 
      maskClosable={false}
      footer={null}
      title={
        <div className={styles.modalTitle}>
          <Logo/> 
          <h1>Register</h1>
        </div>
      }
      >
      <UserRegister onSubmit={handleSubmit}  saving={saving}/>
    </Modal>
  );
};

export default RegisterCreator;