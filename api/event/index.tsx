import { getSession } from "next-auth/client";
import prisma from "../../lib/prisma";

export default async function handle(req, res) {
  const { event } = req.body;

  const session = await getSession({ req });

  const result = await prisma.event.create({
    data: {
        ...event,
    author: { connect: { email: session?.user?.email } },
    },
  });
  res.json(result);
}