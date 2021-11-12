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
        //we can show subscription plans here
        if(pendingUser) {
            await Promise.all([
                prisma.user.update({ where: { email: session.user.email }, data: { role: 'creator' } }),
                prisma.pendingUser.delete({ where: { email: session.user.email } })
            ])
        }
        //redirect to profile page
        if(!session.user.name) {
            return {
                redirect: {
                destination: '/profile?complete=false',
                permanent: false,
                },
            };
        }
        return {
            redirect: {
            destination: '/',
            permanent: false,
            },
        };
    }
}

const OnboardUser = () => { 
    return <div>Redirecting ...</div>
}

export default OnboardUser;