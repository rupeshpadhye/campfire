import React, { useEffect, useState } from "react";
import { Card, Carousel, Modal, notification, Tabs, Tooltip } from "antd";
import { Form, Button, Input } from "antd";

import styles from "./AnswerContainer.module.scss";
import { DeleteOutlined, VideoCameraFilled } from "@ant-design/icons";
import get from "lodash/get";
import isEmpty from 'lodash/isEmpty';
import LoomRecordButton from "../../../components/Video/RecordButton";
import Prizes from "../../../components/Prizes";
import VideoPreview from "../../../components/Video/VideoPreview";
import Plane from "../../../components/Loading/Plane";
import Claps from "../../../components/Loading/Claps";
import UploadVideo from "./../../../public/uplod_video.svg";
import ClapsContainer from "./ClapsContainer";
type QuestionProps = {
  question: any;
  handleAnswer?: (question: any, answer: any) => void;
  handleDelete?: (any) => void;
  index: number;
  preview: boolean;
  clapsContainer?: React.ReactNode;
};



export const QuestionAnswerCard = ({
  question,
  index,
  handleAnswer,
  handleDelete,
  preview,
  clapsContainer,
}: QuestionProps) => {
  const [showDescQuestionId, setShowDescQuestionId] = useState(null);
  const answer = get(question, "answer", null);
  return (
    <Card
      className={styles.questionCards}
      title={
        <div>
          <p style={{ whiteSpace: 'break-spaces'}}>🔮 {question.title}</p>
        </div>
      }
      key={index}
      actions={
        preview || !isEmpty(answer) 
          ? null
          : [
              <div>
                <LoomRecordButton
                  btnLabel={answer ? "Submit Again" : "Answer"}
                  type={answer ? "default" : "primary"}
                  icon={<VideoCameraFilled />}
                  onInsertClicked={(videoData) => {
                    handleAnswer(question, { ...answer, videoData });
                  }}
                />
              </div>
            ]
      }
      extra={
        preview ? null : (
          <div>
            
            <Button
              type="text"
              onClick={() =>
                setShowDescQuestionId(showDescQuestionId ? null : question.id)
              }
              disabled={!question.id}
            >
              {showDescQuestionId === question.id ? "Hide Info" : "View  More"}
            </Button>
            {question.answer ? (
              <Tooltip title="Delete Answer">
                <Button
                  type="text"
                  style={{ marginRight: "4px" }}
                  danger={true}
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(question.answer)}
                  disabled={!question.answer}
                />
              </Tooltip>
            ) : null}
            {answer && 
               <LoomRecordButton
                 btnLabel={'Re Record'}
                 type={answer ? "text" : "primary"}
                 icon={<VideoCameraFilled />}
                 onInsertClicked={(videoData) => {
                   handleAnswer(question, { ...answer, videoData });
                 }}
               />
            }
          </div>
        )
      }
    >
     <p className={styles.clapMsg}>
        Complete This Task And Earn {question.claps} 👏{" "}
     </p>
      {showDescQuestionId === question.id ? (
        <div className={styles.desc}>
          Description
          <div>
            {question.desc ? (
              <div dangerouslySetInnerHTML={{ __html: question.desc }}></div>
            ) : (
              "N/A"
            )}
          </div>
        </div>
      ) : null}
      {answer ? (
        <>
          <VideoPreview videoData={answer.videoData} />
           {clapsContainer}
        </>
      ) : (
        <div>
          <div className={styles.uploadVideo}>
            <UploadVideo />
          </div>
        </div>
      )}
    </Card>
  );
};

const AnswerContainer = ({ questions, userAnswers, banner }) => {
  const [userQuestionsAnswers, setUserQuestionsAnswers] = React.useState([]);
  const [saving, setSaving] = useState(null);
  useEffect(() => {
    if(isEmpty(userQuestionsAnswers)) {
      const questionAnswers = questions.map((question) => {
        const answer = userAnswers.find(
          (answer) => answer.questionId === question.id
        );
        return {
          ...question,
          answer,
        };
      });
      setUserQuestionsAnswers(questionAnswers);
    }

  }, [event, userAnswers]);

  const submitAnswer = async ({ question, answer }) => {
    const { id: questionId } = question;
    const answerId = get(answer, "id", null);
    if (!questionId) {
      return;
    }
    setSaving("saving");
    try {
      const resp = await fetch(
        answerId ? `/api/answer/${answerId}` : `/api/answer`,
        {
          method: answerId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answer: {...answer,totalClaps: question.claps }, questionId }),
        }
      ).then((res) => res.json());
      const questionIndex = userQuestionsAnswers.findIndex(
        (q) => q.id === questionId
      );
      userQuestionsAnswers[questionIndex].answer = resp;
      setUserQuestionsAnswers([...userQuestionsAnswers]);
      if (!answerId) {
        setSaving("answeredNewQuestion");
      } else {
        setSaving(null);
      }
    } catch (e) {
      console.log(e);
      setSaving(null);
    }
  };
  const deleteAnswer = async (answer) => {
    const { id } = answer;
    try {
      setSaving("saving");
      await fetch(`/api/answer/${id}`, {
        method: "DELETE",
      }).then((res) => res.json());
      const newQuestions = userQuestionsAnswers.map((question) => {
        return question.id === answer.questionId
          ? { ...question, answer: null }
          : question;
      });
      setUserQuestionsAnswers([...newQuestions]);
      console.log('after delete',newQuestions);
      notification.success({
        message: "Answer Removed.",
      });
      setSaving(null);
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Error Deleting Answer.",
      });
      setSaving(null);
    }
  };

  const onAnswerDeleted = (answer) => {
    deleteAnswer(answer);
  };

  const onAnswerSubmitted = (question, answer) => {
    submitAnswer({ question, answer });
  };

  const closable = saving === "answeredNewQuestion";

  return (
    <>
      <Modal
        visible={!!saving}
        footer={null}
        closable={closable}
        maskClosable={closable}
        onCancel={() => setSaving(null)}
      >
        {saving === "saving" ? (
          <>
            {" "}
            <Plane />
            <h3 style={{ textAlign: "center" }}>
              {" "}
              Processing Your Request...{" "}
            </h3>
          </>
        ) : null}
        {saving === "answeredNewQuestion" ? (
          <>
            <Claps />
            <h3 style={{ textAlign: "center" }}>
              {" "}
              Congrats! You earned Participation Claps 🎉
            </h3>
          </>
        ) : null}
      </Modal>
      {banner ? banner : null}
      <Carousel>
        {userQuestionsAnswers.map((question, index) => {
          return (
            <QuestionAnswerCard
              index={index}
              question={question}
              key={index}
              handleAnswer={onAnswerSubmitted}
              handleDelete={onAnswerDeleted}
              preview={false}
              clapsContainer={<ClapsContainer question={question} canClap={false} />}
            />              
          );
        })}
      </Carousel>
    </>
  );
};

export default AnswerContainer;
