import prisma from "../../../../lib/prisma";

export default async function handle(req, res) {
  const eventId = parseInt(req.query.eventId);
  try {
    switch (req.method) {
      case "PUT":
        const result = await updateEvent();
        return res.json(result);

      default:
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  async function updateEvent() {
      const { published } = await prisma.event.findUnique({
        select: {
          published: true,
        },
        where: { id: eventId },
      });
      const result = await prisma.event.update({
        where: {
          id: eventId,
        },
        data: {
          published: !published,
        },
      });
      return result;
    } 
}
