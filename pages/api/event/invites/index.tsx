import { getSession } from "next-auth/client";
import prisma from "../../../../lib/prisma";

const saveEventInvites = async ({ eventId, invites }) => { 
   const invitedMembers =  invites.map(id => {
     return prisma.eventInvite.create({
       data: {
            eventId: eventId,
            userId: id,
            status: 'pending'
       },
       include: {
          user: true,
        },
     });
   });
   const result = await Promise.all(invitedMembers);
   //@ts-ignore
   const eventInvites = result.map(r => r.user); 
   return eventInvites;
  }
  
  const findEventInvites = async (eventId) => {
      return  prisma.eventInvite.findMany({
        select: {
          id: true,
          status: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
          },
        },
      },
        where: {
          eventId
        },
      });
  }

async function removeParticipant({ userId, eventId } ) { 
    const result =    await prisma.eventInvite.delete({
           where: { 
               eventInvite: { userId , eventId }
           }});
       return result;
   }
   

export default async function handle(req, res) {
    const { invites, eventId, userId } = req.body;
    switch (req.method) {
      case 'POST':
         const createdUsers =  await saveEventInvites({ eventId , invites});
           res.json({ invites: createdUsers });
        break;
      case 'GET':
         const eventUses = await findEventInvites(eventId);
         res.json(eventUses);
      case 'DELETE':
          const result = await removeParticipant({ userId, eventId });
          res.json({ result });
      default:
          return res.status(405).end(`Method ${req.method} Not Allowed`)
      }
  
  }

