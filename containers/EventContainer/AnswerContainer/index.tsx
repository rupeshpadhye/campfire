import React, { useEffect, useState } from "react";
import { Card, Modal, notification, Tabs, Tooltip } from "antd";
import { Form, Button, Input } from "antd";

import styles from "./AnswerContainer.module.scss";
import { DeleteOutlined, VideoCameraFilled } from "@ant-design/icons";
import get from "lodash/get";
import LoomRecordButton from "../../../components/Video/RecordButton";
import ClapEmoji from "../../../components/ClapEmoji";
import VideoPreview from "../../../components/Video/VideoPreview";
import Plane from "../../../components/Loading/Plane";

type QuestionProps = {
  question: any;
  handleAnswer?: (question: any, answer: any) => void;
  handleDelete?: (any) => void;
  index: number;
};

export const QuestionAnswerCard = ({
  question,
  index,
  handleAnswer,
  handleDelete,
}: QuestionProps) => {
  const [showDescQuestionId, setShowDescQuestionId] = useState(null);
  const answer = get(question, "answer", null);
  return (
    <Card
      className={styles.questionCards}
      title={
        <div>
          <h2>🔮 {question.title}</h2>
        </div>
      }
      key={index}
      actions={[
        <div>
          <LoomRecordButton
            btnLabel={answer ? "Submit Again" : "Answer"}
            type={answer ? "default" : "primary"}
            icon={<VideoCameraFilled />}
            onInsertClicked={(videoData) => {
              handleAnswer(question, { ...answer, videoData });
            }}
          />
        </div>,
      ]}
      extra={
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
        </div>
      }
    >
      {showDescQuestionId === question.id ? (
        <div>
          <b>Description</b>

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
          <div>
            <p className={styles.answerLabels}>Total Earned Claps</p>
            <ClapEmoji
              onClick={() => {}}
              count={get(question, "answer.clapCount", question.claps)}
            />
          </div>
          <p className={styles.answerLabels} style={{ marginTop: "8px" }}>
            Your Answer
          </p>
          <VideoPreview videoData={answer.videoData} />
        </>
      ) : null}
    </Card>
  );
};

const AnswerContainer = ({ questions, userAnswers }) => {
  const [userQuestionsAnswers, setUserQuestionsAnswers] = React.useState([]);
  const [ saving , setSaving ] = useState(false);
  useEffect(() => {
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
  }, [event, userAnswers]);

  const submitAnswer = async ({ question, answer }) => {
    const { id: questionId } = question;
    const answerId = get(answer, "id", null);
    if (!questionId) {
      return;
    }
    setSaving(true);
    try {
      const resp = await fetch(
        answerId ? `/api/answer/${answerId}` : `/api/answer`,
        {
          method: answerId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answer, questionId }),
        }
      ).then((res) => res.json());
      const questionIndex = userQuestionsAnswers.findIndex(
        (q) => q.id === questionId
      );
      userQuestionsAnswers[questionIndex].answer = resp;
      setUserQuestionsAnswers([...userQuestionsAnswers]);
      setSaving(false);
    } catch (e) {
      console.log(e);
      setSaving(false);
    }
  };
  const deleteAnswer = async (answer) => {
    const { id } = answer;
    console.log(id, 'deletingAnswer');
    try {
      setSaving(true);
      await fetch(`/api/answer/${id}`, {
        method: "DELETE",
      }).then((res) => res.json());
      const newQuestions = userQuestionsAnswers.map((question) => {
        return question.id === answer.questionId
          ? { ...question, answer: null }
          : question;
      });
      setUserQuestionsAnswers([...newQuestions]);
      notification.success({
        message: "Answer Removed.",
      });
      setSaving(false);
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Error Deleting Answer.",
      });
      setSaving(false);

    }
  };

  const onAnswerDeleted = (answer) => {
    deleteAnswer(answer);
  };

  const onAnswerSubmitted = (question, answer) => {
    submitAnswer({ question, answer });
  };

 

  return (
    <>
      <Modal visible={true} footer={null} closable={false} maskClosable={false} >
           <Plane/>
            <h3 style={{textAlign: 'center'}}> Processing Your Request... </h3>
       </Modal>   
      {userQuestionsAnswers.map((question, index) => {
        return (
            <QuestionAnswerCard
              index={index}
              question={question}
              key={index}
              handleAnswer={onAnswerSubmitted}
              handleDelete={onAnswerDeleted}
            />
        );
      })}
    </>
  );
};

export default AnswerContainer;
