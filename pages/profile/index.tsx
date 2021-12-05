import { useSession } from "next-auth/client";
import { useEffect, useState } from "react";
import AppLayout from "../../components/AppLayout";
import styles from './Profile.module.scss';
import get from 'lodash';
import { Avatar, Button, Card, Input, notification } from "antd";
import UploadButton from "../../components/UploadButton";
import { EditOutlined } from "@ant-design/icons";
import CompleteProfileModal from "../../containers/ProfileContainer/CompleteProfileModal";
import { Row, Col } from 'antd';
import JoyRide from './../../public/joyride.svg';

const Profile = () => {
  const [ session, loading ] = useSession();
  const [name, setName] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (session && !loading ) {
      const { user} = session;
      setName(user.name);
      setAvatar(user.image);
    }
  }, [session, loading]);

  const editProfile = () => {
    setVisible(true);
  }
  return (
    <AppLayout>
      <CompleteProfileModal visible={visible} setVisible={setVisible} isDefaultModal={true}/>
       <Row>
         <Col md={12}>
          <JoyRide />
         </Col>
         <Col  md={12}>
         <div>
          <div className={styles.line}>
            <div className={styles.avatarImg}>
                <Avatar size={128} src={avatar} />
            </div>
            <h1>{name}</h1>
            <Button 
             onClick={() => { editProfile()}}
            className={styles.editButton} size='large' type='text' icon={<EditOutlined/>}/>
          </div>
        </div>
         </Col>
       </Row>
    

    </AppLayout>
  );
};

export default Profile;

Profile.defaultProps = {
  auth: {
    isPublic: false,
    redirect: '/',
    role: ['creator', 'member'],
  }
}