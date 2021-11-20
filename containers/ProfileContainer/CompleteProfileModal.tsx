import { useSession } from "next-auth/client";
import React, { useState, useEffect } from "react";
import get from "lodash/get";
import { Modal, Input, Button, Avatar, notification } from "antd";
import Welcome from "./../../public/welcome.svg";
import UploadButton from "../../components/UploadButton";
import JoyRide from "./../../public/joyride.svg";

import styles from "./CompleteProfileModal.module.scss";
import  Router  from "next/router";

const WelcomeHeader = () => {
  return (
    <div className={styles.welcomeHeader}>
      <Welcome />
    </div>
  );
};
const CompleteProfileModal = () => {
  const [session, loading] = useSession();
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [saving , setSaving ] = useState(false);
  useEffect(() => {
    const isProfileComplete =
      get(session, "user.name") && get(session, "user.image");
    if (session && !loading && !isProfileComplete) {
      setVisible(true);
      setName(get(session, "user.name"));
      setAvatar(get(session, "user.image"));
    }
  }, [session, loading]);

  const handleNameChange = (e) => {
    console.log(e.target.value);
    setName(e.target.value);
  };

  const handleAvatarChange = (res) => {
    get(res, "filesUploaded[0].url") &&
      setAvatar(get(res, "filesUploaded[0].url"));
  };
  const handleProfileSubmit = async () => {
  try {
      setSaving(true);
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image: avatar }),
      });
      setSaving(false);
      Router.reload();
  } catch (e) {
    console.log(e);
    setSaving(false);
    notification.error({
      message: "Error while updating profile",
    });
  };
 };

  if(!visible) {
    return null;
  }
  return (
    <div className={styles.fullScreenModal}>
      <div className={styles.joyride}>
        <JoyRide />
      </div>
      <Modal
        visible={visible}
        title={<WelcomeHeader />}
        forceRender={true}
        closable={false}
        maskStyle={{
          background: "white",
          backgroundImage: `linear-gradient(135deg, rgb(122, 101, 230) 0%, rgb(248, 187, 206) 100%)`,
          zIndex: 999,
        }}
        footer={
          <div className={styles.welcomeFooter}>
            <Button
              type="primary"
              onClick={handleProfileSubmit}
              className={styles.submitButton}
              loading={saving}
            >
              Save
            </Button>
          </div>
        }
        onCancel={() => setVisible(false)}
        maskClosable={false}
        className={styles.welcomeModal}
      >
        <h2> Complete Your Profile</h2>
        <div className={styles.welcomeBody}>
          <div className={styles.welcomeQuestion}>
            <div className={styles.avatarImg}>
              {avatar ? (
                <Avatar size={200} src={avatar} />
              ) : (
                <div className={styles.uploadButton}>
                  <UploadButton
                    type="text"
                    handleUpload={handleAvatarChange}
                    label="Update Profile Picture"
                  />
                </div>
              )}
              {avatar && (
                <UploadButton
                  type="text"
                  handleUpload={handleAvatarChange}
                  label="Update Profile Picture"
                />
              )}
            </div>
          </div>
          <div>
            {!get(session, "user.name") ? (
              <div className={styles.welcomeQuestion}>
                <Input
                  placeholder="Enter your name"
                  className={styles.nameInput}
                  onChange={handleNameChange}
                  value={name}
                />
              </div>
            ) : (
              <h4 style={{ textAlign: "center" }}>{`Hi ${get(
                session,
                "user.name"
              )}, Upload Your Profile Picture`}</h4>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CompleteProfileModal;
