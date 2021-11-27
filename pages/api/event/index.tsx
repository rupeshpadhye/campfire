import { getSession } from "next-auth/client";
import prisma from "../../../lib/prisma";
import get from "lodash/get";
import safeJsonStringify from "safe-json-stringify";

import { templates, kycTemplates  } from "../data";

export default async function handle(req, res) {
  const { event } = req.body;
  const { eventType } = req.query.eventType;
  const session = await getSession({ req });
  const userRole = get(session, "user.role");
  switch (req.method) {
    // case 'GET':
    //     const resp =  await getEvents(eventType);
    //     return res.json(resp);
    case 'POST':
        return createEvent();
    default:
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

  async function createEvent() {
      const result = await prisma.event.create({
        data: {
            ...event,
        author: { connect: { email: session?.user?.email } },
        },
      });
      res.json(result);
  }
  async function getEvents(eventType) {
    let events = [];
    if (userRole === "creator") {
      console.log("user is creator", session.user.email);
      events = await prisma.event.findMany({
        where: {
          author: { email: session.user.email },
          eventType: eventType,
          published: true,
        },
        include: {
          author: true,
        },
      });
      events = JSON.parse(safeJsonStringify(events));
      return { events, templateEvents: templates };
    } else {
      const invitedEvents = await prisma.eventInvite.findMany({
        where: {
          user: { email: session.user.email },
          event: { is: { eventType: eventType } },
        },
        include: {
          event: true,
        },
      });
      events = invitedEvents.map((invitedEvent) => invitedEvent.event);
      return { invitedEvents: events };

    }
  }
}