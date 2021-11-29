import { getSession } from "next-auth/client";
import prisma from "../../../../lib/prisma";
import groupBy from 'lodash/groupBy';
import values from 'lodash/values';

const getEventResponses = async ({ eventId }) => {
  const results = await prisma.userQuestionAnswers.findMany({
    where: {
      question: { is: { event: {is : { id: eventId } } } },
    },
    include: {
      user: true,
      question: { select: { id: true, title:true, desc: true } },
    }
  });
  const groupByUser = values(groupBy(results, 'user.email')).map(groupedResult => {
    const responses = groupedResult.map(result => {
      const { user , question, ...other } = result;
        return {
        ...question,
        answer: other,
      }
    })
    return {
      user: groupedResult[0].user,
      responses,
    }
  })


  return groupByUser;
}   

export default async function handle(req, res) {
    const eventId = parseInt(req.query.eventId);
    try{
        switch (req.method) {
          case 'GET':
            const results =  await getEventResponses({ eventId });
              res.json({ responses: results });
            break;
          default:
              return res.status(405).end(`Method ${req.method} Not Allowed`)
          }
    } catch (error) {
        console.error(error);
        res.status(500).end(error.message);
    }
  }

