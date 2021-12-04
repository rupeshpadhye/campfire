import React, { useEffect, useState } from "react";
import { Card, Modal, Tabs } from "antd";
import { Form, Button, Input } from "antd";
import styles from "./QuestionCards.module.scss";
import {
  DeleteOutlined,
  EditOutlined,
  VideoCameraFilled,
} from "@ant-design/icons";
import ClapEmoji from "../ClapEmoji";

type Props = {
  questions: any;
  handleEdit?: (any) => void;
  handleDelete?: (any) => void;
  hideActionButton?: boolean;
  handleAnswer?: (any) => void;
};

type QuestionProps = {
  question: any;
  handleEdit?: (any) => void;
  handleDelete?: (any) => void;
  hideActionButton?: boolean;
  index: number;
  handleAnswer?: (question: any, answer: any) => void;
};



export const QuestionCard = ({
  question,
  handleEdit,
  handleDelete,
  index,
}: QuestionProps) => {
  const [showDescQuestionId, setShowDescQuestionId] = useState(null);

  return (
    <Card
      className={styles.questionCards}
      title={
        <div>
          <p>🔮 {question.title}</p>
          <p style={{ color: "gray" }}>
            {" "}
            {question.claps} 👏  on completing this task
          </p>
        </div>
      }
      key={index}
      actions={[
          <div>
            <Button
              danger
              type="dashed"
              style={{ marginRight: "8px" }}
              onClick={() => handleDelete(question)}
              disabled={!question.id}
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
            <Button
              type="dashed"
              onClick={() => handleEdit(question)}
              disabled={!question.id}
              icon={<EditOutlined />}
            >
              Edit
            </Button>
          </div>
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
    </Card>
  );
};

const QuestionCards: React.FC<Props> = ({
  questions,
  handleEdit,
  handleDelete,
  hideActionButton,
  handleAnswer,
}) => {
  return questions.map((question, index) => {
    return (
      <QuestionCard
        question={question}
        index={index}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        hideActionButton={hideActionButton}
        handleAnswer={handleAnswer}
      />
    );
  });
};

export default QuestionCards;
