import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const { info } = req.body;
  //TODO add validation
  const result = await prisma.pendingUser.create({
    data: {
        ...info,
    },
  });
  res.json(result);
}