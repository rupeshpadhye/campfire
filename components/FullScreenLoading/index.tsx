import { Spin } from "antd";
import React from "react";
import CampFire from "../Loading/CampFire";
import styles from './FullScreenLoading.module.scss';

const FullScreenLoading: React.FC<{}> = ({}) => {

  return (
   <div className={styles.spin}>
        {/* <Spin/> */}
        <CampFire/>
   </div>
  )
};

export default FullScreenLoading;


