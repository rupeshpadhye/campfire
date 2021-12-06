import prisma from "../../../../lib/prisma";
import get from 'lodash/get';

async function getClappedUsers(answerId) {
    const result = await prisma.answerClaps.findMany({
        select: {
            user: {
                select: {
                    image: true
                }
            }
        },
        where: {
           answerId: parseInt(answerId) 
        }
    });
    return result;
}

export default async function handle(req, res) {
  const answerId  = req.query.answerId;
  try {
  switch (req.method) {
    case 'GET':
       const result =  await getClappedUsers(answerId);
       const appreciatedBy = result.map(r => get(r,'user.image'))
       return res.json({ appreciatedBy });
     default:
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    } 
    }
    catch(e) {
        console.error(e);
        return res.status(400).send({ message: e.message});
    }
}