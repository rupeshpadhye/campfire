import { Card, Col, Row } from 'antd';
import React from 'react';
import Gift from './../../public/team_gift.svg'
import styles from './Prizes.module.scss';

const TeamGift = () => {
    return (
        <Card className={styles.prizeCard}>
            <div>
            <h2>Exciting Gifts!</h2>

            <div className={styles.giftSvg}>
                <Gift/>
            </div>
             <div className={styles.giftText}>
                Answer these questions and claim your swag items!
             </div>
             </div>
        </Card>
    )
}

export default TeamGift;