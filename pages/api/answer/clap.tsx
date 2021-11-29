import prisma from "../../../lib/prisma";
import get from "lodash/get";
import { getSession } from "next-auth/client";

const MAX_CLAPS = 3;

async function saveClaps({ answerId, email }) {
  const [{id: userId}, { totalClaps}] = await Promise.all([
    prisma.user.findUnique({
      select: { id: true },
      where: { email },
    }),
    prisma.userQuestionAnswers.findUnique({
      select: { totalClaps: true },
      where: {
        id: answerId,
      },
    }),
  ]);
  const record = await prisma.answerClaps.findUnique({
    where: {
      userAnswerClap: {
        userId,
        answerId,
      },
    },
  });

  if (record) {
    if (record.clapCount + 1 <= MAX_CLAPS) {
      await prisma.answerClaps.update({
        where: {
          id: record.id,
        },
        data: {
          clapCount: record.clapCount + 1,
        },
      });
    } else {
      throw new Error(`You have already clapped ${MAX_CLAPS} times!`);
    }
  } else {
    await prisma.answerClaps.create({
      data: {
        clapCount: 1,
        user: { connect: { id: userId } },
        answer: { connect: { id: answerId } },
      },
    });
  }
  const resp = await prisma.userQuestionAnswers.update({
    data: {
      totalClaps: totalClaps + 1,
    },
    where: {
      id: answerId,
    },
  });
  return resp;
}

export default async function handle(req, res) {
  const session = await getSession({ req });
 try {
  const { answerId } = req.body;
  switch (req.method) {
    case "POST":
      const resp = await saveClaps({
        answerId,
        email: get(session, "user.email"),
      });
      return res.json(resp);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }}
    catch (error) {
        return res.status(400).send({ message: error.message});
    }
}
