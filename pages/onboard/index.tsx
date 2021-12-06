import { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/client';
import React from 'react';
import CompleteProfileModal from '../../containers/ProfileContainer/CompleteProfileModal';
import prisma from '../../lib/prisma';
import get from 'lodash';
import  Router  from "next/router";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await getSession({ req });
    if (session) {
        const pendingUser = await prisma.pendingUser.findUnique({
            where: {
                email: session.user.email
            }
        });
        //Assumption Subscription is purchased -- Need to implemet subscription logic
        if(pendingUser) {
        const [ user , deletedUser]  =   await Promise.all([
                prisma.user.update({ where: { email: session.user.email }, data: { role: 'creator', name: pendingUser.name } }),
                prisma.pendingUser.delete({ where: { email: session.user.email } }),
            ])
           await prisma.organization.create({
                data : { 
                    planId: pendingUser.planId,
                    name: pendingUser.company,
                    status: 'active',
                    paymentSuccessfulAt: new Date(),
                    createdBy: { connect: { email: session?.user?.email } },
                    billDate: new Date(),
                }});
        } 

        // TODO if there is no event invite should show register model

        return {
            redirect: {
            destination: '/',
            permanent: false,
            },
        };  
    } else {
        return {
            redirect: {
            destination: '/',
            permanent: false,
            },
        }; 
    }
}

const OnboardUser = () => { 
   const [ session , loading ] =  useSession();

   const isProfileComplete =
   get(session, "user.name") && get(session, "user.image");

   const handleVisible = () => {
        Router.reload();    
   }

  return <CompleteProfileModal visible={!isProfileComplete} setVisible={handleVisible}/>
}


export default OnboardUser;


OnboardUser.defaultProps = {
    auth: {
      isPublic: false,
      redirect: '/',
      role: ['creator', 'member'],
    }
  }