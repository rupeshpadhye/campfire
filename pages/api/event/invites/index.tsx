import { getSession } from "next-auth/client";
import prisma from "../../../../lib/prisma";

const saveEventInvites = async ({ eventId, invites }) => { 
   const invitedMembers =  invites.map(id => {
     return prisma.eventInvite.create({
       data: {
            eventId: eventId,
            userId: id,
            status: 'pending'
       }
     });
   });
   const result = await Promise.all(invitedMembers);
    return result;
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

export default async function handle(req, res) {
    const { invites, eventId } = req.body;
    console.log(eventId, invites);

    const session = await getSession({ req });
    const { user } = session;
  
    switch (req.method) {
      case 'POST':
         const createdUsers =  await saveEventInvites({ eventId , invites});
           res.json({ invites: createdUsers });
        break;
      case 'GET':
         const eventUses = await findEventInvites(eventId);
         res.json(eventUses);
  
      default:
          return res.status(405).end(`Method ${req.method} Not Allowed`)
      }
  
  }

