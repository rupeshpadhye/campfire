import { getSession } from "next-auth/client";
import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  try {
    const { event } = req.body;
    const { id, type, questions, ...other } = event;
    const session = await getSession({ req });
    console.log(other);
    const result = await prisma.event.create({
      data: {
          ...other,
        author: { connect: { email: session?.user?.email } },
      },
    });
    console.log(result);
    const eventId = result.id;
   const promises = questions.map( (question) => {
      const { id, ...other } = question;
       return prisma.question.create({
        data: {
          ...other,
          event: { connect: { id: eventId } },
        },
      });
    });
    const qResponse = await Promise.all(promises);
    res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }

}