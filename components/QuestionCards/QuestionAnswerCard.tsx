import React, { useEffect, useState } from "react";
import { Card, Modal, Tabs, Tooltip } from "antd";
import { Form, Button, Input } from "antd";

import styles from "./QuestionCards.module.scss";
import {
  DeleteOutlined,
  VideoCameraFilled,
} from "@ant-design/icons";
import ClapEmoji from "../ClapEmoji";
import get from "lodash/get";

import VideoPreview from "../Video/VideoPreview";
import LoomRecordButton from "../Video/RecordButton";


type QuestionProps = {
  question: any;
  handleAnswer?: (question:any, answer: any) => void;
  handleDelete?: (any) => void;
  index: number;
};


const QuestionAnswerCard = ({
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
          type={ answer ? "default" : 'primary' }
          icon={<VideoCameraFilled />}
          onInsertClicked={(videoData) => {
            handleAnswer(question, {...answer, videoData },);
          }}
        />
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
            <ClapEmoji onClick={()=>{}} count={get(question, "answer.clapCount", question.claps)} />
          </div>
           <p className={styles.answerLabels} style={{marginTop: '8px'}}>
             Your Answer
           </p>
            <VideoPreview videoData={answer.videoData} /> 
          </>

      ) : null}
    </Card>
  );
};




export default QuestionAnswerCard;
