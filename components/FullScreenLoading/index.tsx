import { Spin } from "antd";
import React from "react";
import styles from './FullScreenLoading.module.scss';

const FullScreenLoading: React.FC<{}> = ({}) => {

  return (
   <div className={styles.spin}>
        <Spin/>
   </div>
  )
};

export default FullScreenLoading;


