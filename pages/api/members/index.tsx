import { getSession } from "next-auth/client";
import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const { members } = req.body;

  const session = await getSession({ req });
  const { user } = session;

  const usrInfo = await prisma.user.findUnique({ where: { email: user.email } });
  const membersData = members
    .filter((m) => !m.id)
    .map((m) => ({ email: m, role: "member" }))
    .map((m) => prisma.user.create({ data: m }));
  const createdUsers = await Promise.all(membersData);
  let memberMappings = createdUsers.map(member => {
        return {
          user:{ connect: { id: member.id } },
          createdBy: { connect: { id: usrInfo.id } },
        }
  }).map(m => prisma.members.create({ data: m }));
  const result = await Promise.all(memberMappings);
  res.json(createdUsers);
}