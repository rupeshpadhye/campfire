import React, { useEffect, useState } from "react";
import { Card, Modal, notification, Tabs } from "antd";
import { Form, Button, Input } from "antd";

import QuestionCards from "../../components/QuestionCards";

const QuestionForm = (props) => {
  const [form] = Form.useForm();
  const { question= {}, onSuccess } = props;
  const handleFinish = (values) => { 
    onSuccess({...question,...values});
  }
  return (
    <div>
      <Form
        onFinish={handleFinish}
        layout="vertical"
        form={form}
        initialValues={question}
      >
        <Form.Item
          name="title"
          label="Question"
          rules={[
            {
              required: true,
              message: "Please input question",
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="desc"
          label="Description"
        >
          <Input.TextArea showCount maxLength={500} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 20 }}>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};



const QuestionFormContainer = ({ 
  event,
  setEventData,
}) => {
  const { id, questions, ...other } = event || { questions: [] };
  const [showQuestionModal ,setShowQuestionModal] = useState(false);
  const [editQuestion, setEditQuestion] = useState(null);

  const handleDeleteQuestion = async (question) =>  { 
    const { id:eventId } = event;
    const { id } = question;
    try {
    await fetch(`/api/question/${id}?eventId=${eventId}`, {
          method: "DELETE",
        }).then(res => res.json());
    const { questions } = event;
    const newQuestions = questions.filter(q => q.id !== id);
    setEventData({...event, questions: newQuestions});
    notification.success({
      message: 'Question Removed.',
    });
    } catch (error) {
        console.log(error);
        notification.error({
          message: 'Error Deleting Question.',
        });
    }
  }

  const handleEditQuestion = async (question) =>  {
    const { id: eventId } = event;
    const { id: questionId } = question;
    try {
    const resp = await fetch(
        `/api/question/${questionId|| ''}?eventId=${eventId}`,{
        method: questionId ? "PUT" : "POST", 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({question}),
      }).then(res => res.json());  
      const { id } = resp;
      const { questions } = event;
      const index = questions.findIndex(q => q.id === id);
      if(index > -1) {
        questions[index] = resp;
        setEventData({...event, questions});
      } else {
        const newQuestions = [resp,...questions];
        setEventData({...event, questions: newQuestions});
      }
      notification.success({
        message: questionId ? 'Question Updated.' : 'New Question Added.',
      });
   }
    catch(e) {
      console.log(e);
    }
  }

  const creteNewQuestion = () => { 
    setEditQuestion(null);
    setShowQuestionModal(true);
  }
  const handleQuestionDelete = (q) => {
    handleDeleteQuestion(q);
  }
  const handleQuestionEdit = (question) => {
    setShowQuestionModal(false);
    setEditQuestion(question);
    setShowQuestionModal(true);
  }
  const handleEdiModalSave = (question) => {
    setShowQuestionModal(false);
    handleEditQuestion(question);
  }
  return (
    <>
    <Modal 
    visible={showQuestionModal}
    forceRender={true}
    title={
      editQuestion ? `Edit Question`: 'Add New Question'
    }
    footer={null}
    onCancel={() => setShowQuestionModal(false)}
    >
     <QuestionForm question={editQuestion} onSuccess={handleEdiModalSave}/>
    </Modal>
    <Card bordered={false} title='Add New Question' extra={<div><Button type='primary' onClick={creteNewQuestion}>New Question</Button></div>}>
      <QuestionCards questions={questions} handleEdit={handleQuestionEdit} handleDelete={handleQuestionDelete}/>
    </Card>
    </>
  );
};

export default QuestionFormContainer;
