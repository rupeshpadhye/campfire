import { Prisma } from ".prisma/client";
import { getSession } from "next-auth/client";
import prisma from "../../../lib/prisma";


const createMember = async ({members, user}) => { 
  const usrInfo = await prisma.user.findUnique({ where: { email: user.email } });
  // const membersData = members
  //   .filter((m) => !m.id)
  //   .map((m) => ({ email: m, role: "member" }))
  //   .map((m) => prisma.user.create({ data: m }));
  //const createdUsers = await Promise.all(membersData);
  let membersData = members.map(m => {
          return {
          user:{ connectOrCreate: { where : {
            email: m
          }, 
          create: {
            email: m, role: 'member'
          }
        } },
          createdBy: { connect: { id: usrInfo.id } },
        }
  }).map(m => prisma.members.create({ data: m }));

  const result = await Promise.all(membersData);
  // @ts-ignore
  const userIds = result.map(u => u.userId);
  const users = await prisma.user.findMany({ where: { id: { in: userIds} } });
  return users;
}

const findMembers = async (user) => {
  // const usrInfo = await prisma.user.findUnique({ where: { email: user.email } });
  
  // const { id } = usrInfo;
  let memberCreatedByUser = await prisma.members.findMany({
    where: {
      createdBy: { is: {
        email: user.email
      }}
    },
    include: {
      user: true,
    },
  });
  console.log('memberCreatedByUser',memberCreatedByUser);
  const members = memberCreatedByUser.map(m => m.user);
  return members;
}

export default async function handle(req, res) {
  const { members } = req.body;

  const session = await getSession({ req });
  const { user } = session;
  try {
  switch (req.method) {
    case 'POST':
       const createdUsers =  await createMember({ members, user});
       return res.json({ members: createdUsers });
    case 'GET':
       const eventUses = await findMembers(user);
       return res.json(eventUses);
    default:
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch(e) {
    console.log('memebers api here');
    console.error(e);
    return res.status(400).send({ message: e.message});
  } 

}

