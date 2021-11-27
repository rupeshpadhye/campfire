import prisma from "../../../lib/prisma";
import get from "lodash/get";
import { getSession } from "next-auth/client";

export default async function handle(req, res) {
  const { answer, questionId } = req.body;
   const session = await getSession({ req });
  const result = await prisma.userQuestionAnswers.create({
    data: {
        user: {
            connect: {
                email: session.user.email
            }
        },
        videoData: get(answer, "videoData",{}),
        question: {
            connect: {
                id: questionId
            }
        }
    },
  });
  res.json(result);
}