import { Badge, Button } from "antd";
import React, { Suspense, useMemo, useState} from "react";



import styles from "./ClapEmoji.module.scss";


const random = (min, max) => Math.floor(Math.random() * (max - min) + min)

type Props = {
  count: number;
  onClick?: () => void;
};
const ClapEmoji: React.FC<Props> = ({ count, onClick}) => {
  const [animateClap, setAnimateClap] = useState(false);
  const handleClick = () => {
    onClick();
    setAnimateClap(true);
    setTimeout(() => {
      setAnimateClap(false);
    },300);
  };
  return (
    <>
    { animateClap ? <span className={styles.wave}>👏 </span> : null}
    { onClick ? <Button  className={styles.clapsCircle} onClick={handleClick} >
       👏  <span style={{ paddingLeft: "8px" }}> {count} </span>
    </Button> : 
    <div>
      <span className={styles.clapsCircle}>👏</span>
      <span style={{ paddingLeft: "8px" }}> {count} </span>
    </div>}
    </>
  );
};

export default ClapEmoji;
