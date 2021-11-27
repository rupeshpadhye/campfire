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
};

type QuestionProps = {
  question: any;
  handleEdit?: (any) => void;
  handleDelete?: (any) => void;
  hideActionButton?: boolean;
  index: number;
};

export const QuestionCard = ({
  question,
  handleEdit,
  handleDelete,
  hideActionButton,
  index,
}: QuestionProps) => {
  const [showDescQuestionId, setShowDescQuestionId] = useState(null);

  return (
    <Card
      className={styles.questionCards}
      title={
        <div>
          <h2>🔮 {question.title}</h2>
          <div style={{ color: "gray" }}>
            {" "}
            <ClapEmoji count={question.claps} /> On Completing Task{" "}
          </div>
        </div>
      }
      key={index}
      actions={[
        hideActionButton ? (
          <Button type="primary" icon={<VideoCameraFilled />}>
            Answer
          </Button>
        ) : (
          <div>
            <Button
              danger
              type="dashed"
              style={{ marginRight: "8px" }}
              onClick={() => handleDelete(question)}
              disabled={!question.id}
              icon={<DeleteOutlined />}
            >
              Edit
            </Button>
            <Button
              type="dashed"
              onClick={() => handleEdit(question)}
              disabled={!question.id}
              icon={<EditOutlined />}
            >
              Delete
            </Button>
          </div>
        ),
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
}) => {
  return questions.map((question, index) => {
    return (
      <QuestionCard
        question={question}
        index={index}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        hideActionButton={hideActionButton}
      />
    );
  });
};

export default QuestionCards;
