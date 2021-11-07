import React, { useEffect, useState } from "react";
import { Card, Modal, Tabs } from "antd";
import { Form, Button, Input } from "antd";

import styles from "./QuestionCards.module.scss";


const QuestionCards = ({ questions, handleEdit, handleDelete }) => {

  return questions.map((question, index) => {
    return (
      <Card
        className={styles.gutter}
        title={question.title}
        key={index}
        extra={
          <div>
          <Button danger 
           type='dashed'
          style={{marginRight: '8px'}}
          onClick={()=> handleDelete(question)}
          disabled={!question.id}
          >Delete</Button>
          <Button
            type='dashed'
            onClick={() => handleEdit(question)}
            disabled={!question.id}
          >
            Edit
          </Button>
          </div>
        }
      >
        <b>Description</b>
        <p>{question.desc ? question.desc : "N/A"}</p>
      </Card>
    );
  });
};

export default QuestionCards;