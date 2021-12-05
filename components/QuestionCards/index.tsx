import React, {  useState } from "react";
import { Card } from "antd";
import {  Button } from "antd";
import styles from "./QuestionCards.module.scss";
import {
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

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
         <span className={styles.emoji}>🔮</span>  {question.title}
        </div>
      }
      key={index}
      actions={question.id ? [
          <div>
            <Button
              danger
              type="dashed"
              style={{ marginRight: "8px" }}
              onClick={() => handleDelete(question)}
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
            <Button
              type="dashed"
              onClick={() => handleEdit(question)}
              icon={<EditOutlined />}
            >
              Edit
            </Button>
          </div>
      ]: null}
      extra={
        question.id ? <div>
          <Button
            type="text"
            onClick={() =>
              setShowDescQuestionId(showDescQuestionId ? null : question.id)
            }
          >
            {showDescQuestionId === question.id ? "Hide Info" : "View  More"}
          </Button>
        </div> : null
      }
    >
      {showDescQuestionId === question.id || !question.id ? (
        <div>
          <div>
            {question.desc ? (
              <div dangerouslySetInnerHTML={{ __html: question.desc }}></div>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : null}
       <div style={{ color: "gray", textAlign: 'right' }}>
            {" "}
            {question.claps} <span className={styles.emoji}>👏 </span> on completion
          </div>
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
