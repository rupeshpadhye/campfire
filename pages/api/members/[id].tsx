import { getSession } from "next-auth/client";
import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const memberId = parseInt(req.query.id);
  const session = await getSession({ req });
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  try {
  switch (req.method) {
    case 'DELETE':
        return removeMember();
    default:
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch(e) {
      return res.status(400).send({message: e.message});
  } 

    async function removeMember() { 

        await prisma.members.delete({
            where: { 
                membership: {
                    userId: memberId,
                    createdById: user.id  
                 }   
            }});
        return res.status(200).json({
            status: 'success',
            message: 'Member removed'});
    }
}