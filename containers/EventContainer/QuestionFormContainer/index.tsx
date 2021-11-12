import React, { useEffect, useState } from "react";
import { Card, Modal, notification, Tabs } from "antd";
import { Form, Button, Input } from "antd";

import QuestionCards from "../../../components/QuestionCards";
import LoomRecordButton from "../../../components/Video/RecordButton";
import VideoPreview from "../../../components/Video/VideoPreview";

const QuestionForm = (props) => {
  const [form] = Form.useForm();
  const { question= {}, onSuccess, saving } = props;
  const [videoData, setVideoData] = useState(null);

  useEffect(() => { 
    form.setFieldsValue({
      ...question,
    });
  }, [question]);

  
  const handleFinish = (values) => { 
    onSuccess({...question,...values,videoData: videoData || question.videoData});
  }

  const handleInsertClicked = (videoData) => {
   setVideoData(videoData);
  }
  return (
    <div>
      <Form
        onFinish={handleFinish}
        layout="vertical"
        form={form}
        initialValues={{...question}}
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
          <Input  />
        </Form.Item>
        <Form.Item
          name="desc"
          label="You can add more description by recording a video."
        >
          <LoomRecordButton btnLabel='Record' onInsertClicked={handleInsertClicked}/>
          <VideoPreview videoData={videoData || (question && question.videoData)}/>
        </Form.Item>
        <Form.Item
          name="desc"
          label="Description"
        >
          <Input.TextArea showCount maxLength={500} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 20 }}>
          <Button type="primary" htmlType="submit" loading={saving}>
           {saving ? 'Saving': 'Save'} 
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};



const QuestionFormContainer = ({ 
  event,
  setEventData,
  isPreview,
}) => {
  const { id, questions } = event || { questions: [] };
  const [showQuestionModal ,setShowQuestionModal] = useState(false);
  const [editQuestion, setEditQuestion] = useState(null);
  const [saving, setSaving] = useState(false);

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
      setShowQuestionModal(false);
      setSaving(false);
   }
    catch(e) {
      console.log(e);
    }
  }

  const creteNewQuestion = () => { 
    setEditQuestion({});
    setShowQuestionModal(true);
  }
  const handleQuestionDelete = (q) => {
    handleDeleteQuestion(q);
  }
  const handleQuestionEdit = (question) => {
    console.log('editQuestion',editQuestion);
    setShowQuestionModal(false);
    setEditQuestion(question);
    setShowQuestionModal(true);
  }
  const handleEdiModalSave = (question) => {
    setSaving(true);
    handleEditQuestion(question);
  }
  return (
    <>
      <Modal
        visible={showQuestionModal}
        title={editQuestion ? `Edit Question` : "Add New Question"}
        forceRender={true}
        footer={null}
        onCancel={() => setShowQuestionModal(false)}
        maskClosable={false}
      >
        <QuestionForm
          question={editQuestion}
          onSuccess={handleEdiModalSave}
          saving={saving}
        />
      </Modal>
      <Card
        bordered={false}
        title="Add New Question"
        extra={
          <div>
            <Button type="primary" onClick={creteNewQuestion} disabled={isPreview}>
              New Question
            </Button>
          </div>
        }
      >
        <QuestionCards
          questions={questions}
          handleEdit={handleQuestionEdit}
          handleDelete={handleQuestionDelete}
        />
      </Card>
    </>
  );
};

export default QuestionFormContainer;
