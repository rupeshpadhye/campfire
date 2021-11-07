import React from 'react';
import animationData from "../../lotties/campfire.json";
import Lottie from "react-lottie";
import styles from './Logo.module.scss';

const Logo = ({ motion = false, size='small' }) => {
    const logoOptions = {
        loop: motion,
        autoplay: motion,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      };
      
    return(
        <div className={`logo ${styles[size]}`}> 
             <Lottie options={logoOptions} />
        </div>);
}

export default Logo;