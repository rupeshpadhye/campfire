import { useSession } from 'next-auth/client';
import React, { useState, useEffect } from 'react';
import CompleteProfileModal from '../../containers/ProfileContainer/CompleteProfileModal';
import Layout from "../../components/AppLayout";

export default function Home() {
  return (
    <>
    <CompleteProfileModal/>
    <Layout>
        <h1>Participant Home Page</h1>
    </Layout>
    </>
  );
}

Home.defaultProps = {
  auth: {
    isPublic: false,
    redirect: '/',
    role: ['member'],
  }
};
