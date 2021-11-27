import { Button } from "antd";
import React from "react";
import styles from "./ClapEmoji.module.scss";

type Props = {
  count: number;
  onClick?: () => void;
};
const ClapEmoji: React.FC<Props> = ({ count, onClick }) => {
  return (
    <Button className={styles.clapsCircle} onClick={onClick} >
       👏  <span style={{ paddingLeft: "8px" }}> {count} </span>
    </Button>
  );
};

export default ClapEmoji;
