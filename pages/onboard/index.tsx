import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import React from 'react';
import prisma from '../../lib/prisma';


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

        //TODO if there is no event invite should show register model
    
    
        

        // else  if(!session.user.name) {
        //         return {
        //             redirect: {
        //             destination: '/profile?complete=false',
        //             permanent: false,
        //             },
        //         };
        // } else {
        //         return {
        //                 redirect: {
        //                 destination: '/',
        //                 permanent: false,
        //                 },
        //             };
        // }         
        return {
            props: {
            },
        }
    }
}

const OnboardUser = () => { 
    return <div>Redirecting ...</div>
}

export default OnboardUser;