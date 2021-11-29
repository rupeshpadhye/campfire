import { Card, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import ClapEmoji from '../../../components/ClapEmoji';
import get from 'lodash/get';
import { Avatar, Divider, Tooltip } from 'antd';
import { UserOutlined, AntDesignOutlined } from '@ant-design/icons';
import styles from './ClapsContainer.module.scss';

const ClapsContainer = ({ question , canClap})=> {

    const [ claps ,setClaps ] = useState(0);
    useEffect(()=>{
        setClaps(get(question,'answer.totalClaps',0));
    }
    ,[question]);

    const handleClap = async (answer) => {
        try {
            setClaps(claps+ 1);
            const response = await fetch(`/api/answer/clap`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ answerId: answer.id }),
            });
            const data = await response.json();
            if(!response.ok) {
                const message  = get(data, 'message');
                console.log(message);
                setClaps(claps - 1);
                notification.error({
                    message: message,
                });
                return;
            }
        } catch (error) {
            console.log(error);
        }
      };


    return <Card 
            title={ canClap ? 'Appreciate Your Team Members' : `Awesome!! Received ${claps} 👏 Claps`}
            extra={canClap ? <ClapEmoji                 count={claps}
            onClick={()=>handleClap(question)}/> : null}
            className={styles.clapsContainer}
            >
              <div>
           
                </div>
                <div>
                <h4> Claps Received From </h4>
                 <Avatar.Group>
                    <Avatar src="https://joeschmoe.io/api/v1/random" />
                    <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                    <Tooltip title="Ant User" placement="top">
                        <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                    </Tooltip>
                    <Avatar style={{ backgroundColor: '#1890ff' }} icon={<AntDesignOutlined />} />
                    </Avatar.Group>
                </div>
          </Card>
  }

export default ClapsContainer;