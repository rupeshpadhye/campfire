import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const { question } = req.body;


  const result = await prisma.question.create({
    data: {
      ...question,
      event: { connect: { id: parseInt(req.query.eventId) } },
    },
  });
  res.json(result);
}