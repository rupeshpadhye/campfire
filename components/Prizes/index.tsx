import { Card, Col, Row } from 'antd';
import React from 'react';
import Gift from './../../public/gift.svg'
import styles from './Prizes.module.scss';

const Prizes = () => {
    return (
        <Card className={styles.prizeCard}>
            <div>
             <h2>Exciting Gifts!</h2>
            <div className={styles.giftSvg}>
                <Gift/>
            </div>
             <div className={styles.giftText}>
                 Participants receiving maximum number of <span>👏 </span>  will be getting exciting prizes
             </div>
             </div>
        </Card>
    )
}

export default Prizes;